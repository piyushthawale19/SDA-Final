# 🤖 Black Venom AI Chatbot Setup

## Quick Setup Guide

### Step 1: Create .env File

Create a new file named `.env` in the `frontend` folder:

**Location:** `d:\Downloads\Desktop\Final Year2\SDA\frontend\.env`

**Content:**
```env
VITE_GEMINI_API_KEY=AIzaSyC60wZbiox7ZZdso8rU-ujqz7ydJ7a3f_Q
```

⚠️ **IMPORTANT:** 
- Copy your API key from `.env.example` to `.env`
- The `.env` file is gitignored for security
- Never commit your API key to version control

### Step 2: Restart Development Server

After creating the `.env` file, restart your dev server:

```bash
# Stop the current server (Ctrl+C)
# Then restart:
npm run dev
```

### Step 3: Test the Chatbot

1. Open your landing page
2. Click the floating chatbot button (bottom-right)
3. Send a test message like "hi" or "what can you do?"

## Chatbot Features

✅ **Brief, Conversational Responses** - Trained to give concise answers (2-4 sentences)
✅ **Smart Context** - Understands it's a Smart Developer Assistant chatbot
✅ **Typing Effect** - Word-by-word animation
✅ **Response Time** - Shows AI response time
✅ **Error Handling** - User-friendly error messages with emojis
✅ **Black Venom Branding** - Custom logo and matching design

## Troubleshooting

### Error: "API Key Missing"
- Make sure `.env` file exists in the frontend folder
- Verify the API key is correctly copied
- Restart the dev server

### Error: "Authentication Failed"
- Your API key might be invalid or expired
- Get a new key from: https://makersuite.google.com/app/apikey
- Update the `.env` file with the new key

### Error: "Too Many Requests"
- You've hit the rate limit
- Wait a few minutes before trying again
- Consider upgrading your Gemini API plan

## API Key Security

🔒 **Best Practices:**
- Never share your API key publicly
- Don't commit `.env` to git
- Rotate keys regularly
- Use environment variables in production

---

**Need Help?** Check the error messages in the chatbot - they provide specific guidance!
