# AI Chatbot Web Application — Task 1

A clean, responsive AI chatbot web application built with Python + Flask + HTML/CSS/JavaScript.

## Features
- Attractive landing/chat UI
- User message + chatbot response system
- Flask backend API
- Loading/typing animation
- Responsive mobile/desktop design
- Chat history saved in browser localStorage
- Clear chat button
- Dark/light mode
- Voice input using browser Web Speech API when supported
- Copy assistant responses
- Offline demo responses, so the project works without an API key
- Render-ready deployment files

## Run locally

```bash
pip install -r requirements.txt
python app.py
```

Open `http://localhost:5000`

## Deploy on Render
1. Push this folder to GitHub.
2. Create a new Web Service on Render.
3. Select the GitHub repository.
4. Build command: `pip install -r requirements.txt`
5. Start command: `gunicorn app:app`
6. Deploy.

`render.yaml` is also included for configuration.

## Important
The demo mode does not expose an API key in the browser. For a real AI provider, add the provider's SDK/server-side request inside `app.py` and keep the secret in an environment variable.
