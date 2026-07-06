import { BookOpenCheck, FileText, Layers3, MessageSquareText } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";

import { api } from "../api/client";
import { PageHeader } from "../components/PageHeader";
import { StatCard } from "../components/StatCard";

export function DashboardPage() {
  const documents = useQuery({ queryKey: ["documents"], queryFn: api.documents });
  const recentChats = useQuery({ queryKey: ["recent-chats"], queryFn: api.recentChats });

  const documentCount = documents.data?.length ?? 0;
  const chatCount = recentChats.data?.length ?? 0;

  return (
    <>
      <PageHeader eyebrow="Dashboard" title="Study workspace">
        <Link className="btn-primary" to="/documents">
          <FileText size={16} aria-hidden="true" />
          Upload notes
        </Link>
      </PageHeader>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Documents"
          value={String(documentCount)}
          helper="PDF, DOCX, and TXT upload route is ready."
          icon={FileText}
          tone="ocean"
        />
        <StatCard
          label="Recent chats"
          value={String(chatCount)}
          helper="Chat endpoint is ready for RAG wiring."
          icon={MessageSquareText}
          tone="mint"
        />
        <StatCard label="Flashcards" value="2" helper="Generator returns demo cards." icon={Layers3} tone="coral" />
        <StatCard label="Quizzes" value="1" helper="MCQ and true/false shapes are in place." icon={BookOpenCheck} tone="saffron" />
      </section>

      <section className="mt-6 grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="surface p-5">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h3 className="text-lg font-bold">Uploaded documents</h3>
            <Link className="text-sm font-semibold text-ocean hover:underline" to="/documents">
              Manage
            </Link>
          </div>
          <div className="space-y-3">
            {(documents.data ?? []).length === 0 ? (
              <p className="text-sm leading-6 text-slate-600">
                No documents yet. Upload a course note to start building the knowledge base.
              </p>
            ) : (
              documents.data?.map((doc) => (
                <div key={doc.id} className="flex items-center justify-between rounded-md border border-slate-200 px-3 py-2">
                  <span className="text-sm font-semibold">{doc.filename}</span>
                  <span className="text-xs text-slate-500">{doc.characters} characters</span>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="surface p-5">
          <h3 className="mb-4 text-lg font-bold">Recent chats</h3>
          <div className="space-y-3">
            {(recentChats.data ?? []).map((chat) => (
              <Link
                key={chat.id}
                to="/chat"
                className="block rounded-md border border-slate-200 px-3 py-3 transition hover:border-ocean hover:bg-slate-50"
              >
                <p className="text-sm font-semibold">{chat.title}</p>
                <p className="mt-1 text-xs leading-5 text-slate-500">{chat.last_message}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

