"use client";
import { useEffect, useState } from "react";

interface MapaData {
  [key: string]: any;
}

interface StepField {
  key: string;
  label: string;
  placeholder?: string;
  hint?: string;
  textarea?: boolean;
}

interface Step {
  id: string;
  emoji: string;
  title: string;
  subtitle: string;
  desc: string;
  fields?: StepField[];
  type?: string;
}

const steps: Step[] = [
  {
    id: "semilla", emoji: "🌱", title: "La Semilla", subtitle: "Donde empieza todo",
    desc: "Tu propósito, tu visión, tu intención y tus objetivos.",
    fields: [
      { key: "proposito", label: "Tu propósito", placeholder: "Mi marca existe para...", hint: "¿Para qué existe tu marca personal? No busques frases épicas. Busca verdad." },
      { key: "vision", label: "Tu visión", placeholder: "Quiero llegar a...", hint: "¿Hacia dónde quieres llevar tu vida y tu trabajo?" },
      { key: "intencion", label: "Tu intención", placeholder: "Quiero que la gente...", hint: "¿Qué quieres provocar en los demás con lo que comunicas?" },
      { key: "objetivos", label: "Tus objetivos", placeholder: "Me gustaría conseguir...", hint: "¿Qué te gustaría conseguir gracias a comunicarte mejor?" },
    ],
  },
  {
    id: "raices", emoji: "🌿", title: "Las Raíces", subtitle: "Lo que te sostiene",
    desc: "Tu historia, tus valores y las creencias que guían tu camino.",
    fields: [
      { key: "historia", label: "Tu historia", placeholder: "Mi camino empezó cuando...", hint: "¿Cuál es tu historia? Lo que te trajo hasta aquí.", textarea: true },
      { key: "valores", label: "Tus valores", placeholder: "Lo que no negocio es...", hint: "¿Qué valores son innegociables para ti?" },
      { key: "creencias", label: "Tus creencias", placeholder: "Estoy convencido de que...", hint: "¿Qué crees firmemente sobre tu trabajo y tu sector?" },
    ],
  },
  {
    id: "tronco", emoji: "🪵", title: "El Tronco", subtitle: "Tu posición",
    desc: "Tu tema raíz, tu propuesta de valor y lo que te hace diferente.",
    fields: [
      { key: "temaRaiz", label: "Tema raíz", placeholder: "Mi tema central es...", hint: "El tema del que hablas y alrededor del cual gira todo." },
      { key: "propuestaValor", label: "Propuesta de valor", placeholder: "Ayudo a X a conseguir Y mediante Z...", hint: "¿Qué ofreces y para quién?" },
      { key: "etiqueta", label: "Etiqueta profesional", placeholder: "CEO y cofundador de...", hint: "¿Cómo te defines profesionalmente?" },
      { key: "porQueTu", label: "¿Por qué tú?", placeholder: "Lo que me hace único es...", hint: "¿Qué experiencia, historia o perspectiva te hace la persona adecuada para hablar de esto?", textarea: true },
    ],
  },
  {
    id: "ramas", emoji: "🌲", title: "Las Ramas", subtitle: "Tus pilares de contenido",
    desc: "Los grandes temas sobre los que creas contenido. Máximo 3-4 pilares.",
    type: "pilares",
  },
  {
    id: "copa", emoji: "☁️", title: "La Copa", subtitle: "Tu voz",
    desc: "Cómo suenas, tu personalidad de marca y tu estilo comunicativo.",
    fields: [
      { key: "tono", label: "Tono de voz", placeholder: "Cercano pero directo, con humor...", hint: "¿Cómo suenas cuando comunicas?" },
      { key: "estilo", label: "Estilo de escritura", placeholder: "Frases cortas, ritmo directo...", hint: "¿Cómo escribes? Largo vs corto, formal vs informal." },
      { key: "personalidad", label: "Personalidad", placeholder: "Soy como ese amigo que...", hint: "Si tu marca fuera una persona, ¿cómo sería?" },
    ],
  },
  {
    id: "frutos", emoji: "🍎", title: "Los Frutos", subtitle: "Formatos y frecuencia",
    desc: "Los tipos de contenido que creas y con qué cadencia.",
    fields: [
      { key: "frecuencia", label: "Frecuencia", placeholder: "3 posts por semana...", hint: "¿Con qué frecuencia publicas?" },
    ],
    type: "formatos",
  },
  {
    id: "entorno", emoji: "🌍", title: "El Entorno", subtitle: "Tu audiencia y mercado",
    desc: "Quién te rodea, dónde se mueve tu audiencia y qué te hace diferente.",
    fields: [
      { key: "audiencia", label: "Audiencia principal", placeholder: "Profesionales de 30-45 años que...", hint: "¿Quién es tu audiencia ideal?" },
      { key: "competencia", label: "Competencia / referentes", placeholder: "En mi espacio también están...", hint: "¿Quién más habla de tu tema?" },
      { key: "aliados", label: "Aliados potenciales", placeholder: "Podría colaborar con...", hint: "Personas o marcas con las que podrías colaborar." },
      { key: "posicionamiento", label: "Tu posicionamiento", placeholder: "Lo que me diferencia es...", hint: "¿Qué te hace diferente?" },
    ],
    type: "canales",
  },
  {
    id: "buyer", emoji: "👤", title: "Buyer Persona", subtitle: "Tu cliente ideal",
    desc: "El perfil detallado de la persona a la que te diriges.",
    fields: [
      { key: "buyerNombre", label: "Nombre", placeholder: "Carlos" },
      { key: "buyerEdad", label: "Edad", placeholder: "35-45 años" },
      { key: "buyerProfesion", label: "Profesión", placeholder: "CEO/Founder de negocio online" },
      { key: "buyerDondeEsta", label: "Dónde está", placeholder: "LinkedIn, Instagram, newsletters..." },
      { key: "buyerQueQuiere", label: "Qué quiere", placeholder: "Escalar sin ser el cuello de botella...", textarea: true },
      { key: "buyerQueLeFrena", label: "Qué le frena", placeholder: "Siente que si suelta el control...", textarea: true },
      { key: "buyerQueConsume", label: "Qué consume", placeholder: "Podcasts de negocios, newsletters..." },
      { key: "buyerLenguaje", label: "Lenguaje", placeholder: "Directo, informal, entre iguales..." },
    ],
  },
  {
    id: "insight", emoji: "💡", title: "El Insight", subtitle: "La verdad oculta",
    desc: "La verdad profunda que conecta tu audiencia con tu mensaje.",
    fields: [
      { key: "insight", label: "Insight", placeholder: "No necesitan más herramientas...", hint: "La verdad que tu audiencia siente pero no sabe articular.", textarea: true },
      { key: "fraseAudiencia", label: "Frase de la audiencia", placeholder: "Es que facturo bien, pero siento que...", hint: "Lo que diría tu cliente ideal en una conversación sincera.", textarea: true },
    ],
  },
];

