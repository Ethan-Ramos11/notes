// types/notes.ts

export interface NoteDetails {
  id: number;
  user_id: number;
  title: string;
  content: string;
  created_at?: Date;
  updated_at?: Date;
}

export interface NoteResponse {
  success: boolean;
  message?: string;
  error?: string;
  note_details?: NoteDetails;
}

export interface NotesListResponse {
  success: boolean;
  message?: string;
  error?: string;
  notes?: NoteDetails[];
  total?: number;
}
