import { ChangeEvent, useState } from "react";
import { FileUp, RefreshCw } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { api, uploadDocument } from "../api/client";
import { PageHeader } from "../components/PageHeader";

export function DocumentsPage() {
  const queryClient = useQueryClient();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const documents = useQuery({ queryKey: ["documents"], queryFn: api.documents });
  const upload = useMutation({
    mutationFn: uploadDocument,
    onSuccess: () => {
      setSelectedFile(null);
      queryClient.invalidateQueries({ queryKey: ["documents"] });
    },
  });

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    setSelectedFile(event.target.files?.[0] ?? null);
  }

  return (
    <>
      <PageHeader eyebrow="Documents" title="Upload course materials" />

      <section className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
        <form
          className="surface p-5"
          onSubmit={(event) => {
            event.preventDefault();
            if (selectedFile) {
              upload.mutate(selectedFile);
            }
          }}
        >
          <label className="flex min-h-56 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-slate-300 bg-slate-50 px-4 py-8 text-center transition hover:border-ocean hover:bg-blue-50">
            <FileUp size={34} className="text-ocean" aria-hidden="true" />
            <span className="mt-4 text-base font-bold">Choose a PDF, DOCX, or TXT file</span>
            <span className="mt-2 max-w-sm text-sm leading-6 text-slate-600">
              The backend saves the file and runs the text extraction hook.
            </span>
            <input className="sr-only" type="file" accept=".pdf,.docx,.txt" onChange={handleFileChange} />
          </label>

          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm font-semibold text-slate-600">{selectedFile?.name ?? "No file selected"}</p>
            <button className="btn-primary" type="submit" disabled={!selectedFile || upload.isPending}>
              {upload.isPending ? <RefreshCw size={16} className="animate-spin" aria-hidden="true" /> : <FileUp size={16} aria-hidden="true" />}
              Upload
            </button>
          </div>

          {upload.error ? <p className="mt-3 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{upload.error.message}</p> : null}
          {upload.data ? (
            <p className="mt-3 rounded-md bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
              Processed {upload.data.filename} with {upload.data.characters} extracted characters.
            </p>
          ) : null}
        </form>

        <div className="surface p-5">
          <h3 className="text-lg font-bold">Uploaded documents</h3>
          <div className="mt-4 space-y-3">
            {(documents.data ?? []).length === 0 ? (
              <p className="text-sm leading-6 text-slate-600">Uploaded documents will appear here.</p>
            ) : (
              documents.data?.map((doc) => (
                <article key={doc.id} className="rounded-md border border-slate-200 px-4 py-3">
                  <p className="text-sm font-bold">{doc.filename}</p>
                  <p className="mt-1 text-xs text-slate-500">{doc.content_type} · {doc.characters} characters</p>
                </article>
              ))
            )}
          </div>
        </div>
      </section>
    </>
  );
}