export default function MapaPage() {
  const [data, setData] = useState<MapaData>({});
  const [step, setStep] = useState(0);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/mapa").then(r => r.json()).then(setData).catch(() => {});
  }, []);

  const save = async (newData: MapaData) => {
    setSaving(true);
    setData(newData);
    await fetch("/api/mapa", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newData),
    });
    setSaving(false);
  };

  const updateField = (key: string, value: any) => {
    const updated = { ...data, [key]: value };
    save(updated);
  };

  const currentStep = steps[step];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-heading font-semibold text-senda-jet">Mi Mapa</h1>
        <p className="mt-1 text-senda-teal/60 text-sm">Tu identidad de marca completa. Rellénalo para que el Maestro genere contenido alineado contigo.</p>
      </div>

      {/* Step navigation */}
      <div className="flex gap-1 overflow-x-auto pb-2">
        {steps.map((s, i) => (
          <button
            key={s.id}
            onClick={() => setStep(i)}
            className={`flex-shrink-0 px-3 py-2 rounded-lg text-sm transition-all ${
              i === step
                ? "bg-senda-teal text-white"
                : "bg-white text-senda-teal/60 hover:bg-senda-light/30"
            }`}
          >
            <span className="mr-1">{s.emoji}</span>
            <span className="hidden sm:inline">{s.title}</span>
          </button>
        ))}
      </div>

      {/* Step content */}
      <div className="card">
        <div className="mb-6">
          <p className="text-xs text-senda-teal/40 font-mono-senda mb-2">Paso {step + 1} de {steps.length}</p>
          <h2 className="text-2xl font-heading font-semibold text-senda-jet">{currentStep.title}</h2>
          <p className="text-sm text-senda-teal/60 mt-1">{currentStep.subtitle}</p>
          <p className="text-sm text-senda-teal/80 mt-2">{currentStep.desc}</p>
        </div>

        {/* Pilares special section */}
        {currentStep.type === "pilares" && (
          <PilaresEditor
            pilares={data.pilares || []}
            onChange={(p: any) => updateField("pilares", p)}
          />
        )}

        {/* Canales special section */}
        {currentStep.type === "canales" && (
          <CanalesEditor
            canales={data.canales || []}
            onChange={(c: string[]) => updateField("canales", c)}
          />
        )}

        {/* Formatos special section */}
        {currentStep.type === "formatos" && (
          <FormatosEditor
            formatos={data.formatos || []}
            onChange={(f: string[]) => updateField("formatos", f)}
          />
        )}

        {/* Regular fields */}
        {currentStep.fields?.map(field => (
          <div key={field.key} className="mb-5">
            <label className="block text-sm font-medium text-senda-jet mb-1">{field.label}</label>
            {field.hint && <p className="text-xs text-senda-teal/50 mb-2">{field.hint}</p>}
            {field.textarea ? (
              <textarea
                value={data[field.key] || ""}
                onChange={e => updateField(field.key, e.target.value)}
                placeholder={field.placeholder}
                className="w-full bg-senda-beige/50 border border-senda-light/30 rounded-lg px-4 py-3 text-sm outline-none focus:border-senda-teal/30 resize-none"
                rows={4}
              />
            ) : (
              <input
                type="text"
                value={data[field.key] || ""}
                onChange={e => updateField(field.key, e.target.value)}
                placeholder={field.placeholder}
                className="w-full bg-senda-beige/50 border border-senda-light/30 rounded-lg px-4 py-3 text-sm outline-none focus:border-senda-teal/30"
              />
            )}
          </div>
        ))}

        {/* Navigation */}
        <div className="flex justify-between mt-6 pt-4 border-t border-senda-light/20">
          <button
            onClick={() => setStep(Math.max(0, step - 1))}
            className="btn-secondary text-sm"
            disabled={step === 0}
          >
            ← Anterior
          </button>
          <span className="text-xs text-senda-teal/40 self-center">
            {saving ? "Guardando..." : "Se guarda automáticamente"}
          </span>
          <button
            onClick={() => setStep(Math.min(steps.length - 1, step + 1))}
            className="btn-primary text-sm"
            disabled={step === steps.length - 1}
          >
            Siguiente →
          </button>
        </div>
      </div>
    </div>
  );
}

