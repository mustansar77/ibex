import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

const ALLOWED = new Set([
  "programs",
  "sessions",
  "news",
  "announcements",
  "top_positions",
  "applications",
  "hero_slides",
]);

function getDB() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { table, op, data, id, filter, orderBy, fields = "*" } = body;

    if (!ALLOWED.has(table)) {
      return NextResponse.json({ error: "Invalid table" }, { status: 400 });
    }

    const db = getDB();

    if (op === "select") {
      let query = db.from(table).select(fields);
      if (filter) {
        for (const [col, val] of Object.entries(filter)) {
          query = query.eq(col, val as string);
        }
      }
      if (orderBy) {
        query = query.order(orderBy.col ?? orderBy, { ascending: orderBy.asc ?? true });
      }
      const { data: rows, error } = await query;
      if (error) return NextResponse.json({ error: error.message }, { status: 500 });
      return NextResponse.json({ data: rows });
    }

    if (op === "select_single") {
      let query = db.from(table).select(fields);
      if (filter) {
        for (const [col, val] of Object.entries(filter)) {
          query = query.eq(col, val as string);
        }
      }
      const { data: row, error } = await (query as any).single();
      if (error) return NextResponse.json({ error: error.message }, { status: 500 });
      return NextResponse.json({ data: row });
    }

    if (op === "insert") {
      const { data: inserted, error } = await db
        .from(table)
        .insert(data)
        .select()
        .single();
      if (error) return NextResponse.json({ error: error.message }, { status: 500 });
      return NextResponse.json({ data: inserted });
    }

    if (op === "update") {
      const { data: updated, error } = await db
        .from(table)
        .update(data)
        .eq("id", id)
        .select()
        .single();
      if (error) return NextResponse.json({ error: error.message }, { status: 500 });
      return NextResponse.json({ data: updated });
    }

    if (op === "delete") {
      const { error } = await db.from(table).delete().eq("id", id);
      if (error) return NextResponse.json({ error: error.message }, { status: 500 });
      return NextResponse.json({ data: null });
    }

    return NextResponse.json({ error: "Unknown op" }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message ?? "Server error" }, { status: 500 });
  }
}
