import {
  BookOpenCheck,
  BrainCircuit,
  FileText,
  Layers3,
  LogOut,
  MessageSquareText,
  NotebookTabs,
  PanelLeft,
  Sparkles,
} from "lucide-react";
import { NavLink, Outlet } from "react-router-dom";

import { useAuth } from "../auth/AuthContext";

const navItems = [
  { to: "/", label: "Dashboard", icon: PanelLeft },
  { to: "/documents", label: "Documents", icon: FileText },
  { to: "/chat", label: "AI Chat", icon: MessageSquareText },
  { to: "/summaries", label: "Summaries", icon: NotebookTabs },
  { to: "/flashcards", label: "Flashcards", icon: Layers3 },
  { to: "/quizzes", label: "Quizzes", icon: BookOpenCheck },
];

export function AppShell() {
  const { logout, user } = useAuth();

  return (
    <div className="min-h-screen bg-[#f7f9fc] text-ink">
      <aside className="fixed inset-y-0 left-0 hidden w-64 border-r border-slate-200 bg-white px-4 py-5 lg:flex lg:flex-col">
        <div className="mb-8 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-mint text-white">
            <BrainCircuit size={22} aria-hidden="true" />
          </div>
          <div>
            <p className="text-sm font-bold">AI Study</p>
            <p className="text-xs text-slate-500">Course notes assistant</p>
          </div>
        </div>

        <nav className="space-y-1" aria-label="Main navigation">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  [
                    "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-semibold transition",
                    isActive ? "bg-ink text-white" : "text-slate-600 hover:bg-slate-100 hover:text-ink",
                  ].join(" ")
                }
              >
                <Icon size={18} aria-hidden="true" />
                {item.label}
              </NavLink>
            );
          })}
        </nav>

        <div className="mt-auto rounded-lg border border-slate-200 bg-mist p-3">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <Sparkles size={16} aria-hidden="true" />
            MVP mode
          </div>
          <p className="mt-1 text-xs leading-5 text-slate-600">
            The shell is ready. Next we connect persistent auth, PostgreSQL, and real RAG.
          </p>
        </div>
      </aside>

      <div className="lg:pl-64">
        <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/95 px-4 py-3 backdrop-blur lg:px-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Workspace</p>
              <h1 className="text-lg font-bold">AI Study Assistant</h1>
            </div>
            <div className="flex items-center gap-3">
              <div className="hidden text-right sm:block">
                <p className="text-sm font-semibold">{user?.name ?? "Student"}</p>
                <p className="text-xs text-slate-500">{user?.email ?? "student@example.com"}</p>
              </div>
              <button className="btn-secondary" type="button" onClick={logout}>
                <LogOut size={16} aria-hidden="true" />
                Logout
              </button>
            </div>
          </div>
        </header>

        <nav className="grid grid-cols-3 gap-2 border-b border-slate-200 bg-white px-4 py-3 sm:grid-cols-6 lg:hidden">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  [
                    "flex min-h-14 flex-col items-center justify-center gap-1 rounded-md px-2 text-xs font-semibold",
                    isActive ? "bg-ink text-white" : "text-slate-600 hover:bg-slate-100",
                  ].join(" ")
                }
              >
                <Icon size={17} aria-hidden="true" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        <main className="mx-auto w-full max-w-7xl px-4 py-6 lg:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

