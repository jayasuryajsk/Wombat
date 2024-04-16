from flask import Flask, request, jsonify, render_template
from ollama import Client
from flask import json
import ollama

app = Flask(__name__)
OLLAMA_API_URL = 'http://localhost:11434'  # Replace with your actual Ollama API URL
client = Client(host=OLLAMA_API_URL)

chat_threads = []



# Default system prompt
DEFAULT_SYSTEM_PROMPT = "You are a helpful assistant."

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/chat-threads', methods=['GET'])
def get_chat_threads():
    return jsonify(chat_threads)

@app.route('/api/models', methods=['GET'])
def get_models():
    try:
        models = ollama.list()
        model_names = [model['name'] for model in models['models']]
        return jsonify({'models': [{'name': name} for name in model_names]})
    except Exception as e:
        print("Error fetching models:", e)
        return jsonify({'error': str(e)}), 500

@app.route('/api/chat', methods=['POST'])
def chat():
    data = request.get_json()
    thread_index = data.get('threadIndex', -1)
    message = data['message']
    system_prompt = data.get('systemPrompt', DEFAULT_SYSTEM_PROMPT)
    model = data.get('model', 'dolphin-mistral:latest')  # Get the selected model from the request data

    if thread_index == -1 or thread_index >= len(chat_threads):
        # If no threads exist or index is out of range, start a new chat thread
        new_thread_name = f'Chat {len(chat_threads) + 1}'
        new_thread = {'name': new_thread_name, 'messages': [message], 'systemPrompt': system_prompt}
        chat_threads.append(new_thread)
        thread_index = len(chat_threads) - 1
    else:
        # Add message to the existing chat thread
        chat_threads[thread_index]['messages'].append(message)
        chat_threads[thread_index]['systemPrompt'] = system_prompt

    # Try to generate assistant's response using streaming
    try:
        if not system_prompt:
            system_prompt = DEFAULT_SYSTEM_PROMPT

        messages = [{'role': 'system', 'content': system_prompt}]
        if chat_threads[thread_index]['messages']:
            messages.extend(chat_threads[thread_index]['messages'])
        response = client.chat(model=model, messages=messages, stream=True)  # Use the selected model

        def generate():
            assistant_message = ''
            for chunk in response:
                assistant_message += chunk['message']['content']
                yield f"data: {json.dumps({'message': assistant_message})}\n\n"
            chat_threads[thread_index]['messages'].append({'role': 'assistant', 'content': assistant_message})

        return app.response_class(generate(), mimetype='text/event-stream')
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)