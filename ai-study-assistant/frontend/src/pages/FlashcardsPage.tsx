import { useState } from "react";
import { Layers3, WandSparkles } from "lucide-react";
import { useMutation, useQuery } from "@tanstack/react-query";

import { api } from "../api/client";
import { PageHeader } from "../components/PageHeader";

type Flashcard = {
  id: string;
  front: string;
  back: string;
};

export function FlashcardsPage() {
  const [cards, setCards] = useState<Flashcard[]>([]);
  const existingCards = useQuery({ queryKey: ["flashcards"], queryFn: api.generateFlashcards });
  const generate = useMutation({
    mutationFn: api.generateFlashcards,
    onSuccess: setCards,
  });

  const visibleCards = cards.length > 0 ? cards : existingCards.data ?? [];

  return (
    <>
      <PageHeader eyebrow="Flashcards" title="Practice key concepts">
        <button className="btn-primary" type="button" onClick={() => generate.mutate()} disabled={generate.isPending}>
          <WandSparkles size={16} aria-hidden="true" />
          Generate cards
        </button>
      </PageHeader>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {visibleCards.map((card) => (
          <article key={card.id} className="surface min-h-52 p-5">
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-coral/10 text-coral">
              <Layers3 size={20} aria-hidden="true" />
            </div>
            <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">Front</p>
            <h3 className="mt-2 text-lg font-bold">{card.front}</h3>
            <p className="mt-5 text-sm font-semibold uppercase tracking-wide text-slate-500">Back</p>
            <p className="mt-2 text-sm leading-6 text-slate-700">{card.back}</p>
          </article>
        ))}
      </section>
    </>
  );
}

