"use client";
import { useEffect, useState } from "react";

interface Pieza {
  id: string;
  titulo: string;
  pilar?: string;
  formato?: string;
  canal?: string;
  status: string;
}

interface PlanItem {
  id: string;
  piezaId: string;
  date: string;
  slot: number;
  pieza?: Pieza;
}

type ViewType = "semanal" | "mensual" | "lista";

const DAYS = ["LUN", "MAR", "MIÉ", "JUE", "VIE", "SÁB", "DOM"];

function getWeekDates(offset: number): string[] {
  const now = new Date();
  const day = now.getDay();
  const monday = new Date(now);
  monday.setDate(now.getDate() - (day === 0 ? 6 : day - 1) + offset * 7);
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return d.toISOString().split("T")[0];
  });
}

function getMonthDates(offset: number): string[] {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + offset;
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const dates: string[] = [];
  for (let d = new Date(firstDay); d <= lastDay; d.setDate(d.getDate() + 1)) {
    dates.push(d.toISOString().split("T")[0]);
  }
  return dates;
}

function formatDateRange(dates: string[]): string {
  if (dates.length === 0) return "";
  const start = new Date(dates[0]);
  const end = new Date(dates[dates.length - 1]);
  const months = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];
  return `${start.getDate()} – ${end.getDate()} de ${months[end.getMonth()]} de ${end.getFullYear()}`;
}