function PilaresEditor({ pilares, onChange }: { pilares: any[]; onChange: (p: any[]) => void }) {
  const addPilar = () => {
    onChange([...pilares, { nombre: "", subtemas: [""], titulares: [""] }]);
  };
  const updatePilar = (idx: number, field: string, value: any) => {
    const updated = [...pilares];
    updated[idx] = { ...updated[idx], [field]: value };
    onChange(updated);
  };
  const removePilar = (idx: number) => {
    onChange(pilares.filter((_, i) => i !== idx));
  };

  return (
    <div className="space-y-4 mb-5">
      {pilares.map((p, i) => (
        <div key={i} className="bg-senda-beige/50 rounded-lg p-4 border border-senda-light/20">
          <div className="flex items-center justify-between mb-3">
            <input
              value={p.nombre}
              onChange={e => updatePilar(i, "nombre", e.target.value)}
              placeholder="Nombre del pilar"
              className="font-medium bg-transparent outline-none text-senda-jet"
            />
            <button onClick={() => removePilar(i)} className="text-senda-red/40 hover:text-senda-red text-sm">✕</button>
          </div>
          <div className="mb-2">
            <label className="text-xs text-senda-teal/50">Subtemas (separados por coma)</label>
            <input
              value={(p.subtemas || []).join(", ")}
              onChange={e => updatePilar(i, "subtemas", e.target.value.split(",").map((s: string) => s.trim()))}
              className="w-full bg-white border border-senda-light/20 rounded px-3 py-2 text-sm outline-none mt-1"
            />
          </div>
          <div>
            <label className="text-xs text-senda-teal/50">Titulares de referencia (separados por coma)</label>
            <input
              value={(p.titulares || []).join(", ")}
              onChange={e => updatePilar(i, "titulares", e.target.value.split(",").map((s: string) => s.trim()))}
              className="w-full bg-white border border-senda-light/20 rounded px-3 py-2 text-sm outline-none mt-1"
            />
          </div>
        </div>
      ))}
      <button onClick={addPilar} className="btn-secondary text-sm w-full">+ Añadir pilar</button>
    </div>
  );
}

