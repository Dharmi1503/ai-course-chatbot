from dotenv import load_dotenv
import os
from langchain_groq import ChatGroq

# Load API key from .env file
load_dotenv()

# Create the LLM object
llm = ChatGroq(
    model="llama-3.3-70b-versatile",
    groq_api_key=os.getenv("GROQ_API_KEY")
)

# Send a test message
response = llm.invoke("What is machine learning?")

print(response.content)