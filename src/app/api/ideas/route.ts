import { NextRequest, NextResponse } from "next/server";
import { readDB, writeDB } from "@/lib/db";
import { v4 as uuid } from "uuid";

export async function GET() {
  const db = readDB();
  return NextResponse.json(db.ideas);
}

export async function POST(req: NextRequest) {
  const db = readDB();
  const body = await req.json();
  const idea = {
    id: uuid(),
    content: body.content,
    status: body.status || "sin_conectar" as const,
    createdAt: new Date().toISOString(),
  };
  db.ideas.unshift(idea);
  writeDB(db);
  return NextResponse.json(idea, { status: 201 });
}

export async function PUT(req: NextRequest) {
  const db = readDB();
  const body = await req.json();
  const idx = db.ideas.findIndex(i => i.id === body.id);
  if (idx === -1) return NextResponse.json({ error: "Not found" }, { status: 404 });
  db.ideas[idx] = { ...db.ideas[idx], ...body };
  writeDB(db);
  return NextResponse.json(db.ideas[idx]);
}

export async function DELETE(req: NextRequest) {
  const db = readDB();
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
  db.ideas = db.ideas.filter(i => i.id !== id);
  writeDB(db);
  return NextResponse.json({ ok: true });
}
