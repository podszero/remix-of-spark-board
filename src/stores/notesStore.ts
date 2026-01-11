import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Board, Note, Column, NoteColor, ChecklistItem } from '@/types/notes';

interface NotesState {
  boards: Board[];
  activeBoardId: string | null;
  sidebarOpen: boolean;
  
  // Actions
  setSidebarOpen: (open: boolean) => void;
  setActiveBoard: (id: string) => void;
  createBoard: (title: string, type: 'simple' | 'kanban') => void;
  deleteBoard: (id: string) => void;
  
  // Column actions
  addColumn: (boardId: string, title: string) => void;
  updateColumnTitle: (boardId: string, columnId: string, title: string) => void;
  deleteColumn: (boardId: string, columnId: string) => void;
  moveColumn: (boardId: string, fromIndex: number, toIndex: number) => void;
  
  // Note actions
  addNote: (boardId: string, columnId: string, title: string, color?: NoteColor) => void;
  updateNote: (boardId: string, noteId: string, updates: Partial<Note>) => void;
  deleteNote: (boardId: string, noteId: string) => void;
  moveNote: (boardId: string, noteId: string, fromColumnId: string, toColumnId: string, toIndex: number) => void;
  
  // Checklist actions
  addChecklistItem: (boardId: string, noteId: string, text: string) => void;
  toggleChecklistItem: (boardId: string, noteId: string, itemId: string) => void;
  updateChecklistItem: (boardId: string, noteId: string, itemId: string, text: string) => void;
  deleteChecklistItem: (boardId: string, noteId: string, itemId: string) => void;
}

const generateId = () => Math.random().toString(36).substr(2, 9);

const createDefaultBoard = (): Board => ({
  id: generateId(),
  title: 'Getting Started',
  type: 'kanban',
  columns: [
    { id: 'welcome', title: 'Welcome', noteIds: ['note1', 'note2'] },
    { id: 'features', title: 'Features', noteIds: ['note3', 'note4'] },
    { id: 'tips', title: 'Tips', noteIds: ['note5', 'note6'] },
  ],
  notes: {
    note1: {
      id: 'note1',
      title: 'Hello!',
      items: [],
      color: 'white',
      columnId: 'welcome',
      createdAt: new Date(),
    },
    note2: {
      id: 'note2',
      title: 'Welcome to Sticky Notes!',
      items: [
        { id: 'i1', text: 'Your visual sticky notes with superpowers', completed: false },
        { id: 'i2', text: 'All data saves automatically', completed: true },
        { id: 'i3', text: 'Try out the features!', completed: false },
      ],
      color: 'yellow',
      columnId: 'welcome',
      createdAt: new Date(),
    },
    note3: {
      id: 'note3',
      title: 'Bullet Journal',
      items: [
        { id: 'i4', text: 'Click the bullet icon to change type', completed: false },
        { id: 'i5', text: 'This is a todo item', completed: false },
        { id: 'i6', text: 'This is in progress', completed: false },
        { id: 'i7', text: 'This is completed', completed: true },
      ],
      color: 'blue',
      columnId: 'features',
      createdAt: new Date(),
    },
    note4: {
      id: 'note4',
      title: 'Colorful Notes',
      items: [
        { id: 'i8', text: '6 beautiful color options', completed: false },
        { id: 'i9', text: 'Click the palette icon on any note', completed: false },
        { id: 'i10', text: 'Organize visually by color', completed: false },
      ],
      color: 'pink',
      columnId: 'features',
      createdAt: new Date(),
    },
    note5: {
      id: 'note5',
      title: 'Drag & Drop',
      items: [
        { id: 'i11', text: 'Drag notes between columns', completed: false },
        { id: 'i12', text: 'Reorder columns by dragging', completed: false },
        { id: 'i13', text: 'Organize your workflow', completed: false },
      ],
      color: 'orange',
      columnId: 'tips',
      createdAt: new Date(),
    },
    note6: {
      id: 'note6',
      title: 'Focus Mode',
      items: [
        { id: 'i14', text: 'Click the expand icon on any note', completed: false },
        { id: 'i15', text: 'Full-screen editing experience', completed: false },
        { id: 'i16', text: 'Access all features in one place', completed: false },
      ],
      color: 'green',
      columnId: 'tips',
      createdAt: new Date(),
    },
  },
  createdAt: new Date(),
  updatedAt: new Date(),
});

