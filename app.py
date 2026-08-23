from flask import Flask, render_template, request, jsonify
import os

app = Flask(__name__)

def local_ai_reply(message):
    """Offline fallback so the project works without an API key."""
    text = message.strip()
    lower = text.lower()

    if not text:
        return "Please type a message and I'll be happy to help."

    greetings = ["hi", "hello", "hey", "hii", "good morning", "good evening"]
    if lower in greetings or any(lower.startswith(g + " ") for g in greetings):
        return "Hello! 👋 I'm your AI assistant. Ask me anything and I'll do my best to help."

    if "who are you" in lower or "what are you" in lower:
        return "I'm a demo AI chatbot built with Python, Flask, HTML, CSS and JavaScript."

    if "python" in lower:
        return "Python is a beginner-friendly, high-level programming language widely used for web development, automation, data science and AI/ML."

    if "html" in lower:
        return "HTML structures a web page, CSS controls its appearance, and JavaScript adds interaction and dynamic behavior."

    if "flask" in lower:
        return "Flask is a lightweight Python web framework. It is useful for building APIs and web applications quickly."

    if "thank" in lower:
        return "You're welcome! 😊 Let me know if you need anything else."

    return (
        f"That's an interesting question! You asked: “{text}”\n\n"
        "I'm currently running in offline demo mode, so I can respond using the built-in assistant. "
        "To connect a real AI model, add an API key in the environment and replace the API call in app.py."
    )

@app.get("/")
def home():
    return render_template("index.html")

@app.post("/api/chat")
def chat():
    data = request.get_json(silent=True) or {}
    message = str(data.get("message", "")).strip()

    if not message:
        return jsonify({"error": "Message cannot be empty."}), 400

    # Demo mode is intentionally reliable without exposing secrets in frontend code.
    reply = local_ai_reply(message)
    return jsonify({"reply": reply, "mode": "demo"})

@app.get("/api/health")
def health():
    return jsonify({"status": "ok", "service": "AI Chatbot Web Application"})

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=True)
