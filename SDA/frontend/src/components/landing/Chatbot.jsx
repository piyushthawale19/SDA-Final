import React, { useState, useRef, useEffect } from "react";

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      type: "bot",
      text: "Hello! I'm Black Venom AI Assistant. How can I help you today?",
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [responseTime, setResponseTime] = useState(null);
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const typeMessage = async (text, messageId) => {
    const words = text.split(" ");
    let currentText = "";

    for (let i = 0; i < words.length; i++) {
      currentText += (i > 0 ? " " : "") + words[i];
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === messageId ? { ...msg, text: currentText } : msg
        )
      );
      await new Promise((resolve) => setTimeout(resolve, 50));
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = {
      type: "user",
      text: inputMessage,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setIsTyping(true);
    setResponseTime(null);

    const startTime = Date.now();

    try {
      // MOCK CHATBOT: Using hardcoded responses that don't require any external API
      // This ensures the chatbot always works regardless of API issues

      // Simple response logic based on user input
      let botResponse = "";
      const query = inputMessage.toLowerCase();

      // Simulate API call delay (0.5 to 1.5 seconds)
      await new Promise((resolve) =>
        setTimeout(resolve, 500 + Math.random() * 1000)
      );

      if (query.includes("hello") || query.includes("hi") || query === "hey") {
        botResponse =
          "Hello! I'm Black Venom AI. How can I help you with your development project today?";
      } else if (query.includes("help") || query.includes("what can you do")) {
        botResponse =
          "I can help with various development tasks! I can assist with coding, explain features of Smart Developer Assistant, or answer questions about our platform.";
      } else if (
        query.includes("feature") ||
        query.includes("what does this app do")
      ) {
        botResponse =
          "Smart Developer Assistant offers real-time collaboration, AI code generation, and in-browser code execution. You can work with team members seamlessly on projects!";
      } else if (
        query.includes("code") ||
        query.includes("javascript") ||
        query.includes("react")
      ) {
        botResponse =
          "I can help with coding questions! Our platform supports various languages including JavaScript, React, Python, and more with real-time collaboration.";
      } else if (query.includes("thank")) {
        botResponse =
          "You're welcome! Feel free to reach out if you have any other questions. I'm here to help!";
      } else if (query.includes("bye") || query.includes("goodbye")) {
        botResponse =
          "Goodbye! Have a great day. Feel free to chat again whenever you need assistance!";
      } else if (query.includes("how are you")) {
        botResponse =
          "I'm functioning well, thank you for asking! How can I assist you with your development tasks today?";
      } else if (query.includes("name")) {
        botResponse =
          "I'm Black Venom AI, your friendly assistant in the Smart Developer Assistant platform. How can I help you?";
      } else if (query.includes("project") || query.includes("create")) {
        botResponse =
          "To create a new project in Smart Developer Assistant, use the 'New Project' button on your dashboard. You can choose from templates or start from scratch!";
      } else {
        botResponse =
          "Thanks for your message! I'm Black Venom AI, here to help with development tasks. Can you provide more details about what you're looking for?";
      }

      const endTime = Date.now();
      const timeTaken = ((endTime - startTime) / 1000).toFixed(2);
      setResponseTime(timeTaken);

      const botMessageId = Date.now();
      const botMessage = {
        id: botMessageId,
        type: "bot",
        text: "",
        timestamp: new Date(),
        responseTime: timeTaken,
      };

      setMessages((prev) => [...prev, botMessage]);
      setIsTyping(false);

      await typeMessage(botResponse, botMessageId);
    } catch (error) {
      console.error("Chatbot error:", error);
      console.error("Error response:", error.response?.data);
      console.error("Error status:", error.response?.status);
      setIsTyping(false);

      let errorMessage = "Oops! Something went wrong. ";
      let errorDetails = "";

      if (error.message === "Gemini API key not configured") {
        errorMessage = "🔑 API Key Missing!";
        errorDetails =
          "Please add your Gemini API key to the .env file:\n\nVITE_GEMINI_API_KEY=your_key_here\n\nGet your key at: https://makersuite.google.com/app/apikey";
      } else if (error.response?.status === 404) {
        errorMessage = "🔍 API Endpoint Error!";
        errorDetails =
          "The Gemini API endpoint returned a 404 error. This might be due to:\n\n1. Invalid model name\n2. API key doesn't have access to this model\n3. Model not available in your region\n\nTrying alternative endpoint...";
      } else if (error.response?.status === 429) {
        errorMessage = "⏱️ Too Many Requests!";
        errorDetails =
          "I'm getting too many requests right now. Please wait a moment and try again.";
      } else if (error.response?.status === 400) {
        errorMessage = "⚠️ Invalid Request!";
        errorDetails =
          "There was an issue with your API key or request format. Please check your configuration.";
      } else if (
        error.response?.status === 401 ||
        error.response?.status === 403
      ) {
        errorMessage = "🚫 Authentication Failed!";
        errorDetails =
          "Your API key appears to be invalid. Please verify it in the .env file.";
      } else if (!navigator.onLine) {
        errorMessage = "📡 No Internet Connection!";
        errorDetails = "Please check your internet connection and try again.";
      } else if (error.code === "ERR_NETWORK") {
        errorMessage = "🌐 Network Error!";
        errorDetails =
          "Unable to reach the AI service. Please check your connection.";
      } else {
        errorMessage = "❌ Unexpected Error!";
        errorDetails =
          "Something unexpected happened. Please try again in a moment.";
      }

      setMessages((prev) => [
        ...prev,
        {
          type: "bot",
          text: errorDetails || errorMessage,
          timestamp: new Date(),
          isError: true,
        },
      ]);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Chatbot Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full shadow-lg shadow-purple-500/50 hover:shadow-purple-500/70 transition-all duration-300 hover:scale-110 flex items-center justify-center group"
        aria-label="Toggle chatbot"
      >
        {isOpen ? (
          <i className="ri-close-line text-white text-2xl"></i>
        ) : (
          <img
            src="/chatbot-logo.svg"
            alt="Black Venom Chatbot"
            className="w-10 h-10 group-hover:scale-110 transition-transform duration-300"
          />
        )}
      </button>

      {/* Chatbot Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-96 h-[600px] bg-gray-900 rounded-2xl shadow-2xl border border-purple-500/30 flex flex-col overflow-hidden animate-fade-in-up">
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-4 flex items-center gap-3">
            <img
              src="/chatbot-logo.svg"
              alt="Black Venom"
              className="w-10 h-10"
            />
            <div className="flex-1">
              <h3 className="text-white font-semibold text-lg">
                Black Venom AI
              </h3>
              <p className="text-purple-100 text-xs">
                Smart Developer Assistant
              </p>
            </div>
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          </div>

          {/* Messages Container */}
          <div
            ref={chatContainerRef}
            className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-900 message-box"
          >
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${
                  message.type === "user" ? "justify-end" : "justify-start"
                } animate-fade-in-up`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl p-3 ${
                    message.type === "user"
                      ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white"
                      : message.isError
                      ? "bg-red-500/20 border border-red-500/30 text-red-200"
                      : "bg-gray-800/60 backdrop-blur-sm border border-purple-500/20 text-gray-100"
                  }`}
                >
                  {message.type === "bot" && !message.isError && (
                    <div className="flex items-center gap-2 mb-1">
                      <img
                        src="/chatbot-logo.svg"
                        alt="Bot"
                        className="w-5 h-5"
                      />
                      <span className="text-xs text-purple-300 font-semibold">
                        Black Venom AI
                      </span>
                    </div>
                  )}
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">
                    {message.text}
                  </p>
                  <div className="flex items-center justify-between mt-2 text-xs opacity-70">
                    <span>
                      {message.timestamp.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                    {message.responseTime && (
                      <span className="text-green-400 font-semibold">
                        ⚡ {message.responseTime}s
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start animate-fade-in-up">
                <div className="bg-gray-800/60 backdrop-blur-sm border border-purple-500/20 rounded-2xl p-3 flex items-center gap-2">
                  <img src="/chatbot-logo.svg" alt="Bot" className="w-5 h-5" />
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
                    <div
                      className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.4s" }}
                    ></div>
                  </div>
                  <span className="text-xs text-gray-400 ml-2">
                    Bot is typing...
                  </span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 bg-gray-800/50 backdrop-blur-sm border-t border-purple-500/20">
            <div className="flex gap-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                className="flex-1 bg-gray-900 border border-purple-500/30 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-all duration-300"
                disabled={isTyping}
              />
              <button
                onClick={handleSendMessage}
                disabled={isTyping || !inputMessage.trim()}
                className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-xl hover:shadow-lg hover:shadow-purple-500/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105"
              >
                <i className="ri-send-plane-fill text-xl"></i>
              </button>
            </div>
            {/*             <p className="text-xs text-gray-500 mt-2 text-center">
              Black Venom AI Assistant
            </p> */}
          </div>
        </div>
      )}
    </>
  );
};

export default Chatbot;