export default function PlanificadorPage() {
  const [view, setView] = useState<ViewType>("mensual");
  const [weekOffset, setWeekOffset] = useState(0);
  const [monthOffset, setMonthOffset] = useState(0);
  const [planItems, setPlanItems] = useState<PlanItem[]>([]);
  const [piezas, setPiezas] = useState<Pieza[]>([]);
  const [showBandeja, setShowBandeja] = useState(true);
  const [dragPieza, setDragPieza] = useState<string | null>(null);

  const weekDates = getWeekDates(weekOffset);
  const monthDates = getMonthDates(monthOffset);

  const loadPlan = () => {
    if (view === "semanal") {
      const from = weekDates[0];
      const to = weekDates[6];
      fetch(`/api/planificador?from=${from}&to=${to}`).then(r => r.json()).then(setPlanItems).catch(() => {});
    } else if (view === "mensual") {
      const from = monthDates[0];
      const to = monthDates[monthDates.length - 1];
      fetch(`/api/planificador?from=${from}&to=${to}`).then(r => r.json()).then(setPlanItems).catch(() => {});
    } else {
      fetch("/api/planificador").then(r => r.json()).then(setPlanItems).catch(() => {});
    }
  };

  const loadPiezas = () => {
    fetch("/api/piezas").then(r => r.json()).then((all: Pieza[]) => {
      setPiezas(all.filter(p => p.status === "guardada"));
    }).catch(() => {});
  };

  useEffect(() => { loadPlan(); loadPiezas(); }, [weekOffset, monthOffset, view]);

  const assignToDate = async (piezaId: string, date: string) => {
    await fetch("/api/planificador", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ piezaId, date }),
    });
    loadPlan();
    loadPiezas();
  };

  const removePlanItem = async (id: string) => {
    await fetch(`/api/planificador?id=${id}`, { method: "DELETE" });
    loadPlan();
    loadPiezas();
  };

  const isToday = (date: string) => date === new Date().toISOString().split("T")[0];

  const canalColors: Record<string, string> = {
    Instagram: "border-l-pink-400",
    LinkedIn: "border-l-blue-500",
    Newsletter: "border-l-senda-yellow",
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-heading font-semibold text-senda-jet">Planificador</h1>
        <p className="mt-1 text-senda-teal/60 text-sm">
          Organiza tu contenido arrastrando las piezas al calendario.
        </p>
      </div>

      {/* View switcher + Navigation */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex gap-1">
          {(["semanal", "mensual", "lista"] as ViewType[]).map(v => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={`chip ${view === v ? "chip-active" : "chip-inactive"}`}
            >
              {v === "semanal" ? "📋 Semanal" : v === "mensual" ? "📅 Mensual" : "📝 Lista"}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-senda-jet">
            {view === "mensual" ? new Date(new Date().getFullYear(), new Date().getMonth() + monthOffset).toLocaleDateString("es-ES", { month: "long", year: "numeric" }) : formatDateRange(weekDates)}
          </span>
          <div className="flex gap-1">
            <button onClick={() => view === "mensual" ? setMonthOffset(monthOffset - 1) : setWeekOffset(weekOffset - 1)} className="btn-secondary text-sm px-3">←</button>
            <button onClick={() => { setWeekOffset(0); setMonthOffset(0); }} className="btn-secondary text-sm">Hoy</button>
            <button onClick={() => view === "mensual" ? setMonthOffset(monthOffset + 1) : setWeekOffset(weekOffset + 1)} className="btn-secondary text-sm px-3">→</button>
          </div>
        </div>
      </div>

      <div className="flex gap-6">
        {/* Bandeja */}
        {showBandeja && (
          <div className="w-56 flex-shrink-0">
            <div className="card sticky top-4">
              <h3 className="font-heading font-semibold text-sm mb-3">Bandeja</h3>
              <p className="text-[10px] text-senda-teal/40 mb-3">Sin asignar</p>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {piezas.length === 0 && (
                  <p className="text-xs text-senda-teal/40 text-center py-4">Sin piezas por asignar</p>
                )}
                {piezas.map(p => (
                  <div
                    key={p.id}
                    draggable
                    onDragStart={() => setDragPieza(p.id)}
                    onDragEnd={() => setDragPieza(null)}
                    className={`p-2 bg-senda-beige/50 rounded-lg text-xs cursor-grab active:cursor-grabbing border-l-2 ${canalColors[p.canal || ""] || "border-l-senda-light"}`}
                  >
                    <p className="font-medium text-senda-text line-clamp-2">{p.titulo}</p>
                    <div className="flex gap-1 mt-1">
                      {p.formato && <span className="text-[9px] text-senda-teal/40">{p.formato}</span>}
                      {p.canal && <span className="text-[9px] text-senda-teal/40">· {p.canal}</span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Calendar grid */}
        <div className="flex-1">
          {view === "semanal" && (
            <div className="grid grid-cols-7 gap-2">
              {weekDates.map((date, i) => {
                const dayItems = planItems.filter(p => p.date === date);
                const dayNum = new Date(date).getDate();
                return (
                  <div
                    key={date}
                    onDragOver={e => e.preventDefault()}
                    onDrop={() => {
                      if (dragPieza) assignToDate(dragPieza, date);
                    }}
                    className={`min-h-[200px] rounded-lg border-2 transition-colors ${
                      isToday(date) ? "border-senda-yellow bg-senda-yellow/5" : "border-senda-light/20 bg-white"
                    } ${dragPieza ? "border-dashed border-senda-teal/30" : ""}`}
                  >
                    <div className={`px-3 py-2 text-center border-b ${isToday(date) ? "border-senda-yellow/30" : "border-senda-light/10"}`}>
                      <div className="text-[10px] text-senda-teal/40 font-medium">{DAYS[i]}</div>
                      <div className={`text-lg font-heading font-semibold ${isToday(date) ? "text-senda-yellow" : "text-senda-jet"}`}>{dayNum}</div>
                    </div>
                    <div className="p-2 space-y-1.5">
                      {dayItems.map(item => (
                        <div
                          key={item.id}
                          className={`p-2 rounded text-[10px] bg-senda-beige/50 border-l-2 group relative ${canalColors[item.pieza?.canal || ""] || "border-l-senda-light"}`}
                        >
                          <p className="font-medium text-senda-text line-clamp-3">{item.pieza?.titulo || "Sin título"}</p>
                          {item.pieza?.formato && (
                            <p className="text-senda-teal/40 mt-0.5">{item.pieza.formato}</p>
                          )}
                          <button
                            onClick={() => removePlanItem(item.id)}
                            className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 text-senda-red/50 hover:text-senda-red transition-opacity"
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                      {dayItems.length === 0 && (
                        <p className="text-[10px] text-senda-teal/20 text-center py-4">
                          {dragPieza ? "Suelta aquí" : ""}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {view === "lista" && (
            <div className="space-y-2">
              {planItems.length === 0 && (
                <div className="card text-center py-12 text-senda-teal/40">
                  No hay piezas planificadas esta semana.
                </div>
              )}
              {planItems
                .sort((a, b) => a.date.localeCompare(b.date))
                .map(item => (
                  <div key={item.id} className="card flex items-center gap-4">
                    <div className="text-center w-16">
                      <div className="text-[10px] text-senda-teal/40">{DAYS[new Date(item.date).getDay() === 0 ? 6 : new Date(item.date).getDay() - 1]}</div>
                      <div className="text-lg font-heading font-semibold text-senda-jet">{new Date(item.date).getDate()}</div>
                    </div>
                    <div className={`flex-1 border-l-2 pl-3 ${canalColors[item.pieza?.canal || ""] || "border-l-senda-light"}`}>
                      <p className="font-medium text-sm">{item.pieza?.titulo}</p>
                      <div className="flex gap-2 mt-1">
                        {item.pieza?.formato && <span className="text-[10px] text-senda-teal/40">{item.pieza.formato}</span>}
                        {item.pieza?.canal && <span className="text-[10px] text-senda-teal/40">· {item.pieza.canal}</span>}
                      </div>
                    </div>
                    <button onClick={() => removePlanItem(item.id)} className="text-senda-red/40 hover:text-senda-red text-xs">✕</button>
                  </div>
                ))}
            </div>
          )}

          {view === "mensual" && (
            <div className="space-y-4">
              <MonthlyCalendar
                dates={monthDates}
                planItems={planItems}
                onDrop={(date) => {
                  if (dragPieza) assignToDate(dragPieza, date);
                }}
                onRemove={removePlanItem}
                dragPieza={dragPieza}
                canalColors={canalColors}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

interface MonthlyCalendarProps {
  dates: string[];
  planItems: PlanItem[];
  onDrop: (date: string) => void;
  onRemove: (id: string) => void;
  dragPieza: string | null;
  canalColors: Record<string, string>;
}

function MonthlyCalendar({
  dates,
  planItems,
  onDrop,
  onRemove,
  dragPieza,
  canalColors,
}: MonthlyCalendarProps) {
  const dayLabels = ["LUN", "MAR", "MIÉ", "JUE", "VIE", "SÁB", "DOM"];

  // Group dates into weeks
  const weeks: string[][] = [];
  let currentWeek: string[] = [];

  if (dates.length > 0) {
    const firstDate = new Date(dates[0]);
    const firstDayOfWeek = firstDate.getDay() === 0 ? 6 : firstDate.getDay() - 1;

    // Add empty slots for days before the month starts
    for (let i = 0; i < firstDayOfWeek; i++) {
      currentWeek.push("");
    }

    for (const date of dates) {
      currentWeek.push(date);
      if (currentWeek.length === 7) {
        weeks.push(currentWeek);
        currentWeek = [];
      }
    }

    // Fill remaining slots
    while (currentWeek.length > 0 && currentWeek.length < 7) {
      currentWeek.push("");
    }
    if (currentWeek.length > 0) {
      weeks.push(currentWeek);
    }
  }

  const isToday = (date: string) => date === new Date().toISOString().split("T")[0];

  return (
    <div className="card">
      <div className="grid grid-cols-7 gap-2 mb-4">
        {dayLabels.map(day => (
          <div key={day} className="text-center text-xs font-medium text-senda-teal/60 py-2">
            {day}
          </div>
        ))}
      </div>
      <div className="space-y-2">
        {weeks.map((week, weekIdx) => (
          <div key={weekIdx} className="grid grid-cols-7 gap-2">
            {week.map((date, dayIdx) => {
              const dayItems = date ? planItems.filter(p => p.date === date) : [];
              const dayNum = date ? new Date(date).getDate() : null;
              return (
                <div
                  key={`${weekIdx}-${dayIdx}`}
                  onDragOver={e => e.preventDefault()}
                  onDrop={() => {
                    if (date) onDrop(date);
                  }}
                  className={`min-h-[120px] rounded-lg border-2 transition-colors p-2 ${
                    !date
                      ? "bg-senda-light/5 border-transparent"
                      : isToday(date)
                      ? "border-senda-yellow bg-senda-yellow/5"
                      : "border-senda-light/20 bg-white"
                  } ${dragPieza ? "border-dashed border-senda-teal/30" : ""}`}
                >
                  {date && (
                    <>
                      <div className="text-sm font-heading font-semibold text-senda-jet mb-1">
                        {dayNum}
                      </div>
                      <div className="space-y-1">
                        {dayItems.map(item => (
                          <div
                            key={item.id}
                            className={`p-1 rounded text-[9px] bg-senda-beige/50 border-l-2 group relative ${
                              canalColors[item.pieza?.canal || ""] || "border-l-senda-light"
                            }`}
                          >
                            <p className="font-medium text-senda-text line-clamp-2">{item.pieza?.titulo || "Sin título"}</p>
                            <button
                              onClick={() => onRemove(item.id)}
                              className="absolute top-0 right-0 opacity-0 group-hover:opacity-100 text-senda-red/50 hover:text-senda-red transition-opacity text-xs"
                            >
                              ✕
                            </button>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
