from dotenv import load_dotenv
import os
from langchain_groq import ChatGroq
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_chroma import Chroma

load_dotenv()

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

embeddings = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")

llm = ChatGroq(
    model="llama-3.3-70b-versatile",
    groq_api_key=os.getenv("GROQ_API_KEY")
)

session_histories = {}

def get_retriever(course_id):
    persist_path = os.path.join(BASE_DIR, "chroma_db", course_id)
    vectordb = Chroma(
        persist_directory=persist_path,
        embedding_function=embeddings
    )
    return vectordb.as_retriever(search_kwargs={"k": 3})

def get_answer(question, course_id, session_id):
    if session_id not in session_histories:
        session_histories[session_id] = []

    history = session_histories[session_id]
    retriever = get_retriever(course_id)
    docs = retriever.invoke(question)
    context = "\n\n".join([doc.page_content for doc in docs])

    history_text = ""
    for msg in history[-5:]:
        history_text += f"{msg['role']}: {msg['content']}\n"

    prompt = f"""
You are a helpful course assistant. Answer the student's question using the course content below.
Always answer in simple, beginner-friendly language.

FORMATTING RULES — ALWAYS FOLLOW:
- Never write long paragraphs
- Always use short bullet points
- Bold the key terms using **term**
- Maximum 2-3 sentences per point
- Give a short real-life example at the end
- Keep the total answer short and scannable

Course Content:
{context}
Previous Conversation (use this to understand follow-up questions):
{history_text}

Student Question: {question}

Important: If the student asks a follow-up like "give more examples", "explain more", "why is that" — always refer back to the previous conversation topic above.
Answer:
"""

    response = llm.invoke(prompt)
    answer = response.content

    history.append({"role": "Student", "content": question})
    history.append({"role": "Assistant", "content": answer})

    return answer