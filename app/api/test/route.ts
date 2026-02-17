import { supabaseServer } from "@/app/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
    const supabase = supabaseServer()
    const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .limit(1)

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ data })
}