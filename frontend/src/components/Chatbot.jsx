import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { toggleChat, addMessage, addHistory } from "../redux/slices/chatSlice";
import { BsStars, BsSendFill } from "react-icons/bs";
import { IoClose } from "react-icons/io5";
import { API } from "../config/api";

export default function Chatbot() {
  const dispatch = useDispatch();
  const { open, messages, history } = useSelector((state) => state.chat);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesRef = useRef();
  const navigate = useNavigate();

  useEffect(() => {
    if (messagesRef.current) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
    }
  }, [messages, open, loading]);

  async function sendMessage() {
    const text = input.trim();
    if (!text) return;
    
    dispatch(addMessage({ sender: "user", text }));
    dispatch(addHistory({ role: "user", parts: [{ text }] }));
    setInput("");
    setLoading(true);

    try {
      const res = await fetch(API.CHATBOT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ userInput: text, history }),
      });
      const data = await res.json();
      const botText =
        data?.data?.message ||
        data?.googleResponse ||
        "Sorry, no response.";
      
      dispatch(addMessage({ sender: "bot", text: botText }));
      dispatch(addHistory({
        role: "model",
        parts: [{ text: data?.googleResponse || botText }],
      }));

      if (data?.data?.redirect === "yes") {
        dispatch(addMessage({ sender: "bot", text: "Redirecting..." }));
        const tourIds = data?.data?.tours || [];
        const hotelIds = data?.data?.hotels || [];
        setTimeout(() => navigate("/recommendation", { state: { tourIds, hotelIds } }), 1500);
      }
    } catch (err) {
      dispatch(addMessage({
        sender: "error",
        text: "An error occurred. Please try again.",
      }));
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  function onKey(e) {
    if (e.key === "Enter") sendMessage();
  }

  return (
    <>
      <div className="fixed right-6 bottom-6 z-50 flex flex-col items-end">
        {open && (
          <div className="mb-4 w-96 h-[500px] bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-slide-up border border-white/20">
            {/* Header */}
            <div className="bg-gradient-to-r from-[#003366] to-[#001a33] p-4 flex justify-between items-center text-white shadow-md">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/10 rounded-full backdrop-blur-sm">
                   <BsStars className="text-xl text-yellow-300 animate-pulse" />
                </div>
                <div>
                  <h3 className="font-bold text-lg leading-none">Horizon AI</h3>
                  <span className="text-xs text-blue-200">Travel Assistant</span>
                </div>
              </div>
              <button 
                onClick={() => dispatch(toggleChat())}
                className="hover:bg-white/10 p-1 rounded-full transition-colors"
              >
                <IoClose className="text-xl" />
              </button>
            </div>

            {/* Chat Area */}
            <div
              ref={messagesRef}
              className="flex-1 p-4 overflow-y-auto space-y-4 bg-gray-50/50 scrollbar-hide"
            >
              {messages.length === 0 && (
                <div className="text-center text-gray-400 mt-10 text-sm">
                  <BsStars className="text-4xl mx-auto mb-3 text-blue-200" />
                  <p>How can I help you explore today?</p>
                </div>
              )}
              
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={`flex ${m.sender === "user" ? "justify-end" : "justify-start"} ${
                    m.sender === "user" ? "animate-slide-in-right" : "animate-slide-in-left"
                  }`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-2xl shadow-sm text-sm ${
                      m.sender === "user"
                        ? "bg-[#003366] text-white rounded-br-none"
                        : m.sender === "error" 
                        ? "bg-red-100 text-red-600 rounded-bl-none"
                        : "bg-white text-gray-800 rounded-bl-none border border-gray-100"
                    }`}
                  >
                    {m.text}
                  </div>
                </div>
              ))}
              
              {loading && (
                <div className="flex justify-start animate-slide-in-left">
                   <div className="bg-white p-4 rounded-2xl rounded-bl-none border border-gray-100 shadow-sm flex gap-2 items-center">
                     <div className="w-2 h-2 bg-[#003366] rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                     <div className="w-2 h-2 bg-[#003366] rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                     <div className="w-2 h-2 bg-[#003366] rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                   </div>
                </div>
              )}
            </div>

            {/* Input Area */}
            <div className="p-4 bg-white border-t border-gray-100">
              <div className="flex items-center gap-2 bg-gray-100 rounded-full px-4 py-2 focus-within:ring-2 focus-within:ring-[#003366]/20 focus-within:bg-white transition-all shadow-inner">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={onKey}
                  placeholder="Ask anything..."
                  className="flex-1 bg-transparent border-none outline-none text-sm text-gray-700 placeholder-gray-400"
                />
                <button
                  onClick={sendMessage}
                  disabled={!input.trim() || loading}
                  className={`p-2 rounded-full transition-all ${
                    input.trim() 
                      ? "bg-[#003366] text-white shadow-md hover:scale-105" 
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
                >
                  <BsSendFill className="text-xs" />
                </button>
              </div>
            </div>
          </div>
        )}

        <button
          className="group w-16 h-16 rounded-full bg-gradient-to-r from-[#003366] to-[#004d99] text-white shadow-xl flex items-center justify-center text-3xl hover:scale-110 transition-transform duration-300 animate-float active:scale-95"
          onClick={() => dispatch(toggleChat())}
          aria-label="Toggle chat"
        >
          {open ? <IoClose /> : <BsStars className="group-hover:rotate-180 transition-transform duration-500" />}
        </button>
      </div>
    </>
  );
}