export const useNotesStore = create<NotesState>()(
  persist(
    (set, get) => ({
      boards: [createDefaultBoard()],
      activeBoardId: null,
      sidebarOpen: true,

      setSidebarOpen: (open) => set({ sidebarOpen: open }),

      setActiveBoard: (id) => set({ activeBoardId: id }),

      createBoard: (title, type) => {
        const newBoard: Board = {
          id: generateId(),
          title,
          type,
          columns: type === 'kanban' 
            ? [{ id: generateId(), title: 'Notes', noteIds: [] }]
            : [{ id: generateId(), title: 'Notes', noteIds: [] }],
          notes: {},
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        set((state) => ({
          boards: [...state.boards, newBoard],
          activeBoardId: newBoard.id,
        }));
      },

      deleteBoard: (id) => {
        set((state) => ({
          boards: state.boards.filter((b) => b.id !== id),
          activeBoardId: state.activeBoardId === id ? state.boards[0]?.id || null : state.activeBoardId,
        }));
      },

      addColumn: (boardId, title) => {
        set((state) => ({
          boards: state.boards.map((board) =>
            board.id === boardId
              ? {
                  ...board,
                  columns: [...board.columns, { id: generateId(), title, noteIds: [] }],
                  updatedAt: new Date(),
                }
              : board
          ),
        }));
      },

      updateColumnTitle: (boardId, columnId, title) => {
        set((state) => ({
          boards: state.boards.map((board) =>
            board.id === boardId
              ? {
                  ...board,
                  columns: board.columns.map((col) =>
                    col.id === columnId ? { ...col, title } : col
                  ),
                  updatedAt: new Date(),
                }
              : board
          ),
        }));
      },

      deleteColumn: (boardId, columnId) => {
        set((state) => ({
          boards: state.boards.map((board) => {
            if (board.id !== boardId) return board;
            const column = board.columns.find((c) => c.id === columnId);
            const newNotes = { ...board.notes };
            column?.noteIds.forEach((noteId) => delete newNotes[noteId]);
            return {
              ...board,
              columns: board.columns.filter((c) => c.id !== columnId),
              notes: newNotes,
              updatedAt: new Date(),
            };
          }),
        }));
      },

      moveColumn: (boardId, fromIndex, toIndex) => {
        set((state) => ({
          boards: state.boards.map((board) => {
            if (board.id !== boardId) return board;
            const newColumns = [...board.columns];
            const [moved] = newColumns.splice(fromIndex, 1);
            newColumns.splice(toIndex, 0, moved);
            return { ...board, columns: newColumns, updatedAt: new Date() };
          }),
        }));
      },

      addNote: (boardId, columnId, title, color = 'yellow' as NoteColor) => {
        const noteId = generateId();
        set((state) => ({
          boards: state.boards.map((board) => {
            if (board.id !== boardId) return board;
            const newNote: Note = {
              id: noteId,
              title,
              items: [],
              color,
              columnId,
              createdAt: new Date(),
            };
            return {
              ...board,
              columns: board.columns.map((col) =>
                col.id === columnId
                  ? { ...col, noteIds: [...col.noteIds, noteId] }
                  : col
              ),
              notes: { ...board.notes, [noteId]: newNote },
              updatedAt: new Date(),
            };
          }),
        }));
      },

      updateNote: (boardId, noteId, updates) => {
        set((state) => ({
          boards: state.boards.map((board) =>
            board.id === boardId
              ? {
                  ...board,
                  notes: {
                    ...board.notes,
                    [noteId]: { ...board.notes[noteId], ...updates },
                  },
                  updatedAt: new Date(),
                }
              : board
          ),
        }));
      },

      deleteNote: (boardId, noteId) => {
        set((state) => ({
          boards: state.boards.map((board) => {
            if (board.id !== boardId) return board;
            const note = board.notes[noteId];
            const newNotes = { ...board.notes };
            delete newNotes[noteId];
            return {
              ...board,
              columns: board.columns.map((col) =>
                col.id === note?.columnId
                  ? { ...col, noteIds: col.noteIds.filter((id) => id !== noteId) }
                  : col
              ),
              notes: newNotes,
              updatedAt: new Date(),
            };
          }),
        }));
      },

      moveNote: (boardId, noteId, fromColumnId, toColumnId, toIndex) => {
        set((state) => ({
          boards: state.boards.map((board) => {
            if (board.id !== boardId) return board;
            return {
              ...board,
              columns: board.columns.map((col) => {
                if (col.id === fromColumnId) {
                  return { ...col, noteIds: col.noteIds.filter((id) => id !== noteId) };
                }
                if (col.id === toColumnId) {
                  const newNoteIds = [...col.noteIds];
                  newNoteIds.splice(toIndex, 0, noteId);
                  return { ...col, noteIds: newNoteIds };
                }
                return col;
              }),
              notes: {
                ...board.notes,
                [noteId]: { ...board.notes[noteId], columnId: toColumnId },
              },
              updatedAt: new Date(),
            };
          }),
        }));
      },

      addChecklistItem: (boardId, noteId, text) => {
        const itemId = generateId();
        set((state) => ({
          boards: state.boards.map((board) =>
            board.id === boardId
              ? {
                  ...board,
                  notes: {
                    ...board.notes,
                    [noteId]: {
                      ...board.notes[noteId],
                      items: [
                        ...board.notes[noteId].items,
                        { id: itemId, text, completed: false },
                      ],
                    },
                  },
                  updatedAt: new Date(),
                }
              : board
          ),
        }));
      },

      toggleChecklistItem: (boardId, noteId, itemId) => {
        set((state) => ({
          boards: state.boards.map((board) =>
            board.id === boardId
              ? {
                  ...board,
                  notes: {
                    ...board.notes,
                    [noteId]: {
                      ...board.notes[noteId],
                      items: board.notes[noteId].items.map((item) =>
                        item.id === itemId
                          ? { ...item, completed: !item.completed }
                          : item
                      ),
                    },
                  },
                  updatedAt: new Date(),
                }
              : board
          ),
        }));
      },

      updateChecklistItem: (boardId, noteId, itemId, text) => {
        set((state) => ({
          boards: state.boards.map((board) =>
            board.id === boardId
              ? {
                  ...board,
                  notes: {
                    ...board.notes,
                    [noteId]: {
                      ...board.notes[noteId],
                      items: board.notes[noteId].items.map((item) =>
                        item.id === itemId ? { ...item, text } : item
                      ),
                    },
                  },
                  updatedAt: new Date(),
                }
              : board
          ),
        }));
      },

      deleteChecklistItem: (boardId, noteId, itemId) => {
        set((state) => ({
          boards: state.boards.map((board) =>
            board.id === boardId
              ? {
                  ...board,
                  notes: {
                    ...board.notes,
                    [noteId]: {
                      ...board.notes[noteId],
                      items: board.notes[noteId].items.filter(
                        (item) => item.id !== itemId
                      ),
                    },
                  },
                  updatedAt: new Date(),
                }
              : board
          ),
        }));
      },
    }),
    {
      name: 'sticky-notes-storage',
    }
  )
);
