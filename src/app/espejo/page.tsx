"use client";
import { useEffect, useState } from "react";

interface MapaData {
  proposito?: string;
  vision?: string;
  intencion?: string;
  temaRaiz?: string;
  propuestaValor?: string;
  tono?: string;
  estilo?: string;
  personalidad?: string;
  audiencia?: string;
  buyerNombre?: string;
  insight?: string;
  pilares?: Array<{ nombre: string; subtemas: string[] }>;
  canales?: Array<{ nombre: string; frecuencia: string }>;
}

interface Stats {
  ideas: number;
  piezas: number;
  planificadas: number;
  publicadas: number;
  mapaComplete: number;
}

export default function EspejoPage() {
  const [mapa, setMapa] = useState<MapaData>({});
  const [stats, setStats] = useState<Stats>({ ideas: 0, piezas: 0, planificadas: 0, publicadas: 0, mapaComplete: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/mapa").then(r => r.json()).then(setMapa),
      fetch("/api/stats").then(r => r.json()).then(setStats),
    ]).finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="text-center py-16">
        <p className="text-senda-teal/60">Cargando tu resumen...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-heading font-semibold text-senda-jet">🪞 El Espejo</h1>
        <p className="mt-2 text-senda-teal/60 text-sm">
          Un resumen de tu marca personal. Lo que eres, lo que comunicas, lo que impactas.
        </p>
      </div>

      {/* Completion status */}
      <div className="card bg-gradient-to-r from-senda-yellow/5 to-senda-teal/5 border border-senda-yellow/20">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-heading font-semibold text-senda-jet">Tu marca está {stats.mapaComplete}% definida</h2>
          <span className="text-2xl">{stats.mapaComplete === 100 ? "✨" : "🚀"}</span>
        </div>
        <div className="w-full bg-senda-beige rounded-full h-3">
          <div className="bg-senda-yellow h-3 rounded-full transition-all" style={{ width: `${stats.mapaComplete}%` }} />
        </div>
        {stats.mapaComplete < 100 && (
          <p className="text-sm text-senda-teal/60 mt-3">Completa tu mapa para definir mejor tu marca</p>
        )}
      </div>

      {/* Purpose & Vision */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="card">
          <h3 className="font-heading font-semibold text-senda-jet text-sm mb-2 flex items-center gap-2">
            <span>🎯</span> Tu Propósito
          </h3>
          <p className="text-senda-teal text-sm leading-relaxed">
            {mapa.proposito || "Aún por definir"}
          </p>
        </div>
        <div className="card">
          <h3 className="font-heading font-semibold text-senda-jet text-sm mb-2 flex items-center gap-2">
            <span>🔭</span> Tu Visión
          </h3>
          <p className="text-senda-teal text-sm leading-relaxed">
            {mapa.vision || "Aún por definir"}
          </p>
        </div>
      </div>

      {/* Theme & Value Prop */}
      <div className="card">
        <h3 className="font-heading font-semibold text-senda-jet mb-4 flex items-center gap-2">
          <span>🌳</span> Tu Posición
        </h3>
        <div className="space-y-3">
          {mapa.temaRaiz && (
            <div>
              <p className="text-xs text-senda-teal/60 font-medium mb-1">TEMA RAÍZ</p>
              <p className="text-senda-teal">{mapa.temaRaiz}</p>
            </div>
          )}
          {mapa.propuestaValor && (
            <div>
              <p className="text-xs text-senda-teal/60 font-medium mb-1">PROPUESTA DE VALOR</p>
              <p className="text-senda-teal">{mapa.propuestaValor}</p>
            </div>
          )}
          {!mapa.temaRaiz && !mapa.propuestaValor && (
            <p className="text-senda-teal/60 text-sm">Aún por definir</p>
          )}
        </div>
      </div>

      {/* Pillars */}
      {mapa.pilares && mapa.pilares.length > 0 && (
        <div className="card">
          <h3 className="font-heading font-semibold text-senda-jet mb-4 flex items-center gap-2">
            <span>🌲</span> Tus Pilares de Contenido
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {mapa.pilares.map((pilar, i) => (
              <div key={i} className="bg-senda-beige/50 rounded-lg p-3 border border-senda-light/20">
                <p className="font-medium text-senda-jet text-sm mb-2">{pilar.nombre}</p>
                {pilar.subtemas && pilar.subtemas.length > 0 && (
                  <div className="space-y-1">
                    {pilar.subtemas.map((subtema, j) => (
                      <p key={j} className="text-xs text-senda-teal/60">• {subtema}</p>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Voice & Style */}
      <div className="card">
        <h3 className="font-heading font-semibold text-senda-jet mb-4 flex items-center gap-2">
          <span>☁️</span> Tu Voz
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {mapa.tono && (
            <div>
              <p className="text-xs text-senda-teal/60 font-medium mb-1">TONO</p>
              <p className="text-senda-teal text-sm">{mapa.tono}</p>
            </div>
          )}
          {mapa.estilo && (
            <div>
              <p className="text-xs text-senda-teal/60 font-medium mb-1">ESTILO</p>
              <p className="text-senda-teal text-sm">{mapa.estilo}</p>
            </div>
          )}
          {mapa.personalidad && (
            <div>
              <p className="text-xs text-senda-teal/60 font-medium mb-1">PERSONALIDAD</p>
              <p className="text-senda-teal text-sm">{mapa.personalidad}</p>
            </div>
          )}
        </div>
      </div>

      {/* Audience & Insight */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {mapa.audiencia && (
          <div className="card">
            <h3 className="font-heading font-semibold text-senda-jet text-sm mb-2 flex items-center gap-2">
              <span>👥</span> Tu Audiencia
            </h3>
            <p className="text-senda-teal text-sm leading-relaxed">{mapa.audiencia}</p>
          </div>
        )}
        {mapa.insight && (
          <div className="card">
            <h3 className="font-heading font-semibold text-senda-jet text-sm mb-2 flex items-center gap-2">
              <span>💡</span> Tu Insight
            </h3>
            <p className="text-senda-teal text-sm leading-relaxed">{mapa.insight}</p>
          </div>
        )}
      </div>

      {/* Channels */}
      {mapa.canales && mapa.canales.length > 0 && (
        <div className="card">
          <h3 className="font-heading font-semibold text-senda-jet mb-4 flex items-center gap-2">
            <span>📢</span> Tus Canales
          </h3>
          <div className="flex flex-wrap gap-2">
            {mapa.canales.map((canal, i) => (
              <div key={i} className="chip chip-active">
                {canal.nombre}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Buyer Persona */}
      {mapa.buyerNombre && (
        <div className="card bg-senda-teal/5 border border-senda-teal/20">
          <h3 className="font-heading font-semibold text-senda-jet mb-4 flex items-center gap-2">
            <span>👤</span> Persona: {mapa.buyerNombre}
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
            {mapa.buyerNombre && (
              <div>
                <p className="text-xs text-senda-teal/60 font-medium mb-1">Nombre</p>
                <p className="text-senda-teal">{mapa.buyerNombre}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Content Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="card text-center">
          <div className="text-3xl font-heading font-bold text-senda-teal">{stats.ideas}</div>
          <div className="text-xs text-senda-teal/60 mt-1">Ideas recopiladas</div>
        </div>
        <div className="card text-center">
          <div className="text-3xl font-heading font-bold text-senda-yellow">{stats.piezas}</div>
          <div className="text-xs text-senda-teal/60 mt-1">Piezas creadas</div>
        </div>
        <div className="card text-center">
          <div className="text-3xl font-heading font-bold text-senda-contrast">{stats.planificadas}</div>
          <div className="text-xs text-senda-teal/60 mt-1">Planificadas</div>
        </div>
        <div className="card text-center">
          <div className="text-3xl font-heading font-bold text-green-600">{stats.publicadas}</div>
          <div className="text-xs text-senda-teal/60 mt-1">Publicadas</div>
        </div>
      </div>

      {/* Call to action */}
      <div className="card bg-gradient-to-r from-senda-jet/5 to-senda-teal/5">
        <p className="text-senda-teal font-heading font-semibold mb-3">
          Tu marca es viva. Actualiza tu mapa con regularidad.
        </p>
        <div className="flex gap-2">
          <a href="/mapa" className="btn-primary text-sm">
            Editar mi mapa
          </a>
          <a href="/creacion" className="btn-secondary text-sm">
            Crear contenido
          </a>
        </div>
      </div>
    </div>
  );
}
