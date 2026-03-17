import { NextResponse } from "next/server";
import { readDB } from "@/lib/db";

export async function GET() {
  const db = readDB();
  const mapa = db.mapa || {};
  const mapaFields = [
    mapa.proposito, mapa.vision, mapa.temaRaiz, mapa.propuestaValor,
    mapa.audiencia, mapa.insight, mapa.buyerNombre, mapa.porQueTu,
    mapa.pilares?.length, mapa.canales?.length,
  ];
  const filled = mapaFields.filter(Boolean).length;
  const mapaComplete = Math.round((filled / mapaFields.length) * 100);

  const today = new Date().toISOString().split("T")[0];
  const todayItems = db.planItems.filter(p => p.date === today);

  return NextResponse.json({
    ideas: db.ideas.length,
    piezas: db.piezas.length,
    planificadas: todayItems.length,
    publicadas: db.piezas.filter(p => p.status === "publicada").length,
    mapaComplete,
  });
}
