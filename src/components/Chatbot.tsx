import React, { useState, useRef, useEffect } from "react";
import { MessageSquare, X, Send, Bot, User, Trash2, ArrowDownCircle, AlertCircle, HelpCircle } from "lucide-react";
import { ChatMessage } from "../types";

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      sender: "bot",
      text: "Salama ! Izaho no **SRB Vatovavy**, mpanampy virtoaly ofisialin'ny Sampandraharaham-paritry ny Tetibola eto Vatovavy. Ahoana no azoko ampiana anao amin'ny dingana ara-panjakana na ara-tetibola anio ?",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSimulated, setIsSimulated] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const suggestions = [
    "Dossier fisotroan-dronono",
    "Fidirana hiasa voalohany",
    "Visa fandaniana ara-bola (CDE)",
    "Ora fisokafan'ny birao",
  ];

  const handleSend = async (textToSend: string) => {
    if (!textToSend.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: "user",
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    try {
      // Préparer l'historique pour l'envoyer au RAG (on limite aux 6 derniers messages)
      const historyContext = messages.slice(-6).map((m) => ({
        sender: m.sender,
        text: m.text,
      }));

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: textToSend, history: historyContext }),
      });

      const data = await res.json();

      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: "bot",
        text: data.response || "Miala tsiny, tsy nahazo valiny aho.",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      if (data.simulated) {
        setIsSimulated(true);
      }

      setMessages((prev) => [...prev, botMsg]);
    } catch (error) {
      console.error("Erreur d'envoi chat:", error);
      const errorMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        sender: "bot",
        text: "Miala tsiny, nisy olana ara-teknika teo amin'ny fifandraisana amin'ny mpizara. Mba andramo indray avy eo.",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setMessages([
      {
        id: "welcome",
        sender: "bot",
        text: "Salama ! Izaho no **SRB Vatovavy**, mpanampy virtoaly ofisialin'ny Sampandraharaham-paritry ny Tetibola eto Vatovavy. Ahoana no azoko ampiana anao amin'ny dingana ara-panjakana na ara-tetibola anio ?",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      },
    ]);
    setIsSimulated(false);
  };

  // Convertisseur simple pour le format gras du bot (**texte**)
  const renderMessageText = (text: string) => {
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, index) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return <strong key={index} className="font-bold text-sky-950">{part.slice(2, -2)}</strong>;
      }
      // Remplacer les retours à la ligne par des balises br
      return part.split("\n").map((line, lIndex) => (
        <span key={`${index}-${lIndex}`}>
          {line}
          {lIndex < part.split("\n").length - 1 && <br />}
        </span>
      ));
    });
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Floating Toggle Button */}
      {!isOpen && (
        <button
          id="chatbot-toggle-btn"
          onClick={() => setIsOpen(true)}
          className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-900 text-white shadow-xl hover:bg-slate-800 hover:scale-105 transition-all cursor-pointer border border-slate-800"
          title="Discuter avec l'assistant SRB Vatovavy"
        >
          <MessageSquare className="h-6 w-6" />
          <span className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-[10px] font-black text-white animate-pulse">
            IA
          </span>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div
          id="chatbot-window"
          className="flex flex-col w-[350px] sm:w-[400px] h-[520px] bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden transition-all duration-300"
        >
          {/* Header */}
          <div className="flex items-center justify-between bg-slate-900 p-4 text-white">
            <div className="flex items-center space-x-2.5">
              <div className="flex h-10 w-10 items-center justify-center rounded bg-white text-slate-900 font-bold shadow-sm">
                SRB
              </div>
              <div>
                <h3 className="text-sm font-bold tracking-tight uppercase">Mpanampy SRB Vatovavy</h3>
                <div className="flex items-center space-x-1">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping"></span>
                  <span className="h-2 w-2 rounded-full bg-emerald-400 absolute"></span>
                  <span className="text-[10px] text-slate-300 pl-1 font-semibold uppercase tracking-wider">Mpanolotsaina Virtoaly Ofisialy</span>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-1">
              <button
                onClick={handleClear}
                className="text-slate-400 hover:text-white p-1 rounded-md transition-colors"
                title="Hamafa ny resaka"
              >
                <Trash2 className="h-4 w-4" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-md transition-colors"
                title="Hanidy"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Warning Banner for offline simulation */}
          {isSimulated && (
            <div className="bg-amber-50 border-b border-amber-100 p-2 text-[11px] text-amber-800 flex items-start space-x-1.5 px-3">
              <AlertCircle className="h-3.5 w-3.5 text-amber-600 shrink-0 mt-0.5" />
              <span>
                Fanamarihana: Mandeha amin'ny fomba tsy misy aterineto ny mpanampy virtoaly. Avy amin'ny fitantanam-bola voatahiry ny valiny.
              </span>
            </div>
          )}

          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex items-start space-x-2 ${
                  msg.sender === "user" ? "flex-row-reverse space-x-reverse" : ""
                }`}
              >
                {/* Avatar */}
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded shrink-0 ${
                    msg.sender === "user" ? "bg-blue-50 text-blue-700 font-bold" : "bg-slate-200 text-slate-700 font-bold"
                  }`}
                >
                  {msg.sender === "user" ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                </div>

                {/* Bubble */}
                <div
                  className={`max-w-[75%] rounded-2xl p-3 text-xs leading-relaxed shadow-xs ${
                    msg.sender === "user"
                      ? "bg-blue-700 text-white rounded-tr-none"
                      : "bg-white text-slate-800 border border-slate-200 rounded-tl-none"
                  }`}
                >
                  <div>{renderMessageText(msg.text)}</div>
                  <div
                    className={`text-[9px] mt-1 text-right ${
                      msg.sender === "user" ? "text-blue-200" : "text-slate-400"
                    }`}
                  >
                    {msg.timestamp}
                  </div>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex items-start space-x-2">
                <div className="flex h-8 w-8 items-center justify-center rounded bg-slate-200 text-slate-700 shrink-0">
                  <Bot className="h-4 w-4" />
                </div>
                <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-none p-3 shadow-xs max-w-[75%]">
                  <div className="flex space-x-1 items-center h-4">
                    <div className="h-1.5 w-1.5 bg-blue-700 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
                    <div className="h-1.5 w-1.5 bg-blue-700 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
                    <div className="h-1.5 w-1.5 bg-blue-700 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Suggestions footer */}
          {messages.length === 1 && (
            <div className="px-4 py-2 bg-slate-50 border-t border-slate-100">
              <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1.5 flex items-center space-x-1">
                <HelpCircle className="h-3 w-3 text-blue-700" />
                <span>Soso-kevitra fanontaniana matetika :</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {suggestions.map((sug) => (
                  <button
                    key={sug}
                    onClick={() => handleSend(sug)}
                    className="text-[10px] text-slate-700 bg-white border border-slate-200 rounded-lg py-1 px-2.5 font-bold hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700 transition-all cursor-pointer"
                  >
                    {sug}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input Panel */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend(input);
            }}
            className="p-3 border-t border-slate-100 bg-white flex items-center space-x-2"
          >
            <input
              id="chatbot-input"
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Mametraha fanontaniana eto..."
              className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 text-xs focus:outline-none focus:border-blue-700 focus:bg-white transition-all"
              disabled={isLoading}
            />
            <button
              id="chatbot-send-btn"
              type="submit"
              disabled={!input.trim() || isLoading}
              className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-700 text-white disabled:bg-slate-100 disabled:text-slate-400 hover:bg-blue-800 transition-colors cursor-pointer shrink-0"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
