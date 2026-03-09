import os
from langchain_community.document_loaders import (
    TextLoader,
    PyPDFLoader,
    Docx2txtLoader,
    UnstructuredPowerPointLoader,
)
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_chroma import Chroma

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

def get_loader(file_path):
    ext = os.path.splitext(file_path)[1].lower()
    if ext == ".pdf":
        return PyPDFLoader(file_path)
    elif ext == ".docx":
        return Docx2txtLoader(file_path)
    elif ext in [".pptx", ".ppt"]:
        return UnstructuredPowerPointLoader(file_path)
    else:
        return TextLoader(file_path, encoding="utf-8")

def ingest_course(course_id, files):
    print(f"\nIngesting course: {course_id}")
    
    embeddings = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")
    splitter = RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=50)
    all_chunks = []

    for file_name in files:
        file_path = os.path.join(BASE_DIR, "courses", file_name)
        if not os.path.exists(file_path):
            print(f"  File not found: {file_name} — skipping")
            continue
        print(f"  Loading: {file_name}")
        loader = get_loader(file_path)
        documents = loader.load()
        chunks = splitter.split_documents(documents)
        all_chunks.extend(chunks)
        print(f"  {len(chunks)} chunks from {file_name}")

    if not all_chunks:
        print(f"  No content found for {course_id} — skipping")
        return

    persist_path = os.path.join(BASE_DIR, "chroma_db", course_id)
    Chroma.from_documents(all_chunks, embeddings, persist_directory=persist_path)
    print(f"  Done! {len(all_chunks)} total chunks saved to chroma_db/{course_id}")

# ── CONFIGURE YOUR COURSES HERE ──────────────────────────────
# Add all files for each course below
# Supports: .txt, .pdf, .docx, .pptx
courses = {
    "aiml":       ["aiml.txt"],
    "fullstack":  ["fullstack.txt"],
    "webdev":     ["webdev.txt"],
}
# ─────────────────────────────────────────────────────────────

if __name__ == "__main__":
    for course_id, files in courses.items():
        ingest_course(course_id, files)
    print("\nAll courses ingested successfully!")