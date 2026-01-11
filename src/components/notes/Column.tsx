import { useState } from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Plus, MoreHorizontal, Trash2, Edit2, GripVertical } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Column as ColumnType, Note } from '@/types/notes';
import { StickyNote } from './StickyNote';
import { useNotesStore } from '@/stores/notesStore';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface ColumnProps {
  column: ColumnType;
  notes: Note[];
  boardId: string;
}

export function Column({ column, notes, boardId }: ColumnProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(column.title);
  const { addNote, updateColumnTitle, deleteColumn } = useNotesStore();

  const { setNodeRef, isOver } = useDroppable({
    id: column.id,
  });

  const handleTitleSubmit = () => {
    if (title.trim()) {
      updateColumnTitle(boardId, column.id, title.trim());
    } else {
      setTitle(column.title);
    }
    setIsEditing(false);
  };

  const handleAddNote = () => {
    addNote(boardId, column.id, '', 'yellow');
  };

  const completedCount = notes.reduce((acc, note) => 
    acc + note.items.filter(item => item.completed).length, 0
  );
  const totalItems = notes.reduce((acc, note) => acc + note.items.length, 0);

  return (
    <div className="flex-shrink-0 w-[85vw] sm:w-72 max-w-[300px]">
      {/* Column Header */}
      <div className="flex items-center justify-between mb-4 group sticky top-0 bg-background/80 backdrop-blur-sm py-2 -my-2 z-10">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          {isEditing ? (
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onBlur={handleTitleSubmit}
              onKeyDown={(e) => e.key === 'Enter' && handleTitleSubmit()}
              className="font-display font-bold text-lg bg-transparent border-none outline-none w-full"
              autoFocus
            />
          ) : (
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <h3 
                className="font-display font-bold text-lg text-foreground cursor-pointer truncate"
                onClick={() => setIsEditing(true)}
              >
                {column.title}
              </h3>
              <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full flex-shrink-0">
                {notes.length}
              </span>
              {totalItems > 0 && (
                <span className="text-xs text-primary bg-primary/10 px-2 py-0.5 rounded-full flex-shrink-0">
                  {completedCount}/{totalItems}
                </span>
              )}
            </div>
          )}
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="p-2 rounded-lg opacity-60 hover:opacity-100 hover:bg-muted transition-all touch-manipulation">
              <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-card w-44">
            <DropdownMenuItem onClick={() => setIsEditing(true)} className="cursor-pointer">
              <Edit2 className="w-4 h-4 mr-2" />
              Rename
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => deleteColumn(boardId, column.id)}
              className="text-destructive focus:text-destructive cursor-pointer"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete column
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Notes Container */}
      <div
        ref={setNodeRef}
        className={cn(
          "space-y-3 min-h-[150px] p-2 -m-2 rounded-xl transition-colors",
          isOver && "bg-primary/5 ring-2 ring-primary/20 ring-dashed"
        )}
      >
        <SortableContext items={notes.map(n => n.id)} strategy={verticalListSortingStrategy}>
          {notes.map((note) => (
            <StickyNote key={note.id} note={note} boardId={boardId} />
          ))}
        </SortableContext>

        {/* Add Note Button */}
        <button
          onClick={handleAddNote}
          className="w-full flex items-center justify-center gap-2 py-4 px-4 rounded-xl border-2 border-dashed border-muted hover:border-primary/50 hover:bg-primary/5 text-muted-foreground hover:text-foreground transition-all touch-manipulation"
        >
          <Plus className="w-4 h-4" />
          <span className="text-sm font-medium">Add note</span>
        </button>
      </div>
    </div>
  );
}
