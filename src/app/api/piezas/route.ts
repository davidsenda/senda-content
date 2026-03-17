import { NextRequest, NextResponse } from "next/server";
import { readDB, writeDB } from "@/lib/db";
import { v4 as uuid } from "uuid";

export async function GET() {
  const db = readDB();
  return NextResponse.json(db.piezas);
}

export async function POST(req: NextRequest) {
  const db = readDB();
  const body = await req.json();
  const pieza = {
    id: uuid(),
    titulo: body.titulo,
    contenido: body.contenido || "",
    pilar: body.pilar || "",
    formato: body.formato || "",
    tono: body.tono || "",
    canal: body.canal || "",
    status: body.status || "guardada" as const,
    createdAt: new Date().toISOString(),
  };
  db.piezas.unshift(pieza);
  writeDB(db);
  return NextResponse.json(pieza, { status: 201 });
}

export async function PUT(req: NextRequest) {
  const db = readDB();
  const body = await req.json();
  const idx = db.piezas.findIndex(p => p.id === body.id);
  if (idx === -1) return NextResponse.json({ error: "Not found" }, { status: 404 });
  db.piezas[idx] = { ...db.piezas[idx], ...body };
  writeDB(db);
  return NextResponse.json(db.piezas[idx]);
}

export async function DELETE(req: NextRequest) {
  const db = readDB();
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
  db.piezas = db.piezas.filter(p => p.id !== id);
  writeDB(db);
  return NextResponse.json({ ok: true });
}
