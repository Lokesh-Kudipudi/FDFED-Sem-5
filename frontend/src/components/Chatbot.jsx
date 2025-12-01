import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router";

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [history, setHistory] = useState([]);
  const messagesRef = useRef();
  const navigate = useNavigate();

  useEffect(() => {
    if (messagesRef.current) {
      messagesRef.current.scrollTop =
        messagesRef.current.scrollHeight;
    }
  }, [messages, open]);

  async function sendMessage() {
    const text = input.trim();
    if (!text) return;
    setMessages((m) => [...m, { sender: "user", text }]);
    setHistory((h) => [
      ...h,
      { role: "user", parts: [{ text }] },
    ]);
    setInput("");

    try {
      const res = await fetch("http://localhost:5500/gemini", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ userInput: text, history }),
      });
      const data = await res.json();
      console.log("Gemini API response data:", data);
      const botText =
        data?.data?.message ||
        data?.googleResponse ||
        "Sorry, no response.";
      setMessages((m) => [
        ...m,
        { sender: "bot", text: botText },
      ]);
      setHistory((h) => [
        ...h,
        {
          role: "model",
          parts: [{ text: data?.googleResponse || botText }],
        },
      ]);

      if (data?.data?.redirect === "yes") {
        setMessages((m) => [
          ...m,
          { sender: "bot", text: "Redirecting..." },
        ]);
        setTimeout(() => navigate("/recommendation"), 1500);
      }
    } catch (err) {
      setMessages((m) => [
        ...m,
        {
          sender: "error",
          text: "An error occurred. Please try again.",
        },
      ]);
      console.error(err);
    }
  }

  function onKey(e) {
    if (e.key === "Enter") sendMessage();
  }

  return (
    <>
      <div className="fixed right-6 bottom-6 z-50">
        {open && (
          <div className="mt-4 w-96 h-96 bg-white rounded-xl shadow-lg flex flex-col overflow-hidden">
            <div className="bg-blue-600 text-white px-4 py-3 font-medium">
              Chat Assistant
            </div>

            <div
              ref={messagesRef}
              className="flex-1 p-3 overflow-auto space-y-2 bg-gray-50"
            >
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={`p-2 rounded ${
                    m.sender === "user"
                      ? "bg-blue-50 text-right self-end"
                      : m.sender === "bot"
                      ? "bg-gray-100 text-left self-start"
                      : "bg-red-100 text-left"
                  }`}
                >
                  {m.text}
                </div>
              ))}
            </div>

            <div className="p-3 border-t flex gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={onKey}
                placeholder="Type your message..."
                className="flex-1 px-3 py-2 border rounded"
              />
              <button
                onClick={sendMessage}
                className="bg-blue-600 text-white px-4 py-2 rounded"
              >
                Send
              </button>
            </div>
          </div>
        )}
        <button
          className="w-14 h-14 rounded-full bg-blue-600 text-white shadow-lg flex mt-4 ml-auto items-center justify-center text-2xl"
          onClick={() => setOpen((s) => !s)}
          aria-label="chat"
        >
          💬
        </button>
      </div>
    </>
  );
}
