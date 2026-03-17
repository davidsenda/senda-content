"use client";
import Link from "next/link";
import { useEffect, useState } from "react";

interface Stats {
  ideas: number;
  piezas: number;
  planificadas: number;
  publicadas: number;
  mapaComplete: number;
}

const quotes = [
  "Tu marca personal no es lo que dices de ti. Es lo que haces cuando nadie mira.",
  "El mejor KPI es volver a casa antes.",
  "Trabajar mejor para vivir mejor no es una frase. Es una decisión.",
  "No te falta liderazgo. Te falta un sistema que no te agote.",
  "Lo que no está escrito, se pierde. Lo que se repite sin sistema, agota.",
  "Cambiar cómo se trabaja empieza por cambiar cómo se piensa.",
];

export default function Dashboard() {
  const [stats, setStats] = useState<Stats>({ ideas: 0, piezas: 0, planificadas: 0, publicadas: 0, mapaComplete: 0 });
  const [quote] = useState(quotes[Math.floor(Math.random() * quotes.length)]);

  useEffect(() => {
    fetch("/api/stats").then(r => r.json()).then(setStats).catch(() => {});
  }, []);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Buenos días" : hour < 20 ? "Buenas tardes" : "Buenas noches";

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-heading font-semibold text-senda-jet">
          {greeting}, David
        </h1>
        <p className="mt-2 text-senda-teal/70 italic text-sm">&ldquo;{quote}&rdquo;</p>
      </div>

      {/* Progress cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link href="/mapa" className="card hover:shadow-md transition-shadow group">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-heading font-semibold">🗺️ Mi Mapa</h2>
            <span className="text-xs font-mono-senda text-senda-teal/60">identidad</span>
          </div>
          <div className="w-full bg-senda-beige rounded-full h-2 mb-2">
            <div className="bg-senda-yellow h-2 rounded-full transition-all" style={{ width: `${stats.mapaComplete}%` }} />
          </div>
          <p className="text-sm text-senda-teal/60">
            {stats.mapaComplete === 100 ? "Mapa completo" : "Sigue completando →"}
          </p>
        </Link>

        <div className="card">
          <h2 className="text-lg font-heading font-semibold mb-3">📅 Hoy</h2>
          <p className="text-sm text-senda-teal/60 mb-3">
            {stats.planificadas > 0
              ? `Tienes ${stats.planificadas} piezas planificadas`
              : "No tienes nada planificado para hoy"}
          </p>
          <div className="flex gap-2">
            <Link href="/creacion" className="btn-primary text-sm">Generar contenido</Link>
            <Link href="/planificador" className="btn-secondary text-sm">Ir al planificador</Link>
          </div>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Link href="/ideas" className="card text-center hover:shadow-md transition-shadow">
          <div className="text-3xl font-heading font-bold text-senda-teal">{stats.ideas}</div>
          <div className="text-sm text-senda-teal/60 mt-1">Ideas</div>
        </Link>
        <Link href="/creacion" className="card text-center hover:shadow-md transition-shadow">
          <div className="text-3xl font-heading font-bold text-senda-yellow">{stats.piezas}</div>
          <div className="text-sm text-senda-teal/60 mt-1">Piezas</div>
        </Link>
        <Link href="/planificador" className="card text-center hover:shadow-md transition-shadow">
          <div className="text-3xl font-heading font-bold text-senda-contrast">{stats.planificadas}</div>
          <div className="text-sm text-senda-teal/60 mt-1">Planificadas</div>
        </Link>
        <Link href="/planificador" className="card text-center hover:shadow-md transition-shadow">
          <div className="text-3xl font-heading font-bold text-green-600">{stats.publicadas}</div>
          <div className="text-sm text-senda-teal/60 mt-1">Publicadas</div>
        </Link>
      </div>

      {/* Next steps */}
      <div className="card">
        <h2 className="text-lg font-heading font-semibold mb-4">Tu siguiente paso</h2>
        <div className="space-y-2">
          {stats.mapaComplete < 100 && (
            <Link href="/mapa" className="block p-3 bg-senda-beige rounded-lg hover:bg-senda-light/30 transition-colors text-sm">
              📍 Completa tu Mapa de identidad para que Creación genere mejor contenido
            </Link>
          )}
          {stats.ideas === 0 && (
            <Link href="/ideas" className="block p-3 bg-senda-beige rounded-lg hover:bg-senda-light/30 transition-colors text-sm">
              💡 Empieza a apuntar ideas en tu banco de ideas
            </Link>
          )}
          {stats.ideas > 0 && stats.piezas === 0 && (
            <Link href="/creacion" className="block p-3 bg-senda-beige rounded-lg hover:bg-senda-light/30 transition-colors text-sm">
              ✏️ Genera tu primera pieza de contenido con Creación
            </Link>
          )}
          {stats.piezas > 0 && stats.planificadas === 0 && (
            <Link href="/planificador" className="block p-3 bg-senda-beige rounded-lg hover:bg-senda-light/30 transition-colors text-sm">
              📅 Planifica alguna de tus piezas guardadas
            </Link>
          )}
          <Link href="/espejo" className="block p-3 bg-senda-beige rounded-lg hover:bg-senda-light/30 transition-colors text-sm">
            🪞 Revisa el resumen de tu marca en El Espejo
          </Link>
        </div>
      </div>

      {/* Quick actions */}
      <div className="flex flex-wrap gap-3">
        <Link href="/mapa" className="btn-secondary text-sm">Editar mi mapa</Link>
      </div>
    </div>
  );
}
