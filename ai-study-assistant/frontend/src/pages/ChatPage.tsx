import { FormEvent, useState } from "react";
import { SendHorizonal } from "lucide-react";
import { useMutation } from "@tanstack/react-query";

import { api } from "../api/client";
import { PageHeader } from "../components/PageHeader";

type Message = {
  role: "user" | "assistant";
  content: string;
};

export function ChatPage() {
  const [input, setInput] = useState("Explain polymorphism using only my uploaded notes.");
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Ask a question about your uploaded notes. RAG retrieval will be connected in the next AI milestone.",
    },
  ]);

  const chat = useMutation({
    mutationFn: api.sendMessage,
    onSuccess: (data) => {
      setMessages((current) => [...current, { role: "assistant", content: data.answer }]);
    },
  });

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = input.trim();
    if (!trimmed) {
      return;
    }
    setMessages((current) => [...current, { role: "user", content: trimmed }]);
    setInput("");
    chat.mutate(trimmed);
  }

  return (
    <>
      <PageHeader eyebrow="AI Chat" title="Ask questions from your notes" />

      <section className="surface flex min-h-[620px] flex-col overflow-hidden">
        <div className="flex-1 space-y-4 overflow-y-auto p-4 md:p-6">
          {messages.map((message, index) => (
            <div
              key={`${message.role}-${index}`}
              className={`max-w-3xl rounded-lg px-4 py-3 text-sm leading-6 ${
                message.role === "user" ? "ml-auto bg-ink text-white" : "bg-mist text-slate-700"
              }`}
            >
              {message.content}
            </div>
          ))}
        </div>

        <form className="border-t border-slate-200 bg-white p-4" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-3 sm:flex-row">
            <textarea
              className="field min-h-24 flex-1 resize-none"
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Ask about a chapter, topic, definition, or lecture note."
            />
            <button className="btn-primary sm:self-end" type="submit" disabled={chat.isPending}>
              <SendHorizonal size={16} aria-hidden="true" />
              Send
            </button>
          </div>
        </form>
      </section>
    </>
  );
}

