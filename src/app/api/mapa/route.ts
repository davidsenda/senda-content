import { NextRequest, NextResponse } from "next/server";
import { readDB, writeDB } from "@/lib/db";

export async function GET() {
  const db = readDB();
  return NextResponse.json(db.mapa);
}

export async function PUT(req: NextRequest) {
  const db = readDB();
  const body = await req.json();
  db.mapa = { ...db.mapa, ...body };
  writeDB(db);
  return NextResponse.json(db.mapa);
}