function CanalesEditor({ canales, onChange }: { canales: string[]; onChange: (c: string[]) => void }) {
  const [input, setInput] = useState("");
  const options = ["Instagram", "LinkedIn", "Newsletter", "YouTube", "TikTok", "Twitter/X", "Podcast"];
  const toggle = (c: string) => {
    onChange(canales.includes(c) ? canales.filter(x => x !== c) : [...canales, c]);
  };
  const addCustom = () => {
    if (input.trim() && !canales.includes(input.trim())) {
      onChange([...canales, input.trim()]);
      setInput("");
    }
  };
  return (
    <div className="mb-5">
      <label className="block text-sm font-medium text-senda-jet mb-2">Canales</label>
      <div className="flex flex-wrap gap-2 mb-2">
        {options.map(c => (
          <button key={c} onClick={() => toggle(c)} className={`chip ${canales.includes(c) ? "chip-active" : "chip-inactive"}`}>
            {c}
          </button>
        ))}
      </div>
      <div className="flex gap-2">
        <input value={input} onChange={e => setInput(e.target.value)} placeholder="Otro canal..." className="bg-white border border-senda-light/30 rounded px-3 py-1.5 text-sm outline-none flex-1" />
        <button onClick={addCustom} className="btn-secondary text-sm">Añadir</button>
      </div>
    </div>
  );
}

function FormatosEditor({ formatos, onChange }: { formatos: string[]; onChange: (f: string[]) => void }) {
  const options = ["Post texto", "Carrusel", "Video/Reel", "Meme", "Newsletter", "Artículo", "Story", "Hilo"];
  const toggle = (f: string) => {
    onChange(formatos.includes(f) ? formatos.filter(x => x !== f) : [...formatos, f]);
  };
  return (
    <div className="mb-5">
      <label className="block text-sm font-medium text-senda-jet mb-2">Formatos que usas</label>
      <div className="flex flex-wrap gap-2">
        {options.map(f => (
          <button key={f} onClick={() => toggle(f)} className={`chip ${formatos.includes(f) ? "chip-active" : "chip-inactive"}`}>
            {f}
          </button>
        ))}
      </div>
    </div>
  );
}
