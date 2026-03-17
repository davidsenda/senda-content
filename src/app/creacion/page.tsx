"use client";
import { useState } from "react";

const objetivos = [
  { id: "atraer", label: "Atraer audiencia nueva", emoji: "🧲" },
  { id: "nutrir", label: "Nutrir mi comunidad", emoji: "🌱" },
  { id: "convertir", label: "Convertir / Vender", emoji: "💰" },
  { id: "posicionar", label: "Posicionarme como referente", emoji: "🏔️" },
  { id: "conversar", label: "Generar conversación", emoji: "💬" },
];

const energias = [
  { id: "alta", label: "Estoy encendido", desc: "Quiero grabar, crear algo potente", emoji: "🔥" },
  { id: "media", label: "Tengo tiempo y ganas", desc: "Puedo dedicarle un buen rato", emoji: "⚡" },
  { id: "normal", label: "Algo que impacte sin matarme", desc: "Quiero resultado con esfuerzo justo", emoji: "✨" },
  { id: "baja", label: "Lo mínimo viable", desc: "Ni tiempo ni ganas, pero quiero publicar", emoji: "💤" },
];

const canales = [
  { id: "instagram", label: "Instagram", emoji: "📸" },
  { id: "linkedin", label: "LinkedIn", emoji: "💼" },
  { id: "newsletter", label: "Newsletter", emoji: "📧" },
];

const pilares = [
  { id: "sistemas", label: "Sistemas y operaciones", emoji: "⚙️" },
  { id: "personas", label: "Liderazgo y personas", emoji: "👥" },
  { id: "libertad", label: "Libertad y filosofía de vida", emoji: "🕊️" },
];

const formatosPorEnergia: Record<string, string[]> = {
  alta: ["Video/Reel", "Carrusel largo", "Artículo", "Newsletter completa"],
  media: ["Carrusel", "Post largo con imagen", "Newsletter"],
  normal: ["Post con imagen", "Carrusel corto", "Story con CTA"],
  baja: ["Story rápida", "Post texto corto", "Meme", "Repost con comentario"],
};

const tonosPorObjetivo: Record<string, string[]> = {
  atraer: ["provocador pero accesible", "contrarian con gancho", "storytelling emocional"],
  nutrir: ["cercano y generoso", "pedagógico sin aburrir", "reflexivo con profundidad"],
  convertir: ["directo con urgencia sana", "caso práctico con resultado", "transformacional"],
  posicionar: ["analítico con opinión", "frameworks propios", "controversial con datos"],
  conversar: ["pregunta incómoda", "opinión polarizante", "debate abierto"],
};

interface Suggestion {
  titulo: string;
  formato: string;
  tono: string;
  pilar: string;
  canal: string;
  estructura: string;
}

