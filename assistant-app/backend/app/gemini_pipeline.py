import os
import json
import requests
import time
from typing import List, Dict, Tuple
from .retrievers import BM25PlusRetriever, DenseRetriever, ReciprocalRankFusionRetriever

# how to get the gemini api key from .env file
from dotenv import load_dotenv
load_dotenv()


class GeminiLegalRAGPipeline:
    def __init__(
        self,
        api_key: str = os.getenv("GEMINI_API_KEY"),
        model_name: str = "gemini-2.0-flash",
        sparse_model_path: str = "../../knowledge_base/vector_store/sparse/bm25_plus.pkl",
        dense_model_path: str = "../../knowledge_base/vector_store/dense/legal_dense_index",
        hybrid_config_path: str = "../../hybrid-retrieval/hybrid_config.json",
        corpus_lookup_path: str = "../../knowledge_base/vector_store/corpus_lookup.pkl",
        top_k: int = 3
    ):
        self.top_k = top_k
        self.api_key = api_key or os.environ.get("GEMINI_API_KEY")
        if not self.api_key:
            raise ValueError("Gemini API key is required. Provide it as a parameter or set GEMINI_API_KEY environment variable.")
        
        self.model_name = model_name
        self.api_url = f"https://generativelanguage.googleapis.com/v1beta/models/{self.model_name}:generateContent?key={self.api_key}"
        
        print("Initializing Gemini Legal RAG Pipeline...")
        import pickle
        with open(corpus_lookup_path, 'rb') as f:
            self.corpus_data = pickle.load(f)
        print(f"Loaded corpus with {len(self.corpus_data['doc_ids'])} documents")
        self._load_retrieval_models(sparse_model_path, dense_model_path, hybrid_config_path)
        print("Gemini Legal RAG Pipeline initialized successfully!")

    def _load_retrieval_models(self, sparse_model_path, dense_model_path, hybrid_config_path):
        print("Loading BM25+ retriever...")
        self.sparse_model = BM25PlusRetriever.load(sparse_model_path)
        print("Loading dense retriever...")
        self.dense_model = DenseRetriever.load(dense_model_path)
        with open(hybrid_config_path, 'r') as f:
            hybrid_config = json.load(f)
        self.hybrid_retriever = ReciprocalRankFusionRetriever(
            self.sparse_model, self.dense_model
        )

    def _create_legal_system_prompt(self):
        return ("""Tu es LegalBot, un conseiller juridique marocain expérimenté (comme un avocat ou un juge).
                Ton rôle est de répondre à des questions juridiques en te basant uniquement sur le **contexte légal disponible dans ma base de données**. Ne fais **aucune hypothèse** et ne t'appuie jamais sur ta propre connaissance.

                Ta réponse doit respecter les consignes suivantes :

                1. ✅ Utilise **uniquement** les articles de loi du contexte disponible.
                2. 📜 Si un article est cité, mentionne son **numéro** et le **code de loi** d'où il vient (ex. *Article 32 du Code de la Famille*).
                3. ❓ Si le contexte disponible ne contient pas assez d'informations pour répondre précisément, réponds avec l'une de ces phrases professionnelles :
                - "D'après les textes de loi disponibles dans ma base de données, je ne trouve pas suffisamment d'informations pour répondre complètement à votre question."
                - "Les dispositions légales actuellement disponibles ne me permettent pas de vous donner une réponse précise sur ce point."
                - "Cette question nécessite une consultation des textes de loi qui ne sont pas disponibles dans ma base de données actuelle."
                - "Je vous recommande de consulter un avocat pour obtenir des informations complètes sur ce sujet, car les textes disponibles ne couvrent pas suffisamment cette question."
                4. 🗣️ Parle comme un avocat marocain : professionnel, clair, humain et direct. Pas de langage robotique ou compliqué.
                5. 📌 Sois **bref, utile et facile à comprendre** pour une personne non juriste.
                6. 🔢 Si la réponse est complexe, utilise une **liste numérotée**.
                7. 🚫 Ne dis JAMAIS "les articles que vous m'avez fournis" ou "les documents que vous avez fournis" - c'est MOI qui récupère automatiquement les textes pertinents.
                
                IMPORTANT : Répondez uniquement en utilisant les textes de loi disponibles dans le contexte ci-dessous. 
                Si aucune réponse claire ne peut être déduite des dispositions disponibles, utilisez les phrases professionnelles suggérées ci-dessus.
                """)


    def _needs_legal_context(self, query: str) -> bool:
        """Determine if the query requires legal context."""
        # List of common non-legal queries
        non_legal_phrases = [
            "bonjour", "hello", "salut", "hi", "hey",
            "comment ça va", "how are you",
            "merci", "thank you", "thanks",
            "au revoir", "goodbye", "bye",
            "aide", "help", "aider",
            "que peux-tu faire", "what can you do",
            "qui es-tu", "who are you"
        ]
        
        # Check if query is a simple greeting or non-legal question
        query_lower = query.lower().strip()
        if any(phrase in query_lower for phrase in non_legal_phrases):
            return False
            
        # Check if query contains legal-related keywords
        legal_keywords = [
            # General legal domains
            "droit", "loi", "juridique", "légal", "illégal",
            "code", "article", "texte de loi", "disposition", "texte législatif",
            # Family Law (Code de la Famille)
            "mariage", "divorce", "garde", "enfant", "pension", "naissance", "filiation",
            "adoption", "kafala", "polygamie", "mahr", "idda", "talaq", "khula",
            # Criminal Law
            "crime", "délit", "infraction", "sanction", "peine", "tribunal", "plainte", "détention",
            "amende", "prison", "viol", "vol", "agression", "condamnation", "punition",
            # Civil/Commercial
            "contrat", "bail", "location", "propriété", "succession", "héritage", "cession",
            "entreprise", "commerce", "registre", "immatriculation", "dépôt",
            # Labor
            "travail", "licenciement", "salaire", "congé", "indemnité", "employeur", "employé",
            # Procedure / litigation
            "procédure", "recours", "appel", "jugement", "audience", "justice",
            "avocat", "juridiction", "ministère public",
            # Arabic romanized (frequent Moroccan queries)
            "moudawana", "talak", "mouda", "kafala", "zawaj", "maher", "mirath", "faskh", "mahkama",
            "zakat", "nikah", "iddah", "shahada"
        ]
        
        return any(keyword in query_lower for keyword in legal_keywords)

    def _format_response(self, response: str) -> str:
        """Format the response to improve readability."""
        # Remove any prefixes
        response = response.replace("assistant:", "").replace("assistant :", "").strip()
        response = response.replace("Answer:", "").replace("Réponse:", "").strip()
        
        # Format lists
        lines = response.split('\n')
        formatted_lines = []
        in_list = False
        
        for line in lines:
            line = line.strip()
            if not line:
                formatted_lines.append('')
                continue
                
            # Detect list items
            if line.startswith(('- ', '• ', '* ')):
                if not in_list:
                    formatted_lines.append('')  # Add space before list
                formatted_lines.append(line)
                in_list = True
            elif line[0].isdigit() and '. ' in line[:5]:
                if not in_list:
                    formatted_lines.append('')  # Add space before list
                formatted_lines.append(line)
                in_list = True
            else:
                if in_list:
                    formatted_lines.append('')  # Add space after list
                formatted_lines.append(line)
                in_list = False
        
        return '\n'.join(formatted_lines)

    def _create_general_system_prompt(self):
        return ("Vous êtes LegalAssistant, un conseiller juridique professionnel spécialisé en droit marocain. "
                "Répondez de manière professionnelle et concise.")

    def _call_gemini_api(self, prompt, stream=False):
        """Call the Gemini API and return the response."""
        headers = {
            'Content-Type': 'application/json'
        }
        
        payload = {
            "contents": [{
                "parts": [{"text": prompt}]
            }],
            "generationConfig": {
                "temperature": 0.5,
                "topP": 0.9,
                "topK": 40,
                "maxOutputTokens": 800 if self._needs_legal_context(prompt) else 300
            }
        }
        
        try:
            response = requests.post(self.api_url, headers=headers, json=payload)
            response.raise_for_status()
            result = response.json()
            
            if "candidates" in result and len(result["candidates"]) > 0:
                text = ""
                for part in result["candidates"][0]["content"]["parts"]:
                    if "text" in part:
                        text += part["text"]
                return text
            else:
                return "Je suis désolé, je n'ai pas pu générer une réponse. Veuillez réessayer."
        
        except requests.exceptions.HTTPError as http_err:
            print(f"HTTP error occurred: {http_err}")
            print(f"Response content: {response.text}")
            return f"Une erreur s'est produite lors de la communication avec l'API Gemini. Erreur HTTP: {http_err}"
        except requests.exceptions.ConnectionError as conn_err:
            return f"Problème de connexion à l'API Gemini: {conn_err}"
        except requests.exceptions.Timeout as timeout_err:
            return f"Délai d'attente dépassé lors de la connexion à l'API Gemini: {timeout_err}"
        except requests.exceptions.RequestException as req_err:
            return f"Une erreur s'est produite avec l'API Gemini: {req_err}"
        except ValueError as val_err:
            return f"Erreur lors du traitement de la réponse de l'API Gemini: {val_err}"

    def answer_question(self, query: str, stream: bool = False) -> Tuple[str, List[Dict], dict]:
        if not self._needs_legal_context(query):
            # Handle non-legal queries directly
            system_prompt = self._create_general_system_prompt()
            prompt = f"{system_prompt}\n\nUser: {query}"
            response = self._call_gemini_api(prompt, stream=stream)
            return self._format_response(response), [], {}
        else:
            # Handle legal queries with context
            documents = self.retrieve_documents(query)
            context = self.format_context(documents)
            system_prompt = self._create_legal_system_prompt()
            
            prompt = (
                f"{system_prompt}\n\n"
                f"# Question: {query}\n\n"
                f"# Contexte juridique pertinent:\n{context}\n\n"
                "IMPORTANT: Répondez UNIQUEMENT en utilisant le contexte juridique fourni ci-dessus. "
                "N'utilisez aucune autre connaissance. Si le contexte ne contient pas d'informations pertinentes, "
                "indiquez que vous n'avez pas assez d'informations pour répondre complètement."
            )
            
            response = self._call_gemini_api(prompt, stream=stream)
            return self._format_response(response), documents, {}

    def retrieve_documents(self, query: str) -> List[Dict]:
        results = self.hybrid_retriever.retrieve(query, top_k=self.top_k)
        documents = []
        for doc_id, score in results:
            document_text = self.corpus_data['corpus_lookup'].get(doc_id, "")
            doc_idx = self.corpus_data['doc_ids'].index(doc_id) if doc_id in self.corpus_data['doc_ids'] else -1
            if doc_idx >= 0 and doc_idx < len(self.corpus_data['documents']):
                metadata = self.corpus_data['documents'][doc_idx].metadata
            else:
                metadata = {'id': doc_id}
            documents.append({
                'id': doc_id,
                'text': document_text,
                'score': score,
                'metadata': metadata
            })
        return documents

    def format_context(self, documents: List[Dict]) -> str:
        context_parts = []
        for i, doc in enumerate(documents):
            article_ref = self._format_article_reference(doc['metadata'])
            context_parts.append(f"[Document {i+1}] {article_ref}\n{doc['text']}")
        return "\n\n" + "\n\n".join(context_parts)

    def _format_article_reference(self, metadata: Dict) -> str:
        parts = []
        if 'code_display' in metadata:
            parts.append(metadata['code_display'])
        elif 'code' in metadata:
            parts.append(metadata['code'].replace('_', ' ').title())
        if 'article_number' in metadata:
            parts.append(f"Article {metadata['article_number']}")
        elif 'article_id' in metadata:
            parts.append(f"Article {metadata['article_id']}")
        elif 'reference' in metadata:
            parts.append(metadata['reference'])
        return " - ".join(parts) if parts else "Unknown Reference"

# Helper function to format article responses for the frontend
def format_article_response(doc: Dict) -> Dict:
    meta = doc['metadata']
    return {
        "article_number": meta.get("article_number") or meta.get("article_id") or meta.get("reference"),
        "code": meta.get("code_display") or (meta.get("code").replace('_', ' ').title() if meta.get("code") else None),
        "text": doc["text"]
    }