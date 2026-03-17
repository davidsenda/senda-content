"use client";
import { useEffect, useState } from "react";

interface Pieza {
  id: string;
  titulo: string;
  contenido?: string;
  pilar?: string;
  formato?: string;
  tono?: string;
  canal?: string;
  status: "guardada" | "planificada" | "publicada";
  createdAt: string;
}

type FilterStatus = "todas" | "guardada" | "planificada" | "publicada";

export default function PiezasPage() {
  const [piezas, setPiezas] = useState<Pieza[]>([]);
  const [filter, setFilter] = useState<FilterStatus>("todas");
  const [expanded, setExpanded] = useState<string | null>(null);

  const load = () => fetch("/api/piezas").then(r => r.json()).then(setPiezas).catch(() => {});
  useEffect(() => { load(); }, []);

  const updateStatus = async (id: string, status: Pieza["status"]) => {
    await fetch("/api/piezas", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    load();
  };

  const deletePieza = async (id: string) => {
    if (!confirm("¿Eliminar esta pieza?")) return;
    await fetch(`/api/piezas?id=${id}`, { method: "DELETE" });
    load();
  };

  const filtered = filter === "todas" ? piezas : piezas.filter(p => p.status === filter);

  const counts = {
    todas: piezas.length,
    guardada: piezas.filter(p => p.status === "guardada").length,
    planificada: piezas.filter(p => p.status === "planificada").length,
    publicada: piezas.filter(p => p.status === "publicada").length,
  };

  const statusColors: Record<string, string> = {
    guardada: "bg-gray-100 text-gray-600",
    planificada: "bg-senda-yellow/20 text-yellow-700",
    publicada: "bg-green-100 text-green-700",
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-heading font-semibold text-senda-jet">Mis Piezas</h1>
        <p className="mt-1 text-senda-teal/60 text-sm">
          Piezas del Maestro guardadas para trabajar cuando quieras.
        </p>
      </div>

      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        {(["todas", "guardada", "planificada", "publicada"] as FilterStatus[]).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`chip ${filter === f ? "chip-active" : "chip-inactive"}`}
          >
            {f === "todas" ? "Todas" : f.charAt(0).toUpperCase() + f.slice(1)}s ({counts[f]})
          </button>
        ))}
      </div>

      {/* Piezas grid */}
      <div className="space-y-3">
        {filtered.length === 0 && (
          <div className="card text-center py-12 text-senda-teal/40">
            {piezas.length === 0
              ? "No tienes piezas guardadas. Ve al Maestro para generar contenido."
              : "No hay piezas en esta categoría."}
          </div>
        )}
        {filtered.map(p => (
          <div key={p.id} className="card hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <h3 className="font-heading font-medium text-senda-jet">{p.titulo}</h3>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  <span className={`text-[10px] px-2 py-0.5 rounded-full ${statusColors[p.status]}`}>
                    {p.status.charAt(0).toUpperCase() + p.status.slice(1)}
                  </span>
                  {p.pilar && <span className="text-[10px] bg-senda-beige px-2 py-0.5 rounded-full">{p.pilar}</span>}
                  {p.formato && <span className="text-[10px] bg-senda-yellow/10 px-2 py-0.5 rounded-full">{p.formato}</span>}
                  {p.tono && <span className="text-[10px] bg-senda-light/30 px-2 py-0.5 rounded-full">{p.tono}</span>}
                  {p.canal && <span className="text-[10px] bg-senda-teal/10 px-2 py-0.5 rounded-full">{p.canal}</span>}
                </div>
              </div>
              <span className="text-[10px] text-senda-teal/40 font-mono-senda whitespace-nowrap">
                {new Date(p.createdAt).toLocaleDateString("es-ES")}
              </span>
            </div>

            {/* Expandable content */}
            {expanded === p.id && p.contenido && (
              <div className="mt-3 pt-3 border-t border-senda-light/20">
                <p className="text-sm text-senda-teal/70 whitespace-pre-line">{p.contenido}</p>
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center gap-2 mt-3 pt-3 border-t border-senda-light/10">
              {p.contenido && (
                <button
                  onClick={() => setExpanded(expanded === p.id ? null : p.id)}
                  className="text-xs text-senda-teal/50 hover:text-senda-teal"
                >
                  {expanded === p.id ? "▲ Cerrar" : "▼ Ver estructura"}
                </button>
              )}
              <div className="flex-1" />
              {p.status === "guardada" && (
                <button onClick={() => updateStatus(p.id, "planificada")} className="text-xs text-senda-yellow hover:underline">
                  📅 Planificar
                </button>
              )}
              {p.status === "planificada" && (
                <button onClick={() => updateStatus(p.id, "publicada")} className="text-xs text-green-600 hover:underline">
                  ✓ Marcar publicada
                </button>
              )}
              <button onClick={() => deletePieza(p.id)} className="text-xs text-senda-red/40 hover:text-senda-red">
                Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