export default function CreacionPage() {
  const [objetivo, setObjetivo] = useState("");
  const [energia, setEnergia] = useState("");
  const [canalesSeleccionados, setCanalesSeleccionados] = useState<string[]>([]);
  const [pilar, setPilar] = useState("");
  const [mode, setMode] = useState<"single" | "week">("single");
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [generating, setGenerating] = useState(false);

  const toggleCanal = (canalId: string) => {
    setCanalesSeleccionados(prev =>
      prev.includes(canalId)
        ? prev.filter(c => c !== canalId)
        : [...prev, canalId]
    );
  };

  const generate = () => {
    if (!objetivo || !energia || canalesSeleccionados.length === 0) return;
    setGenerating(true);

    setTimeout(() => {
      const formatos = formatosPorEnergia[energia] || formatosPorEnergia.normal;
      const tonos = tonosPorObjetivo[objetivo] || tonosPorObjetivo.nutrir;
      const pilarLabel = pilares.find(p => p.id === pilar)?.label || pilares[Math.floor(Math.random() * pilares.length)].label;

      const titulares: Record<string, string[]> = {
        sistemas: [
          "Tu negocio no necesita más herramientas. Necesita un sistema que las conecte.",
          "El caos de tu empresa no es falta de talento. Es falta de estructura.",
          "Dejé de usar 12 herramientas y todo mejoró. Solo necesitaba un sistema.",
          "Lo que nadie te dice sobre automatizar: sin proceso claro, automatizas el desorden.",
        ],
        personas: [
          "Dejé de preguntar '¿cómo va todo?' y mi equipo empezó a decirme la verdad.",
          "El problema no es que tu equipo no rinda. Es que no sabe qué esperas.",
          "Contratar talento brillante no sirve si tu sistema los apaga.",
          "La confianza no se pide, se diseña con sistemas claros y expectativas reales.",
        ],
        libertad: [
          "Facturas 6 cifras pero no recuerdas la última vez que cenaste tranquilo.",
          "El propósito se ha convertido en el nuevo jefe tóxico que no puedes despedir.",
          "Dejé de perseguir la productividad y empecé a diseñar mi libertad.",
          "Más beneficio no significa mejor vida. A veces significa más jaula dorada.",
        ],
      };

      const pilarKey = pilar || ["sistemas", "personas", "libertad"][Math.floor(Math.random() * 3)];
      const availableTitles = titulares[pilarKey] || titulares.sistemas;

      const results: Suggestion[] = [];
      const usedTitles = new Set<number>();

      const itemCount = mode === "week" ? 5 + Math.floor(Math.random() * 3) : 3;

      for (let i = 0; i < itemCount; i++) {
        let titleIdx: number;
        do { titleIdx = Math.floor(Math.random() * availableTitles.length); } while (usedTitles.has(titleIdx) && usedTitles.size < availableTitles.length);
        usedTitles.add(titleIdx);

        const selectedCanal = canalesSeleccionados[i % canalesSeleccionados.length];
        const canalLabel = canales.find(c => c.id === selectedCanal)?.label || "Instagram";

        results.push({
          titulo: availableTitles[titleIdx],
          formato: formatos[i % formatos.length],
          tono: tonos[i % tonos.length],
          pilar: pilarLabel,
          canal: canalLabel,
          estructura: generateEstructura(formatos[i % formatos.length]),
        });
      }

      setSuggestions(results);
      setGenerating(false);
    }, 1500);
  };

  const savePieza = async (s: Suggestion) => {
    await fetch("/api/piezas", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        titulo: s.titulo,
        contenido: s.estructura,
        pilar: s.pilar,
        formato: s.formato,
        tono: s.tono,
        canal: s.canal,
      }),
    });
    alert("Pieza guardada");
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-heading font-semibold text-senda-jet">Creación</h1>
        <p className="mt-1 text-senda-teal/60 text-sm">
          Cuéntame cómo estás hoy y qué quieres lograr. Yo te digo qué crear.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Config panel */}
        <div className="space-y-6">
          {/* Mode selector */}
          <div className="card">
            <h2 className="font-heading font-semibold text-senda-jet mb-3">¿Cómo quieres planificar?</h2>
            <div className="flex gap-2">
              <button
                onClick={() => setMode("single")}
                className={`chip flex-1 justify-center ${mode === "single" ? "chip-active" : "chip-inactive"}`}
              >
                📝 Una pieza
              </button>
              <button
                onClick={() => setMode("week")}
                className={`chip flex-1 justify-center ${mode === "week" ? "chip-active" : "chip-inactive"}`}
              >
                📅 Semana completa
              </button>
            </div>
          </div>

          {/* Objetivo */}
          <div className="card">
            <h2 className="font-heading font-semibold text-senda-jet mb-3">¿Qué quieres conseguir?</h2>
            <div className="space-y-2">
              {objetivos.map(o => (
                <button
                  key={o.id}
                  onClick={() => setObjetivo(o.id)}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-all text-sm ${
                    objetivo === o.id ? "bg-senda-teal text-white" : "bg-senda-beige/50 hover:bg-senda-light/30"
                  }`}
                >
                  {o.emoji} {o.label}
                </button>
              ))}
            </div>
          </div>

          {/* Energía */}
          <div className="card">
            <h2 className="font-heading font-semibold text-senda-jet mb-3">¿Cómo estás de energía?</h2>
            <div className="space-y-2">
              {energias.map(e => (
                <button
                  key={e.id}
                  onClick={() => setEnergia(e.id)}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-all ${
                    energia === e.id ? "bg-senda-teal text-white" : "bg-senda-beige/50 hover:bg-senda-light/30"
                  }`}
                >
                  <span className="text-sm font-medium">{e.emoji} {e.label}</span>
                  <span className={`block text-xs mt-0.5 ${energia === e.id ? "text-white/70" : "text-senda-teal/50"}`}>{e.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Canales - Multi select */}
          <div className="card">
            <h2 className="font-heading font-semibold text-senda-jet mb-3">¿En qué canales?</h2>
            <div className="space-y-2">
              {canales.map(c => (
                <button
                  key={c.id}
                  onClick={() => toggleCanal(c.id)}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-all text-sm ${
                    canalesSeleccionados.includes(c.id)
                      ? "bg-senda-teal text-white"
                      : "bg-senda-beige/50 hover:bg-senda-light/30"
                  }`}
                >
                  <span className="mr-2">{canalesSeleccionados.includes(c.id) ? "✓" : "○"}</span>
                  {c.emoji} {c.label}
                </button>
              ))}
            </div>
          </div>

          {/* Pilar */}
          <div className="card">
            <h2 className="font-heading font-semibold text-senda-jet mb-1">¿Sobre qué pilar?</h2>
            <p className="text-xs text-senda-teal/40 mb-3">(opcional)</p>
            <div className="space-y-2">
              {pilares.map(p => (
                <button
                  key={p.id}
                  onClick={() => setPilar(pilar === p.id ? "" : p.id)}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-all text-sm ${
                    pilar === p.id ? "bg-senda-teal text-white" : "bg-senda-beige/50 hover:bg-senda-light/30"
                  }`}
                >
                  {p.emoji} {p.label}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={generate}
            disabled={!objetivo || !energia || canalesSeleccionados.length === 0 || generating}
            className="btn-yellow w-full text-base py-3 disabled:opacity-50"
          >
            {generating ? "Generando..." : mode === "week" ? "📅 Generar semana completa" : "✏️ Generar sugerencia"}
          </button>
        </div>

        {/* Results */}
        <div className="space-y-4">
          {suggestions.length === 0 && !generating && (
            <div className="card text-center py-16 text-senda-teal/40">
              <p className="text-4xl mb-4">✏️</p>
              <p>Configura tus preferencias y genera sugerencias de contenido</p>
            </div>
          )}
          {generating && (
            <div className="card text-center py-16 text-senda-teal/60">
              <p className="text-4xl mb-4 animate-pulse">✨</p>
              <p>Generando sugerencias...</p>
            </div>
          )}
          {mode === "week" && suggestions.length > 0 && (
            <div className="card bg-senda-yellow/5 border border-senda-yellow/20">
              <p className="text-sm font-heading font-semibold text-senda-jet">
                📅 Plan semanal: {suggestions.length} piezas
              </p>
              <p className="text-xs text-senda-teal/60 mt-1">
                Distribuidas entre {canalesSeleccionados.map(c => canales.find(ch => ch.id === c)?.label).join(", ")}
              </p>
            </div>
          )}
          {suggestions.map((s, i) => (
            <div key={i} className="card hover:shadow-md transition-shadow">
              {mode === "week" && (
                <p className="text-xs text-senda-teal/40 mb-2 font-mono-senda">
                  {["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"][i % 7]}
                </p>
              )}
              <h3 className="font-heading font-semibold text-senda-jet text-lg mb-3">{s.titulo}</h3>
              <div className="flex flex-wrap gap-2 mb-3">
                <span className="text-xs bg-senda-beige px-2 py-1 rounded">{s.pilar}</span>
                <span className="text-xs bg-senda-yellow/20 text-senda-text px-2 py-1 rounded">{s.formato}</span>
                <span className="text-xs bg-senda-light/30 px-2 py-1 rounded">{s.tono}</span>
                <span className="text-xs bg-senda-teal/10 px-2 py-1 rounded">{s.canal}</span>
              </div>
              <div className="bg-senda-beige/50 rounded-lg p-3 mb-3">
                <p className="text-xs text-senda-teal/50 mb-1 font-medium">Estructura sugerida:</p>
                <p className="text-sm text-senda-teal/80 whitespace-pre-line">{s.estructura}</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => savePieza(s)} className="btn-primary text-sm flex-1">
                  📝 Guardar pieza
                </button>
                <button className="btn-secondary text-sm">
                  📅 Planificar
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function generateEstructura(formato: string): string {
  const estructuras: Record<string, string> = {
    "Video/Reel": "1. Gancho visual (3s)\n2. Problema identificable\n3. Tu perspectiva / reencuadre\n4. Ejemplo o dato concreto\n5. CTA o cierre con pregunta",
    "Carrusel largo": "Slide 1: Gancho provocador\nSlide 2: El problema real\nSlide 3-5: Framework o pasos\nSlide 6: Ejemplo real\nSlide 7: Conclusión + CTA",
    "Carrusel": "Slide 1: Titular + gancho\nSlide 2-4: Ideas clave\nSlide 5: Cierre con CTA",
    "Carrusel corto": "Slide 1: Afirmación contundente\nSlide 2: Desarrollo rápido\nSlide 3: CTA",
    "Post largo con imagen": "Línea 1: Gancho\n\nDesarrollo en 3-4 párrafos cortos\n\nCierre con reflexión o pregunta\n\nP.D. personal",
    "Post con imagen": "Gancho (1 línea)\n\nDesarrollo breve (2-3 párrafos)\n\nCierre + CTA",
    "Post texto corto": "Gancho directo\n\n2-3 líneas de desarrollo\n\nCierre contundente",
    "Newsletter completa": "Asunto: [gancho]\n\nIntro personal (2 líneas)\nBloque principal: idea + ejemplos\nBloque de acción: qué hacer con esto\nCierre + P.D.",
    "Newsletter": "Asunto: [gancho corto]\n\nIdea principal\nDesarrollo con ejemplo\nCTA claro",
    "Story rápida": "Imagen/texto con fondo\nAfirmación directa\nPregunta o encuesta",
    "Story con CTA": "Contexto rápido\nInsight o consejo\nCTA con link o encuesta",
    "Meme": "Imagen reconocible\nTexto superior: expectativa\nTexto inferior: realidad",
    "Artículo": "Titular + subtítulo\nIntro con gancho\n3-5 secciones con subtítulos\nConclusión práctica",
    "Repost con comentario": "Comentario personal (2-3 líneas)\n+ Contenido original reposteado",
    "Hilo": "Tweet 1: Gancho\nTweet 2-5: Ideas principales\nTweet 6: Cierre + CTA",
  };
  return estructuras[formato] || "Gancho → Desarrollo → Cierre con CTA";
}
