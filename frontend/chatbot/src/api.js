import axios from "axios";

const API_URL = "http://127.0.0.1:8001";

export const generateSessionId = () => {
  return "session_" + Math.random().toString(36).substring(2, 9);
};

export const sendMessage = async (question, courseId, sessionId) => {
  try {
    const response = await axios.post(
      `${API_URL}/chat`,
      {
        question: question,
        course_id: courseId,
        session_id: sessionId,
      },
      {
        timeout: 30000, // 30 seconds timeout
      }
    );
    return response.data.answer;
  } catch (error) {
    if (error.code === "ECONNABORTED") {
      return "Sorry, the response is taking too long. Please try again.";
    }
    console.error("API Error:", error);
    return "Sorry, something went wrong. Please try again.";
  }
};