# 🤖 AI Course Assistant Chatbot

A RAG-based AI chatbot that answers student questions using only the course content — no made-up answers. Built with LangChain, ChromaDB, Groq, FastAPI, and React.

---

## 📌 What it does

- Students ask questions on a course page
- The chatbot searches the course content and answers instantly
- Works for multiple courses — AI/ML, Full Stack, Web Dev
- Remembers conversation history for follow-up questions
- Only answers from course content — never makes up answers

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| LLM | Groq (llama-3.3-70b-versatile) |
| Vector DB | ChromaDB |
| Embeddings | HuggingFace (all-MiniLM-L6-v2) |
| Backend | FastAPI |
| Frontend | React + Vite |
| RAG Framework | LangChain |

---

## 📁 Project Structure
```
ai-course-chatbot/
├── backend/
│   ├── courses/          # Course content files (.txt, .pdf, .docx, .pptx)
│   ├── chroma_db/        # Vector database (auto-generated)
│   ├── main.py           # FastAPI app
│   ├── rag.py            # RAG pipeline + memory
│   └── ingest.py         # Course content ingestion
├── frontend/
│   └── chatbot/          # React chat widget
├── .env                  # API keys (not pushed to GitHub)
└── requirements.txt      # Python dependencies
```

---

## ⚙️ Setup Instructions

### 1. Clone the repository
```bash
git clone https://github.com/YOUR_USERNAME/ai-course-chatbot.git
cd ai-course-chatbot
```

### 2. Set up Python environment
```bash
python -m venv venv
venv\Scripts\activate  # Windows
source venv/bin/activate  # Mac/Linux
pip install -r requirements.txt
```

### 3. Set up environment variables
Create a `.env` file in the root folder:
```
GROQ_API_KEY=your_groq_api_key_here
```
Get your free Groq API key at [console.groq.com](https://console.groq.com)

### 4. Add course content
Add your course files to `backend/courses/`:
- Supported formats: `.txt`, `.pdf`, `.docx`, `.pptx`
- Update the courses dictionary in `backend/ingest.py`

### 5. Ingest course content
```bash
python backend/ingest.py
```

### 6. Start the backend
```bash
uvicorn backend.main:app --reload --port 8001
```

### 7. Start the frontend
```bash
cd frontend/chatbot
npm install
npm run dev
```

### 8. Open the app
Go to `http://localhost:5173` in your browser.

---

## ➕ How to Add a New Course

1. Add your course file to `backend/courses/`
2. Open `backend/ingest.py` and add your course:
```python
courses = {
    "aiml":       ["aiml.txt"],
    "fullstack":  ["fullstack.txt"],
    "newcourse":  ["newcourse.pdf"],  # Add this
}
```
3. Run `python backend/ingest.py`
4. Use `courseId="newcourse"` in the React widget

---

## 🚀 Embedding on a Website

Add the chat widget to any React page:
```jsx
import ChatWidget from "./ChatWidget";

// On your course page
<ChatWidget courseId="aiml" />
```

---

## 📊 API Reference

### POST /chat
```json
Request:
{
  "question": "What is overfitting?",
  "course_id": "aiml",
  "session_id": "unique_session_id"
}

Response:
{
  "answer": "Overfitting is when..."
}
```

---

## 👨‍💻 Developer

Built by **Utsav** as a solo 6-week project.
- Timeline: 6 weeks, 2-3 hours/day
- Cost: Rs. 0 (all free tools)

---

## 🔮 Future Enhancements

- Voice input support
- Admin dashboard for adding courses
- Analytics on most asked questions
- Multi-language support
- Student progress tracking