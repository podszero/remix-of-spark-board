import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Board, Note, Column, NoteColor, ChecklistItem, CalendarView, ItemType } from '@/types/notes';

interface NotesState {
  boards: Board[];
  activeBoardId: string | null;
  sidebarOpen: boolean;
  currentView: 'boards' | 'calendar';
  calendarView: CalendarView;
  selectedDate: string; // YYYY-MM-DD format
  
  // Actions
  setSidebarOpen: (open: boolean) => void;
  setActiveBoard: (id: string) => void;
  setCurrentView: (view: 'boards' | 'calendar') => void;
  setCalendarView: (view: CalendarView) => void;
  setSelectedDate: (date: string) => void;
  createBoard: (title: string, type: 'simple' | 'kanban') => void;
  deleteBoard: (id: string) => void;
  
  // Column actions
  addColumn: (boardId: string, title: string) => void;
  updateColumnTitle: (boardId: string, columnId: string, title: string) => void;
  deleteColumn: (boardId: string, columnId: string) => void;
  moveColumn: (boardId: string, fromIndex: number, toIndex: number) => void;
  
  // Note actions
  addNote: (boardId: string, columnId: string, title: string, color?: NoteColor, dueDate?: string) => void;
  updateNote: (boardId: string, noteId: string, updates: Partial<Note>) => void;
  deleteNote: (boardId: string, noteId: string) => void;
  moveNote: (boardId: string, noteId: string, fromColumnId: string, toColumnId: string, toIndex: number) => void;
  
  // Checklist actions
  addChecklistItem: (boardId: string, noteId: string, text: string, type?: ItemType) => void;
  toggleChecklistItem: (boardId: string, noteId: string, itemId: string) => void;
  updateChecklistItem: (boardId: string, noteId: string, itemId: string, updates: Partial<ChecklistItem>) => void;
  deleteChecklistItem: (boardId: string, noteId: string, itemId: string) => void;
  
  // Helper
  getAllNotes: () => Note[];
  getNotesForDate: (date: string) => Note[];
}

const generateId = () => Math.random().toString(36).substr(2, 9);
const getTodayString = () => new Date().toISOString().split('T')[0];

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
      title: 'Hello! 👋',
      items: [],
      color: 'white',
      columnId: 'welcome',
      createdAt: new Date(),
    },
    note2: {
      id: 'note2',
      title: 'Welcome to Sticky Notes!',
      items: [
        { id: 'i1', text: 'Your visual sticky notes with superpowers', completed: false, type: 'note' },
        { id: 'i2', text: 'All data saves automatically', completed: true, type: 'done' },
        { id: 'i3', text: 'Try out the features!', completed: false, type: 'todo' },
      ],
      color: 'yellow',
      columnId: 'welcome',
      createdAt: new Date(),
      dueDate: getTodayString(),
    },
    note3: {
      id: 'note3',
      title: 'Bullet Journal',
      items: [
        { id: 'i4', text: 'Click the bullet icon to change type', completed: false, type: 'note' },
        { id: 'i5', text: 'This is a todo item', completed: false, type: 'todo' },
        { id: 'i6', text: 'This is in progress', completed: false, type: 'doing' },
        { id: 'i7', text: 'This is completed', completed: true, type: 'done' },
        { id: 'i8', text: 'This is an event', completed: false, type: 'event' },
      ],
      color: 'blue',
      columnId: 'features',
      createdAt: new Date(),
    },
    note4: {
      id: 'note4',
      title: 'Colorful Notes',
      items: [
        { id: 'i9', text: '6 beautiful color options', completed: false, type: 'note' },
        { id: 'i10', text: 'Click the palette icon on any note', completed: false, type: 'todo' },
        { id: 'i11', text: 'Organize visually by color', completed: false, type: 'note' },
      ],
      color: 'pink',
      columnId: 'features',
      createdAt: new Date(),
    },
    note5: {
      id: 'note5',
      title: 'Drag & Drop',
      items: [
        { id: 'i12', text: 'Drag notes between columns', completed: false, type: 'todo' },
        { id: 'i13', text: 'Reorder columns by dragging', completed: false, type: 'todo' },
        { id: 'i14', text: 'Organize your workflow', completed: false, type: 'note' },
      ],
      color: 'orange',
      columnId: 'tips',
      createdAt: new Date(),
    },
    note6: {
      id: 'note6',
      title: 'Focus Mode',
      items: [
        { id: 'i15', text: 'Click the expand icon on any note', completed: false, type: 'todo' },
        { id: 'i16', text: 'Full-screen editing experience', completed: false, type: 'note' },
        { id: 'i17', text: 'Access all features in one place', completed: false, type: 'note' },
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
      currentView: 'boards',
      calendarView: 'daily',
      selectedDate: getTodayString(),

      setSidebarOpen: (open) => set({ sidebarOpen: open }),
      setActiveBoard: (id) => set({ activeBoardId: id, currentView: 'boards' }),
      setCurrentView: (view) => set({ currentView: view }),
      setCalendarView: (view) => set({ calendarView: view }),
      setSelectedDate: (date) => set({ selectedDate: date }),

      createBoard: (title, type) => {
        const newBoard: Board = {
          id: generateId(),
          title,
          type,
          columns: [{ id: generateId(), title: 'Notes', noteIds: [] }],
          notes: {},
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        set((state) => ({
          boards: [...state.boards, newBoard],
          activeBoardId: newBoard.id,
          currentView: 'boards',
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

      addNote: (boardId, columnId, title, color = 'yellow' as NoteColor, dueDate) => {
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
              dueDate,
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

      addChecklistItem: (boardId, noteId, text, type = 'todo') => {
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
                        { id: itemId, text, completed: false, type },
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
                          ? { ...item, completed: !item.completed, type: item.completed ? 'todo' : 'done' }
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

      updateChecklistItem: (boardId, noteId, itemId, updates) => {
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
                        item.id === itemId ? { ...item, ...updates } : item
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

      getAllNotes: () => {
        const { boards } = get();
        return boards.flatMap((board) => Object.values(board.notes));
      },

      getNotesForDate: (date: string) => {
        const { boards } = get();
        const allNotes = boards.flatMap((board) => 
          Object.values(board.notes).map(note => ({ ...note, boardId: board.id, boardTitle: board.title }))
        );
        return allNotes.filter((note) => note.dueDate === date);
      },
    }),
    {
      name: 'sticky-notes-storage',
    }
  )
);
