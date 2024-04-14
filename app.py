from flask import Flask, request, jsonify, render_template
import requests

app = Flask(__name__)

# Configuration
OLLAMA_API_URL = "http://localhost:11434"  # Update with your Ollama API URL

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/api/models")
def get_models():
    response = requests.get(f"{OLLAMA_API_URL}/api/tags")
    models = response.json()["models"]
    return jsonify({"models": models})

@app.route("/api/generate", methods=["POST"])
def generate():
    data = request.get_json()
    model = data.get("model")
    prompt = data.get("prompt")

    response = requests.post(
        f"{OLLAMA_API_URL}/api/generate",
        json={"model": model, "prompt": prompt},
        stream=True,
    )

    def generate_response():
        for chunk in response.iter_content(chunk_size=None):
            yield chunk

    return app.response_class(generate_response(), mimetype="application/json")

@app.route("/api/chat", methods=["POST"])
def chat():
    data = request.get_json()
    model = data.get("model")
    messages = data.get("messages")

    response = requests.post(
        f"{OLLAMA_API_URL}/api/chat",
        json={"model": model, "messages": messages},
        stream=True,
    )

    def generate_response():
        for chunk in response.iter_content(chunk_size=None):
            yield chunk

    return app.response_class(generate_response(), mimetype="text/event-stream")

if __name__ == "__main__":
    app.run()