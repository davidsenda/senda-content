"use client";
import { useEffect, useState } from "react";

interface Idea {
  id: string;
  content: string;
  status: "sin_conectar" | "conectada" | "trabajada";
  createdAt: string;
}

type FilterType = "todas" | "sin_conectar" | "conectada" | "trabajada";

export default function IdeasPage() {
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [input, setInput] = useState("");
  const [filter, setFilter] = useState<FilterType>("todas");

  const loadIdeas = () => fetch("/api/ideas").then(r => r.json()).then(setIdeas).catch(() => {});

  useEffect(() => { loadIdeas(); }, []);

  const saveIdea = async () => {
    if (!input.trim()) return;
    await fetch("/api/ideas", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: input.trim() }),
    });
    setInput("");
    loadIdeas();
  };

  const updateStatus = async (id: string, status: Idea["status"]) => {
    await fetch("/api/ideas", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    loadIdeas();
  };

  const deleteIdea = async (id: string) => {
    await fetch(`/api/ideas?id=${id}`, { method: "DELETE" });
    loadIdeas();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      saveIdea();
    }
  };

  const filtered = filter === "todas" ? ideas : ideas.filter(i => i.status === filter);

  const counts = {
    todas: ideas.length,
    sin_conectar: ideas.filter(i => i.status === "sin_conectar").length,
    conectada: ideas.filter(i => i.status === "conectada").length,
    trabajada: ideas.filter(i => i.status === "trabajada").length,
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-heading font-semibold text-senda-jet">Ideas</h1>
        <p className="mt-1 text-senda-teal/60 text-sm">
          Tu cajón de ideas. Apunta lo que se te ocurra y conéctalo con tu estrategia.
        </p>
      </div>

      {/* Input */}
      <div className="card">
        <textarea
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder='Ej: "El síndrome del perfil bonito pero vacío", "Analogía de la pirámide de Keops"...'
          className="w-full bg-transparent resize-none outline-none text-senda-text placeholder:text-senda-light text-sm"
          rows={2}
        />
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-senda-light/20">
          <span className="text-xs text-senda-teal/40">Enter para guardar · Shift+Enter nueva línea</span>
          <button onClick={saveIdea} className="btn-yellow text-sm">
            💡 Guardar idea
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        {(["todas", "sin_conectar", "conectada", "trabajada"] as FilterType[]).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`chip ${filter === f ? "chip-active" : "chip-inactive"}`}
          >
            {f === "todas" ? "Todas" : f === "sin_conectar" ? "Sin conectar" : f === "conectada" ? "Conectadas" : "Trabajadas"} ({counts[f]})
          </button>
        ))}
      </div>

      {/* Ideas list */}
      <div className="space-y-3">
        {filtered.length === 0 && (
          <div className="card text-center py-12 text-senda-teal/40">
            {ideas.length === 0
              ? "Todavía no tienes ideas guardadas. Empieza a apuntar."
              : "No hay ideas en esta categoría."}
          </div>
        )}
        {filtered.map(idea => (
          <div key={idea.id} className="card group hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between gap-4">
              <p className="text-sm text-senda-text flex-1">{idea.content}</p>
              <button
                onClick={() => deleteIdea(idea.id)}
                className="opacity-0 group-hover:opacity-100 text-senda-red/60 hover:text-senda-red text-xs transition-opacity"
              >
                ✕
              </button>
            </div>
            <div className="flex items-center gap-2 mt-3 pt-3 border-t border-senda-light/10">
              <span className="text-[10px] text-senda-teal/40 font-mono-senda">
                {new Date(idea.createdAt).toLocaleDateString("es-ES")}
              </span>
              <div className="flex-1" />
              {(["sin_conectar", "conectada", "trabajada"] as const).map(s => (
                <button
                  key={s}
                  onClick={() => updateStatus(idea.id, s)}
                  className={`text-[10px] px-2 py-0.5 rounded-full transition-colors ${
                    idea.status === s
                      ? s === "sin_conectar" ? "bg-gray-200 text-gray-600"
                        : s === "conectada" ? "bg-senda-yellow/20 text-senda-yellow"
                        : "bg-green-100 text-green-700"
                      : "bg-transparent text-senda-teal/30 hover:text-senda-teal/60"
                  }`}
                >
                  {s === "sin_conectar" ? "Sin conectar" : s === "conectada" ? "Conectada" : "Trabajada"}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
