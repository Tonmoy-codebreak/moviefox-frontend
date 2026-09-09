"use client";

import { askRagAction } from "@/actions/userAction/rag.action";
import { useState } from "react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const ChatBot = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false); // চ্যাটবট ওপেন/ক্লোজ টগল করার জন্য

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput("");

    // ১. ইউজারের মেসেজ UI-তে যোগ করা
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setLoading(true);

    try {
      // ২. আপনার তৈরি করা rag.action.ts থেকে সার্ভার অ্যাকশন কল করা
      const response = await askRagAction(userMessage);

      if (response.success && response.data) {
        // ৩. এআই-এর অ্যানসার UI-তে যোগ করা
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: response.data.answer },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: response.message || "Failed to get response.",
          },
        ]);
      }
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Something went wrong. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* চ্যাটবট ওপেন করার ফ্লোটিং বাটন */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-primary text-primary-foreground px-5 py-3 rounded-full shadow-2xl font-medium hover:scale-105 transition flex items-center gap-2"
        >
          <span>💬 MovieFox AI</span>
        </button>
      )}

      {/* চ্যাট উইন্ডো বক্স (যখন isOpen true হবে) */}
      {isOpen && (
        <div className="flex flex-col h-[500px] w-[380px] border rounded-2xl bg-background shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-4">
          {/* চ্যাট হেডার */}
          <div className="bg-primary text-primary-foreground p-4 font-semibold flex justify-between items-center">
            <span>MovieFox AI Assistant 🎬</span>
            <button
              onClick={() => setIsOpen(false)}
              className="text-primary-foreground hover:opacity-80 text-lg font-bold px-2"
            >
              ✕
            </button>
          </div>

          {/* চ্যাট মেসেজ লিস্ট */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3">
            {messages.length === 0 && (
              <div className="text-center text-muted-foreground text-sm mt-16">
                Ask me anything about movies, genres, or reviews!
              </div>
            )}

            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${
                  msg.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[85%] p-3 rounded-xl text-sm leading-relaxed ${
                    msg.role === "user"
                      ? "bg-primary text-primary-foreground rounded-br-none"
                      : "bg-muted text-foreground rounded-bl-none"
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div className="bg-muted text-muted-foreground p-3 rounded-xl text-sm animate-pulse">
                  AI is thinking...
                </div>
              </div>
            )}
          </div>

          {/* ইনপুট ফর্ম এবং সেন্ড বাটন */}
          <form
            onSubmit={handleSendMessage}
            className="border-t p-3 flex gap-2 bg-card"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about a movie..."
              className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 disabled:opacity-50 transition"
            >
              Send
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default ChatBot;
