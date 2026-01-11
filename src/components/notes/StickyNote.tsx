import { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Check, Circle, Plus, GripVertical, Palette, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Note, NoteColor } from '@/types/notes';
import { useNotesStore } from '@/stores/notesStore';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface StickyNoteProps {
  note: Note;
  boardId: string;
}

const colorClasses: Record<NoteColor, string> = {
  yellow: 'bg-note-yellow',
  blue: 'bg-note-blue',
  pink: 'bg-note-pink',
  green: 'bg-note-green',
  orange: 'bg-note-orange',
  white: 'bg-note-white border border-border',
};

const colorOptions: { color: NoteColor; label: string; class: string }[] = [
  { color: 'white', label: 'White', class: 'bg-white border border-border' },
  { color: 'yellow', label: 'Yellow', class: 'bg-amber-200' },
  { color: 'blue', label: 'Blue', class: 'bg-sky-200' },
  { color: 'pink', label: 'Pink', class: 'bg-pink-200' },
  { color: 'green', label: 'Green', class: 'bg-emerald-200' },
  { color: 'orange', label: 'Orange', class: 'bg-orange-200' },
];

export function StickyNote({ note, boardId }: StickyNoteProps) {
  const [newItemText, setNewItemText] = useState('');
  const [isHovered, setIsHovered] = useState(false);
  const { updateNote, deleteNote, addChecklistItem, toggleChecklistItem, updateChecklistItem, deleteChecklistItem } = useNotesStore();

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: note.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleAddItem = () => {
    if (newItemText.trim()) {
      addChecklistItem(boardId, note.id, newItemText.trim());
      setNewItemText('');
    }
  };

  const handleColorChange = (color: NoteColor) => {
    updateNote(boardId, note.id, { color });
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "group rounded-xl p-4 shadow-note transition-all duration-200",
        colorClasses[note.color],
        isDragging ? "opacity-50 shadow-hover scale-105" : "hover:shadow-hover"
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Drag Handle & Actions */}
      <div className={cn(
        "absolute -top-1 right-2 flex items-center gap-1 transition-opacity",
        isHovered ? "opacity-100" : "opacity-0"
      )}>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="p-1.5 rounded-md bg-background/80 hover:bg-background shadow-sm">
              <Palette className="w-3.5 h-3.5 text-muted-foreground" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="p-2 bg-card" align="end">
            <div className="flex gap-1.5">
              {colorOptions.map((option) => (
                <button
                  key={option.color}
                  onClick={() => handleColorChange(option.color)}
                  className={cn(
                    "w-6 h-6 rounded-full transition-transform hover:scale-110",
                    option.class,
                    note.color === option.color && "ring-2 ring-primary ring-offset-2"
                  )}
                  title={option.label}
                />
              ))}
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        <button
          onClick={() => deleteNote(boardId, note.id)}
          className="p-1.5 rounded-md bg-background/80 hover:bg-destructive hover:text-destructive-foreground shadow-sm transition-colors"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>

        <button
          {...attributes}
          {...listeners}
          className="p-1.5 rounded-md bg-background/80 hover:bg-background shadow-sm cursor-grab active:cursor-grabbing"
        >
          <GripVertical className="w-3.5 h-3.5 text-muted-foreground" />
        </button>
      </div>

      {/* Title */}
      <input
        type="text"
        value={note.title}
        onChange={(e) => updateNote(boardId, note.id, { title: e.target.value })}
        className="w-full font-display font-bold text-lg bg-transparent border-none outline-none placeholder:text-muted-foreground/50 mb-3"
        placeholder="Note title..."
      />

      {/* Checklist Items */}
      <div className="space-y-1.5">
        {note.items.map((item) => (
          <div key={item.id} className="flex items-start gap-2 group/item">
            <button
              onClick={() => toggleChecklistItem(boardId, note.id, item.id)}
              className={cn(
                "mt-0.5 flex-shrink-0 w-4 h-4 rounded border transition-colors",
                item.completed
                  ? "bg-primary border-primary text-primary-foreground"
                  : "border-muted-foreground/40 hover:border-primary"
              )}
            >
              {item.completed && <Check className="w-3 h-3 m-auto" />}
            </button>
            <input
              type="text"
              value={item.text}
              onChange={(e) => updateChecklistItem(boardId, note.id, item.id, e.target.value)}
              className={cn(
                "flex-1 bg-transparent border-none outline-none text-sm",
                item.completed && "line-through text-muted-foreground"
              )}
            />
            <button
              onClick={() => deleteChecklistItem(boardId, note.id, item.id)}
              className="opacity-0 group-hover/item:opacity-100 text-muted-foreground hover:text-destructive transition-opacity"
            >
              <Trash2 className="w-3 h-3" />
            </button>
          </div>
        ))}
      </div>

      {/* Add Item */}
      <div className="flex items-center gap-2 mt-2 text-muted-foreground">
        <Plus className="w-4 h-4 flex-shrink-0" />
        <input
          type="text"
          value={newItemText}
          onChange={(e) => setNewItemText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAddItem()}
          placeholder="Add item"
          className="flex-1 bg-transparent border-none outline-none text-sm placeholder:text-muted-foreground/50"
        />
      </div>
    </div>
  );
}
