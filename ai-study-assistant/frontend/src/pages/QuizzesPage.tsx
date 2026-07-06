import { useState } from "react";
import { BookOpenCheck, WandSparkles } from "lucide-react";
import { useMutation } from "@tanstack/react-query";

import { api } from "../api/client";
import { PageHeader } from "../components/PageHeader";

export function QuizzesPage() {
  const [questions, setQuestions] = useState<Array<Record<string, unknown>>>([]);
  const generate = useMutation({
    mutationFn: api.generateQuiz,
    onSuccess: (data) => setQuestions(data.questions),
  });

  return (
    <>
      <PageHeader eyebrow="Quizzes" title="Generate practice questions">
        <button className="btn-primary" type="button" onClick={() => generate.mutate()} disabled={generate.isPending}>
          <WandSparkles size={16} aria-hidden="true" />
          Generate quiz
        </button>
      </PageHeader>

      <section className="surface p-5">
        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-saffron/20 text-amber-700">
            <BookOpenCheck size={20} aria-hidden="true" />
          </div>
          <div>
            <h3 className="text-lg font-bold">Generated questions</h3>
            <p className="text-sm text-slate-500">MCQ, true/false, and short answer structures will share this view.</p>
          </div>
        </div>

        <div className="space-y-4">
          {questions.length === 0 ? (
            <p className="text-sm leading-6 text-slate-600">Click generate quiz to call the backend placeholder.</p>
          ) : (
            questions.map((question, index) => (
              <article key={`${question.prompt}-${index}`} className="rounded-md border border-slate-200 px-4 py-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{String(question.type)}</p>
                <h3 className="mt-2 text-base font-bold">{String(question.prompt)}</h3>
                {Array.isArray(question.options) ? (
                  <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                    {question.options.map((option) => (
                      <li key={String(option)} className="rounded-md bg-slate-50 px-3 py-2 text-sm text-slate-700">
                        {String(option)}
                      </li>
                    ))}
                  </ul>
                ) : null}
                <p className="mt-3 text-sm font-semibold text-mint">Answer: {String(question.answer)}</p>
              </article>
            ))
          )}
        </div>
      </section>
    </>
  );
}

