"use server";

import { createClient } from "@/utils/supabase/server";
import { encodedRedirect } from "@/utils/utils";
import { redirect } from "next/navigation";

import { NoteResponse, NotesListResponse, NoteDetails } from "@/types/notes";
import { create } from "domain";
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

export async function createNote(
  userId: string,
  noteInfo: NoteDetails
): Promise<NoteResponse> {
  try {
    if (!userId) {
      return { success: false, error: "User ID is required" };
    }
    if (!noteInfo.title?.trim()) {
      return { success: false, error: "Title is required" };
    }
    if (!noteInfo.content?.trim()) {
      return { success: false, error: "Content is required" };
    }

    const supabase = await createClient();
    const { data, error } = await supabase
      .from("notes")
      .insert({
        user_id: userId,
        title: noteInfo.title.trim(),
        content: noteInfo.content.trim(),
      })
      .select()
      .single();

    if (error) {
      return { success: false, error: error.message };
    }
    if (!data) {
      return { success: false, error: "Failed to create note" };
    }

    return {
      success: true,
      message: "Note successfully added",
      note_details: data,
    };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to create note",
    };
  }
}

export async function updateNote(
  userId: string,
  noteId: string,
  noteInfo: Partial<NoteDetails>
): Promise<NoteResponse> {
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
      .update({
        title: noteInfo.title?.trim(),
        content: noteInfo.content?.trim(),
        updated_at: new Date().toISOString(),
      })
      .eq("user_id", userId)
      .eq("id", noteId)
      .select()
      .single();

    if (error) {
      return { success: false, error: error.message };
    }
    if (!data) {
      return { success: false, error: "Failed to update note" };
    }
    return {
      success: true,
      message: "Note updated successfully",
      note_details: data,
    };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to update note",
    };
  }
}

export async function deleteNote(
  userId: string,
  noteId: string
): Promise<NoteResponse> {
  try {
    if (!userId || !noteId) {
      return {
        success: false,
        error: "User ID and noteId required",
      };
    }
    if (isNaN(Number(noteId))) {
      return {
        success: false,
        error: "Invalid Note ID format",
      };
    }
    const supabase = await createClient();
    const { error } = await supabase
      .from("notes")
      .delete()
      .eq("user_id", userId)
      .eq("id", noteId);

    if (error) {
      return { success: false, error: error.message };
    }
    return {
      success: true,
      message: "Note deleted successfully",
    };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to delete note",
    };
  }
}

export async function searchNotes(
  userId: string,
  searchTerm: string
): Promise<NotesListResponse> {
  try {
    if (!userId) {
      return { success: false, error: "User ID is required" };
    }
    if (!searchTerm?.trim()) {
      return { success: false, error: "Search term is required" };
    }

    const supabase = await createClient();
    const { data, error } = await supabase
      .from("notes")
      .select("*")
      .eq("user_id", userId)
      .or(
        `title.ilike.%${searchTerm.trim()}%,content.ilike.%${searchTerm.trim()}%`
      );

    if (error) {
      return { success: false, error: error.message };
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
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to search notes",
    };
  }
}

export async function getNotesByDate(
  userId: string,
  startDate: string,
  endDate: string
): Promise<NotesListResponse> {
  try {
    if (!userId) {
      return { success: false, error: "User ID is required" };
    }
    if (!startDate || !endDate) {
      return { success: false, error: "Start and end dates are required" };
    }

    const supabase = await createClient();
    const { data, error } = await supabase
      .from("notes")
      .select("*")
      .eq("user_id", userId)
      .gte("created_at", startDate)
      .lte("created_at", endDate);

    if (error) {
      return { success: false, error: error.message };
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
      total: notesInfo.length,
      notes: notesInfo,
    };
  } catch (err) {
    return {
      success: false,
      error:
        err instanceof Error ? err.message : "Failed to fetch notes by date",
    };
  }
}

export async function getNotesByTitle(
  userId: string,
  title: string
): Promise<NotesListResponse> {
  try {
    if (!userId) {
      return { success: false, error: "User ID is required" };
    }
    if (!title?.trim()) {
      return { success: false, error: "Title is required" };
    }

    const supabase = await createClient();
    const { data, error } = await supabase
      .from("notes")
      .select("*")
      .eq("user_id", userId)
      .ilike("title", title.trim());

    if (error) {
      return { success: false, error: error.message };
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
    return {
      success: false,
      error:
        err instanceof Error ? err.message : "Failed to fetch notes by title",
    };
  }
}
