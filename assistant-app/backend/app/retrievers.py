import pickle
import os
from tqdm import tqdm
import numpy as np
import time
import torch

# For sparse retrieval
import nltk
from nltk.tokenize import word_tokenize
from nltk.corpus import stopwords
from rank_bm25 import BM25Plus

# For dense retrieval
from llama_index.core import VectorStoreIndex, SimpleDirectoryReader, Document
from llama_index.core import Settings
from llama_index.embeddings.huggingface import HuggingFaceEmbedding
from llama_index.core.vector_stores import SimpleVectorStore


def preprocess_text(text, language='french'):
    """Preprocess text for sparse retrieval"""
    # Lowercase
    text = text.lower()

    # Tokenize
    tokens = word_tokenize(text, language=language)

    # Remove stopwords and punctuation
    french_stopwords = set(stopwords.words(language))
    tokens = [token for token in tokens if token.isalnum() and token not in french_stopwords]

    return tokens

class BM25PlusRetriever:
    """BM25 Plus based retrieval model."""
    def __init__(self):
        self.bm25 = None
        self.tokenized_corpus = None
        self.doc_ids = None

    def fit(self, corpus, doc_ids):
        """Build the BM25 index."""
        print("Tokenizing corpus for BM25 Plus...")
        self.tokenized_corpus = [preprocess_text(doc) for doc in tqdm(corpus)]
        self.doc_ids = doc_ids

        print("Building BM25 Plus index...")
        self.bm25 = BM25Plus(self.tokenized_corpus)
        print("BM25 Plus index built successfully")

    def retrieve(self, query, top_k=5):
        """Retrieve top-k relevant documents."""
        query_tokens = preprocess_text(query)
        scores = self.bm25.get_scores(query_tokens)
        top_indices = np.argsort(scores)[::-1][:top_k]

        results = [(self.doc_ids[idx], scores[idx]) for idx in top_indices]
        return results

    def save(self, path):
        """Save the model to disk."""
        os.makedirs(os.path.dirname(path), exist_ok=True)
        with open(path, 'wb') as f:
            pickle.dump({
                'bm25': self.bm25,
                'doc_ids': self.doc_ids
            }, f)
        print(f"BM25 Plus model saved to {path}")

    @classmethod
    def load(cls, path):
        """Load the model from disk."""
        with open(path, 'rb') as f:
            data = pickle.load(f)
            model = cls()
            model.bm25 = data['bm25']
            model.doc_ids = data['doc_ids']
            print(f"BM25 Plus model loaded from {path}")
            return model

class DenseRetriever:
    """Dense retrieval model using LlamaIndex."""
    def __init__(self, embed_model_name="intfloat/multilingual-e5-large"):
        """Initialize with a multilingual embedding model that works well for French"""
        # Check if GPU is available
        device = "cuda" if torch.cuda.is_available() else "cpu"
        print(f"Using device: {device} for embeddings")

        self.embed_model = HuggingFaceEmbedding(
            model_name=embed_model_name,
            device=device
        )
        Settings.embed_model = self.embed_model
        self.index = None
        self.doc_ids = None

    def fit(self, documents):
        """Build the vector index from documents."""
        print("Building dense vector index...")
        start_time = time.time()

        # Store doc IDs for retrieval
        self.doc_ids = [doc.metadata['id'] for doc in documents]

        # Build index
        vector_store = SimpleVectorStore()
        self.index = VectorStoreIndex.from_documents(
            documents,
            vector_store=vector_store,
            show_progress=True
        )

        print(f"Vector index built in {time.time() - start_time:.2f} seconds")

    def retrieve(self, query, top_k=5):
        """Retrieve top-k relevant documents."""
        retriever = self.index.as_retriever(similarity_top_k=top_k)
        results = retriever.retrieve(query)

        retrieved_docs = []
        for node in results:
            doc_id = node.metadata["id"]
            score = node.score if hasattr(node, "score") else 0.0
            retrieved_docs.append((doc_id, score))

        return retrieved_docs

    def save(self, path):
        """Save the index to disk."""
        os.makedirs(path, exist_ok=True)
        self.index.storage_context.persist(persist_dir=path)

        # Save doc_ids separately since they're not stored in the index
        with open(os.path.join(path, "doc_ids.pkl"), "wb") as f:
            pickle.dump(self.doc_ids, f)

        print(f"Dense vector index saved to {path}")

    @classmethod
    def load(cls, path, embed_model_name="intfloat/multilingual-e5-large"):
        """Load the index from disk."""
        from llama_index.core import load_index_from_storage
        from llama_index.core import StorageContext

        if not os.path.exists(path):
            raise FileNotFoundError(f"Path not found: {path}")

        model = cls(embed_model_name=embed_model_name)
        storage_context = StorageContext.from_defaults(persist_dir=path)
        model.index = load_index_from_storage(storage_context)

        # Load doc_ids
        with open(os.path.join(path, "doc_ids.pkl"), "rb") as f:
            model.doc_ids = pickle.load(f)

        print(f"Dense vector index loaded from {path}")
        return model


class ReciprocalRankFusionRetriever:
    """Implements Reciprocal Rank Fusion for combining multiple retrieval methods."""

    def __init__(self, retrievers, k=20):
        """
        Args:
            retrievers: List of retriever models
            k: Constant to prevent items with very low ranks from having too much influence
        """
        self.retrievers = retrievers
        self.k = k
        self.name = f"RRF(k={k})"

    def retrieve(self, query, top_k=5, per_retriever_k=50):
        """Retrieve documents using RRF ranking."""
        # Get results from all retrievers
        all_results = []
        for retriever in self.retrievers:
            results = retriever.retrieve(query, top_k=per_retriever_k)
            all_results.append(results)

        # Calculate RRF scores
        rrf_scores = {}

        for result_set in all_results:
            for rank, (doc_id, _) in enumerate(result_set):
                if doc_id not in rrf_scores:
                    rrf_scores[doc_id] = 0
                # RRF formula: 1 / (k + rank)
                rrf_scores[doc_id] += 1 / (self.k + rank + 1)  # +1 because rank is 0-indexed

        # Sort by RRF score and return top-k
        sorted_results = sorted(rrf_scores.items(), key=lambda x: x[1], reverse=True)
        return sorted_results[:top_k]