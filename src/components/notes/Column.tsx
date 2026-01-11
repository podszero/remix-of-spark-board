import { useState } from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Plus, MoreHorizontal, Trash2, Edit2 } from 'lucide-react';
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

  return (
    <div className="flex-shrink-0 w-72">
      {/* Column Header */}
      <div className="flex items-center justify-between mb-4 group">
        {isEditing ? (
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={handleTitleSubmit}
            onKeyDown={(e) => e.key === 'Enter' && handleTitleSubmit()}
            className="font-display font-bold text-lg bg-transparent border-none outline-none"
            autoFocus
          />
        ) : (
          <h3 
            className="font-display font-bold text-lg text-foreground cursor-pointer"
            onClick={() => setIsEditing(true)}
          >
            {column.title}
          </h3>
        )}

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="p-1 rounded-md opacity-0 group-hover:opacity-100 hover:bg-muted transition-all">
              <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-card">
            <DropdownMenuItem onClick={() => setIsEditing(true)}>
              <Edit2 className="w-4 h-4 mr-2" />
              Rename
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => deleteColumn(boardId, column.id)}
              className="text-destructive focus:text-destructive"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Notes Container */}
      <div
        ref={setNodeRef}
        className={cn(
          "space-y-3 min-h-[200px] p-2 -m-2 rounded-xl transition-colors",
          isOver && "bg-primary/5"
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
          className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl border-2 border-dashed border-muted hover:border-primary/50 text-muted-foreground hover:text-foreground transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span className="text-sm">Add note</span>
        </button>
      </div>
    </div>
  );
}
