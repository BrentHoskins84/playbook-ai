"use server";

import { Tables, TablesInsert, TablesUpdate } from "@/types/supabase";
import { createClient } from "@/utils/supabase/server";

type Schedule = Tables<"practices">;
type ScheduleInsert = TablesInsert<"practices">;
type ScheduleUpdate = TablesUpdate<"practices">;

export async function getSchedules(coachId: string): Promise<Schedule[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("practices")
    .select("*")
    .eq("coach_id", coachId);

  if (error) {
    console.error("Error fetching schedules:", error);
    throw new Error("Failed to fetch schedules");
  }

  return data;
}

export async function getSchedule(
  scheduleId: string
): Promise<Schedule | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("practices")
    .select("*")
    .eq("id", scheduleId)
    .single();

  if (error) {
    console.error("Error fetching schedule:", error);
    throw new Error("Failed to fetch schedule");
  }

  return data;
}

export async function createSchedule(
  schedule: ScheduleInsert
): Promise<Schedule> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("practices")
    .insert(schedule)
    .select()
    .single();

  if (error) {
    console.error("Error creating schedule:", error);
    throw new Error("Failed to create schedule");
  }

  return data;
}

export async function updateSchedule(
  scheduleId: string,
  schedule: ScheduleUpdate
): Promise<Schedule> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("practices")
    .update(schedule)
    .eq("id", scheduleId)
    .select()
    .single();

  if (error) {
    console.error("Error updating schedule:", error);
    throw new Error("Failed to update schedule");
  }

  return data;
}

export async function deleteSchedule(scheduleId: string): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("practices")
    .delete()
    .eq("id", scheduleId);

  if (error) {
    console.error("Error deleting schedule:", error);
    throw new Error("Failed to delete schedule");
  }
}

export async function getTeams(coachId: string): Promise<Tables<"teams">[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("teams")
    .select("*")
    .eq("head_coach_id", coachId);

  if (error) {
    console.error("Error fetching teams:", error);
    throw new Error("Failed to fetch teams");
  }

  return data;
}
