import { useState, useRef, useEffect } from "react";
import "./Assistant.css";
import type { Message } from "./types";
import { getTimeGreeting } from "./getTimeGreeting";
import { getBotResponse } from "./getBotResponse";
import AssistantToggle from "./AssistantToggle";
import AssistantWindow from "./AssistantWindow";

const Assistant = () => {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [greeted, setGreeted] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);

  const scrollRef = useRef<HTMLDivElement>(null);
  const greetTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const replyTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (greetTimeoutRef.current) clearTimeout(greetTimeoutRef.current);
      if (replyTimeoutRef.current) clearTimeout(replyTimeoutRef.current);
    };
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, open]);

  const handleOpen = () => {
    if (!open && !greeted) {
      setGreeted(true);
      const greeting = getTimeGreeting();
      greetTimeoutRef.current = setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            sender: "bot",
            text: `${greeting}! Радий вас бачити. Чим можу допомогти вашому господарству сьогодні?`,
          },
        ]);
      }, 400);
    }
    setOpen(!open);
  };

  const handleSend = () => {
    if (!input.trim()) return;

    const userText = input.trim();

    setMessages((prev) => [...prev, { sender: "user", text: userText }]);
    setInput("");

    replyTimeoutRef.current = setTimeout(() => {
      setMessages((prev) => [...prev, getBotResponse(userText)]);
    }, 600);
  };

  return (
    <>
      <AssistantToggle open={open} onClick={handleOpen} />
      {open && (
        <AssistantWindow
          messages={messages}
          input={input}
          onInputChange={setInput}
          onSend={handleSend}
          onClose={() => setOpen(false)}
          scrollRef={scrollRef}
        />
      )}
    </>
  );
};

export default Assistant;
