// Simple JSON-based storage
// Uses /tmp on Vercel (serverless), project root locally
// Replace with Vercel Postgres/KV for persistent production data
import fs from "fs";
import path from "path";

const isVercel = process.env.VERCEL === "1";
const DB_PATH = isVercel
  ? path.join("/tmp", "data.json")
  : path.join(process.cwd(), "data.json");

export interface Idea {
  id: string;
  content: string;
  status: "sin_conectar" | "conectada" | "trabajada";
  createdAt: string;
}

export interface Pieza {
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

export interface PlanItem {
  id: string;
  piezaId: string;
  date: string; // YYYY-MM-DD
  slot: number;
}

export interface MapaData {
  // La Semilla
  proposito?: string;
  vision?: string;
  intencion?: string;
  objetivos?: string;
  // Las Raices
  historia?: string;
  valores?: string;
  creencias?: string;
  // El Tronco
  temaRaiz?: string;
  propuestaValor?: string;
  etiqueta?: string;
  porQueTu?: string;
  // Las Ramas
  pilares?: Array<{ nombre: string; subtemas: string[]; titulares: string[] }>;
  // La Copa
  tono?: string;
  estilo?: string;
  personalidad?: string;
  // Los Frutos
  formatos?: string[];
  frecuencia?: string;
  // El Entorno
  audiencia?: string;
  canales?: string[];
  competencia?: string;
  aliados?: string;
  posicionamiento?: string;
  // Buyer Persona
  buyerNombre?: string;
  buyerEdad?: string;
  buyerProfesion?: string;
  buyerDondeEsta?: string;
  buyerQueQuiere?: string;
  buyerQueLeFrena?: string;
  buyerQueConsume?: string;
  buyerLenguaje?: string;
  // Insight
  insight?: string;
  fraseAudiencia?: string;
  // Canales y objetivos
  objetivosCanales?: string[];
}

export interface DB {
  ideas: Idea[];
  piezas: Pieza[];
  planItems: PlanItem[];
  mapa: MapaData;
}

function getDefaultDB(): DB {
  return {
    ideas: [],
    piezas: [],
    planItems: [],
    mapa: {},
  };
}

export function readDB(): DB {
  try {
    if (fs.existsSync(DB_PATH)) {
      const raw = fs.readFileSync(DB_PATH, "utf-8");
      return JSON.parse(raw);
    }
  } catch (e) {
    console.error("Error reading DB:", e);
  }
  return getDefaultDB();
}

export function writeDB(data: DB): void {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), "utf-8");
}
