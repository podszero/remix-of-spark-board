import { useState } from 'react';
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragStartEvent,
} from '@dnd-kit/core';
import { arrayMove, sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { Plus } from 'lucide-react';
import { Board as BoardType } from '@/types/notes';
import { Column } from './Column';
import { StickyNote } from './StickyNote';
import { useNotesStore } from '@/stores/notesStore';
import { Input } from '@/components/ui/input';

interface BoardProps {
  board: BoardType;
}

export function Board({ board }: BoardProps) {
  const [activeNoteId, setActiveNoteId] = useState<string | null>(null);
  const [newColumnTitle, setNewColumnTitle] = useState('');
  const [isAddingColumn, setIsAddingColumn] = useState(false);
  const { addColumn, moveNote } = useNotesStore();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveNoteId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveNoteId(null);

    if (!over) return;

    const activeNote = board.notes[active.id as string];
    if (!activeNote) return;

    const overId = over.id as string;
    const overNote = board.notes[overId];
    
    // Determine target column
    let targetColumnId: string;
    let targetIndex: number;

    if (overNote) {
      // Dropped on another note
      targetColumnId = overNote.columnId;
      const targetColumn = board.columns.find(c => c.id === targetColumnId);
      targetIndex = targetColumn?.noteIds.indexOf(overId) || 0;
    } else {
      // Dropped on a column
      targetColumnId = overId;
      const targetColumn = board.columns.find(c => c.id === targetColumnId);
      targetIndex = targetColumn?.noteIds.length || 0;
    }

    if (activeNote.columnId !== targetColumnId || 
        board.columns.find(c => c.id === activeNote.columnId)?.noteIds.indexOf(active.id as string) !== targetIndex) {
      moveNote(board.id, active.id as string, activeNote.columnId, targetColumnId, targetIndex);
    }
  };

  const handleAddColumn = () => {
    if (newColumnTitle.trim()) {
      addColumn(board.id, newColumnTitle.trim());
      setNewColumnTitle('');
      setIsAddingColumn(false);
    }
  };

  const activeNote = activeNoteId ? board.notes[activeNoteId] : null;

  return (
    <div className="flex-1 overflow-x-auto p-6">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="flex gap-6 min-h-full">
          {board.columns.map((column) => (
            <Column
              key={column.id}
              column={column}
              notes={column.noteIds.map(id => board.notes[id]).filter(Boolean)}
              boardId={board.id}
            />
          ))}

          {/* Add Column */}
          <div className="flex-shrink-0 w-72">
            {isAddingColumn ? (
              <div className="space-y-2">
                <Input
                  placeholder="Column title..."
                  value={newColumnTitle}
                  onChange={(e) => setNewColumnTitle(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleAddColumn();
                    if (e.key === 'Escape') setIsAddingColumn(false);
                  }}
                  onBlur={() => {
                    if (!newColumnTitle.trim()) setIsAddingColumn(false);
                  }}
                  autoFocus
                  className="bg-card"
                />
              </div>
            ) : (
              <button
                onClick={() => setIsAddingColumn(true)}
                className="flex items-center gap-2 px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add Column
              </button>
            )}
          </div>
        </div>

        <DragOverlay>
          {activeNote && (
            <div className="opacity-80 rotate-3">
              <StickyNote note={activeNote} boardId={board.id} />
            </div>
          )}
        </DragOverlay>
      </DndContext>
    </div>
  );
}
