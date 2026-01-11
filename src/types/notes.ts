export type NoteColor = 'yellow' | 'blue' | 'pink' | 'green' | 'orange' | 'white';
export type ItemType = 'todo' | 'doing' | 'done' | 'event' | 'note' | 'cancelled';
export type TagColor = 'red' | 'orange' | 'yellow' | 'green' | 'blue' | 'purple' | 'pink' | 'gray';

export interface Tag {
  id: string;
  name: string;
  color: TagColor;
}

export interface ChecklistItem {
  id: string;
  text: string;
  completed: boolean;
  type: ItemType;
}

export interface Note {
  id: string;
  title: string;
  items: ChecklistItem[];
  color: NoteColor;
  columnId: string;
  createdAt: Date;
  dueDate?: string;
  tagIds: string[];
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
  tags: Tag[];
}

export type CalendarView = 'daily' | 'weekly' | 'monthly';
