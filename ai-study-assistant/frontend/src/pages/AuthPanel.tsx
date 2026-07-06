import { FormEvent, ReactNode, useState } from "react";
import { BrainCircuit } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

import { api } from "../api/client";
import { useAuth } from "../auth/AuthContext";

type AuthPanelProps = {
  mode: "login" | "signup";
};

export function AuthPanel({ mode }: AuthPanelProps) {
  const navigate = useNavigate();
  const { setAuth } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("student@example.com");
  const [password, setPassword] = useState("password123");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isSignup = mode === "signup";

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const response = isSignup
        ? await api.signup({ name: name || "Demo Student", email, password })
        : await api.login({ email, password });
      setAuth(response);
      navigate("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Authentication failed");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="grid min-h-screen bg-mist lg:grid-cols-[1fr_460px]">
      <section className="flex items-center px-6 py-10 lg:px-12">
        <div className="max-w-3xl">
          <div className="mb-8 flex h-12 w-12 items-center justify-center rounded-lg bg-mint text-white">
            <BrainCircuit size={26} aria-hidden="true" />
          </div>
          <p className="text-sm font-semibold uppercase tracking-wide text-coral">AI Study Assistant</p>
          <h1 className="mt-3 max-w-2xl text-4xl font-bold tracking-normal text-ink md:text-5xl">
            Chat with your own course materials.
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-slate-600">
            Upload notes, generate summaries, practice with flashcards, and build quizzes from a single focused workspace.
          </p>
        </div>
      </section>

      <section className="flex items-center justify-center bg-white px-6 py-10">
        <div className="w-full max-w-sm">
          <h2 className="text-2xl font-bold tracking-normal text-ink">
            {isSignup ? "Create your account" : "Welcome back"}
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            {isSignup ? "Start your study workspace." : "Use the account you created in this backend session."}
          </p>

          <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
            {isSignup ? (
              <Field label="Name">
                <input className="field" value={name} onChange={(event) => setName(event.target.value)} />
              </Field>
            ) : null}
            <Field label="Email">
              <input
                className="field"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
              />
            </Field>
            <Field label="Password">
              <input
                className="field"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                minLength={8}
                required
              />
            </Field>

            {error ? <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p> : null}

            <button className="btn-primary w-full" type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Please wait" : isSignup ? "Sign up" : "Login"}
            </button>
          </form>

          <p className="mt-6 text-sm text-slate-600">
            {isSignup ? "Already have an account?" : "Need an account?"}{" "}
            <Link className="font-semibold text-ocean hover:underline" to={isSignup ? "/login" : "/signup"}>
              {isSignup ? "Login" : "Sign up"}
            </Link>
          </p>
        </div>
      </section>
    </div>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-slate-700">{label}</span>
      {children}
    </label>
  );
}

