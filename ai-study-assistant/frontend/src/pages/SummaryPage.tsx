import { useState } from "react";
import { NotebookTabs, WandSparkles } from "lucide-react";
import { useMutation } from "@tanstack/react-query";

import { api } from "../api/client";
import { PageHeader } from "../components/PageHeader";

export function SummaryPage() {
  const [summary, setSummary] = useState<string[]>([]);
  const mutation = useMutation({
    mutationFn: api.generateSummary,
    onSuccess: (data) => setSummary(data.summary),
  });

  return (
    <>
      <PageHeader eyebrow="Summaries" title="Generate lecture summaries">
        <button className="btn-primary" type="button" onClick={() => mutation.mutate()} disabled={mutation.isPending}>
          <WandSparkles size={16} aria-hidden="true" />
          Generate summary
        </button>
      </PageHeader>

      <section className="surface p-5">
        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-ocean/10 text-ocean">
            <NotebookTabs size={20} aria-hidden="true" />
          </div>
          <div>
            <h3 className="text-lg font-bold">Latest summary</h3>
            <p className="text-sm text-slate-500">Generated from selected uploaded notes in the next milestone.</p>
          </div>
        </div>
        <div className="space-y-3">
          {summary.length === 0 ? (
            <p className="text-sm leading-6 text-slate-600">Click generate summary to call the backend placeholder.</p>
          ) : (
            summary.map((item) => (
              <p key={item} className="rounded-md border border-slate-200 px-4 py-3 text-sm leading-6 text-slate-700">
                {item}
              </p>
            ))
          )}
        </div>
      </section>
    </>
  );
}

