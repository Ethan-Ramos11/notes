"use server";

import { createClient } from "@/utils/supabase/server";
import { encodedRedirect } from "@/utils/utils";
import { redirect } from "next/navigation";

import { NoteResponse, NotesListResponse, NoteDetails } from "@/types/notes";
export async function getNoteById(
  userId: string,
  noteId: string
): Promise<NoteResponse> {
  try {
    if (!userId || !noteId) {
      return {
        success: false,
        error: "User ID and Note ID are required",
      };
    } else if (isNaN(Number(noteId))) {
      return {
        success: false,
        error: "Invalid ID format",
      };
    }
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("notes")
      .select("*")
      .eq("user_id", userId)
      .eq("id", noteId)
      .single();
    if (error) {
      return {
        success: false,
        error: error.message,
      };
    }
    if (!data) {
      return {
        success: false,
        message: "Note not found",
      };
    }
    const info = {
      id: data.id,
      user_id: data.user_id,
      title: data.title?.trim(),
      content: data.content?.trim(),
      created_at: data.created_at,
      updated_at: data.updated_at,
    };
    return { success: true, message: "Note found", note_details: info };
  } catch (err) {
    let errorMsg = "Failed to fetch note";
    if (err instanceof Error) errorMsg = err.message;
    return {
      success: false,
      error: errorMsg,
    };
  }
}

export async function getAllNotes(userId: string): Promise<NotesListResponse> {
  try {
    if (!userId) {
      return {
        success: false,
        error: "User ID required",
      };
    }
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("notes")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });
    if (error) {
      return {
        success: false,
        error: error.message,
      };
    }
    const notesInfo = data.map((note) => ({
      id: note.id,
      user_id: note.user_id,
      title: note.title?.trim(),
      content: note.content?.trim(),
      created_at: note.created_at,
      updated_at: note.updated_at,
    }));
    return {
      success: true,
      message: "Notes found",
      notes: notesInfo,
      total: notesInfo.length,
    };
  } catch (err) {
    let errorMsg = "Failed to fetch notes";
    if (err instanceof Error) errorMsg = err.message;
    return {
      success: false,
      error: errorMsg,
    };
  }
}
