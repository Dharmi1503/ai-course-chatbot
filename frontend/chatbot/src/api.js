import axios from "axios";

const API_URL = "http://127.0.0.1:8001";

export const generateSessionId = () => {
  return "session_" + Math.random().toString(36).substring(2, 9);
};

export const sendMessage = async (question, courseId, sessionId) => {
  try {
    const response = await axios.post(`${API_URL}/chat`, {
      question: question,
      course_id: courseId,
      session_id: sessionId,
    });
    return response.data.answer;
  } catch (error) {
    console.error("API Error:", error);
    return "Sorry, something went wrong. Please try again.";
  }
};