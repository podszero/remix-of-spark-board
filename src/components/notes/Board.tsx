import { useState } from 'react';
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragStartEvent,
} from '@dnd-kit/core';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { Plus } from 'lucide-react';
import { Board as BoardType } from '@/types/notes';
import { Column } from './Column';
import { StickyNote } from './StickyNote';
import { useNotesStore } from '@/stores/notesStore';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

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
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 200,
        tolerance: 8,
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
    
    let targetColumnId: string;
    let targetIndex: number;

    if (overNote) {
      targetColumnId = overNote.columnId;
      const targetColumn = board.columns.find(c => c.id === targetColumnId);
      targetIndex = targetColumn?.noteIds.indexOf(overId) || 0;
    } else {
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
    <div className="flex-1 overflow-x-auto overflow-y-auto">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="flex gap-4 sm:gap-6 min-h-full p-4 sm:p-6 pb-24">
          {board.columns.map((column) => (
            <Column
              key={column.id}
              column={column}
              notes={column.noteIds.map(id => board.notes[id]).filter(Boolean)}
              boardId={board.id}
            />
          ))}

          {/* Add Column */}
          <div className="flex-shrink-0 w-[85vw] sm:w-72 max-w-[300px]">
            {isAddingColumn ? (
              <div className="space-y-3 p-4 bg-card rounded-xl border border-border shadow-soft">
                <Input
                  placeholder="Column title..."
                  value={newColumnTitle}
                  onChange={(e) => setNewColumnTitle(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleAddColumn();
                    if (e.key === 'Escape') setIsAddingColumn(false);
                  }}
                  autoFocus
                  className="bg-background"
                />
                <div className="flex gap-2">
                  <Button onClick={handleAddColumn} size="sm" className="flex-1">
                    Add
                  </Button>
                  <Button 
                    onClick={() => setIsAddingColumn(false)} 
                    size="sm" 
                    variant="ghost"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setIsAddingColumn(true)}
                className="flex items-center gap-2 px-4 py-3 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-xl transition-colors w-full touch-manipulation"
              >
                <Plus className="w-4 h-4" />
                Add Column
              </button>
            )}
          </div>
        </div>

        <DragOverlay>
          {activeNote && (
            <div className="opacity-90 rotate-2 scale-105">
              <StickyNote note={activeNote} boardId={board.id} />
            </div>
          )}
        </DragOverlay>
      </DndContext>
    </div>
  );
}
