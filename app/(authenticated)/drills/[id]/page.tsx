import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import { DrillView } from "@/components/drills/drill-view"

export default async function DrillPage({ params }: { params: { id: string } }) {
  const supabase = createClient()
  const { data: drill } = await supabase
    .from("drills")
    .select("*")
    .eq("id", params.id)
    .single()

  if (!drill) {
    notFound()
  }

  return <DrillView drill={drill} />
}

