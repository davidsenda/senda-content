import { NextRequest, NextResponse } from "next/server";
import { readDB, writeDB } from "@/lib/db";
import { v4 as uuid } from "uuid";

export async function GET(req: NextRequest) {
  const db = readDB();
  const { searchParams } = new URL(req.url);
  const from = searchParams.get("from");
  const to = searchParams.get("to");

  let items = db.planItems;
  if (from && to) {
    items = items.filter(i => i.date >= from && i.date <= to);
  }

  // Enrich with pieza data
  const enriched = items.map(item => {
    const pieza = db.piezas.find(p => p.id === item.piezaId);
    return { ...item, pieza };
  });

  return NextResponse.json(enriched);
}

export async function POST(req: NextRequest) {
  const db = readDB();
  const body = await req.json();
  const planItem = {
    id: uuid(),
    piezaId: body.piezaId,
    date: body.date,
    slot: body.slot || 0,
  };
  db.planItems.push(planItem);

  // Update pieza status
  const pIdx = db.piezas.findIndex(p => p.id === body.piezaId);
  if (pIdx !== -1) db.piezas[pIdx].status = "planificada";

  writeDB(db);
  return NextResponse.json(planItem, { status: 201 });
}

export async function PUT(req: NextRequest) {
  const db = readDB();
  const body = await req.json();
  const idx = db.planItems.findIndex(i => i.id === body.id);
  if (idx === -1) return NextResponse.json({ error: "Not found" }, { status: 404 });
  db.planItems[idx] = { ...db.planItems[idx], ...body };
  writeDB(db);
  return NextResponse.json(db.planItems[idx]);
}

export async function DELETE(req: NextRequest) {
  const db = readDB();
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
  db.planItems = db.planItems.filter(i => i.id !== id);
  writeDB(db);
  return NextResponse.json({ ok: true });
}
