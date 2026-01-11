export type NoteColor = 'yellow' | 'blue' | 'pink' | 'green' | 'orange' | 'white';

export interface ChecklistItem {
  id: string;
  text: string;
  completed: boolean;
}

export interface Note {
  id: string;
  title: string;
  items: ChecklistItem[];
  color: NoteColor;
  columnId: string;
  createdAt: Date;
}

export interface Column {
  id: string;
  title: string;
  noteIds: string[];
}

export interface Board {
  id: string;
  title: string;
  type: 'simple' | 'kanban';
  columns: Column[];
  notes: Record<string, Note>;
  createdAt: Date;
  updatedAt: Date;
}

export interface Workspace {
  boards: Board[];
  activeBoard: string | null;
}
