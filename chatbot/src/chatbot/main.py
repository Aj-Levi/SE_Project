#!/usr/bin/env python
import warnings
from flask import Flask, request, jsonify
from flask_cors import CORS
from .crew import Chatbot

warnings.filterwarnings("ignore", category=SyntaxWarning, module="pysbd")

app = Flask(__name__)
CORS(app) 

@app.route("/ask", methods=["POST"])
def ask_question():
    """Receive a question from frontend and return the chatbot's answer."""
    data = request.get_json()
    if not data or "question" not in data:
        return jsonify({"error": "Missing 'question' field"}), 400

    question = data["question"]

    try:
        result = Chatbot().crew().kickoff(inputs={"question": question})
        return jsonify({"answer": result.raw})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8000, debug=True)
