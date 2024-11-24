import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const search = searchParams.get("search")
  const skillFocus = searchParams.get("skillFocus")

  const supabase = createClient()
  let query = supabase
    .from("drills")
    .select("*")
    .order("created_at", { ascending: false })

  if (search) {
    query = query.ilike("name", `%${search}%`)
  }

  if (skillFocus) {
    query = query.eq("skill_focus", skillFocus)
  }

  const { data, error } = await query
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}

export async function POST(request: Request) {
  const supabase = createClient()
  const data = await request.json()

  const { data: drill, error } = await supabase
    .from("drills")
    .insert([data])
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(drill)
}

export async function PUT(request: Request) {
  const supabase = createClient()
  const { id, ...data } = await request.json()

  const { data: drill, error } = await supabase
    .from("drills")
    .update(data)
    .eq("id", id)
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(drill)
}

export async function DELETE(request: Request) {
  const supabase = createClient()
  const { searchParams } = new URL(request.url)
  const id = searchParams.get("id")

  if (!id) {
    return NextResponse.json({ error: "ID is required" }, { status: 400 })
  }

  const { error } = await supabase
    .from("drills")
    .delete()
    .eq("id", id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
