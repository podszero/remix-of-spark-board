import { useState, useRef, useEffect } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Check, Plus, GripVertical, Palette, Trash2, MoreHorizontal } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Note, NoteColor } from '@/types/notes';
import { useNotesStore } from '@/stores/notesStore';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuSeparator,
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
  { color: 'white', label: 'White', class: 'bg-white border border-gray-200' },
  { color: 'yellow', label: 'Yellow', class: 'bg-amber-300' },
  { color: 'blue', label: 'Blue', class: 'bg-sky-300' },
  { color: 'pink', label: 'Pink', class: 'bg-pink-300' },
  { color: 'green', label: 'Green', class: 'bg-emerald-300' },
  { color: 'orange', label: 'Orange', class: 'bg-orange-300' },
];

export function StickyNote({ note, boardId }: StickyNoteProps) {
  const [newItemText, setNewItemText] = useState('');
  const [isHovered, setIsHovered] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const { updateNote, deleteNote, addChecklistItem, toggleChecklistItem, updateChecklistItem, deleteChecklistItem } = useNotesStore();

  useEffect(() => {
    setIsTouchDevice('ontouchstart' in window);
  }, []);

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
      inputRef.current?.focus();
    }
  };

  const handleColorChange = (color: NoteColor) => {
    updateNote(boardId, note.id, { color });
  };

  const showActions = isHovered || isTouchDevice;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "group relative rounded-xl p-4 shadow-note transition-all duration-200 touch-manipulation",
        colorClasses[note.color],
        isDragging ? "opacity-50 shadow-hover scale-[1.02] z-50" : "hover:shadow-hover"
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Actions Menu - Mobile Friendly */}
      <div className={cn(
        "absolute -top-2 -right-2 flex items-center gap-1 transition-all duration-200 z-10",
        showActions ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-1 pointer-events-none"
      )}>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="p-2 rounded-full bg-card hover:bg-card shadow-md border border-border touch-manipulation">
              <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-48 bg-card" align="end">
            {/* Color Picker */}
            <div className="px-2 py-2">
              <p className="text-xs font-medium text-muted-foreground mb-2">Note Color</p>
              <div className="flex gap-1.5 flex-wrap">
                {colorOptions.map((option) => (
                  <button
                    key={option.color}
                    onClick={() => handleColorChange(option.color)}
                    className={cn(
                      "w-7 h-7 rounded-full transition-transform hover:scale-110 touch-manipulation",
                      option.class,
                      note.color === option.color && "ring-2 ring-primary ring-offset-2"
                    )}
                    title={option.label}
                  />
                ))}
              </div>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              onClick={() => deleteNote(boardId, note.id)}
              className="text-destructive focus:text-destructive cursor-pointer"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete note
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Drag Handle */}
        <button
          {...attributes}
          {...listeners}
          className="p-2 rounded-full bg-card hover:bg-card shadow-md border border-border cursor-grab active:cursor-grabbing touch-manipulation"
        >
          <GripVertical className="w-4 h-4 text-muted-foreground" />
        </button>
      </div>

      {/* Title */}
      <input
        type="text"
        value={note.title}
        onChange={(e) => updateNote(boardId, note.id, { title: e.target.value })}
        className="w-full font-display font-bold text-base sm:text-lg bg-transparent border-none outline-none placeholder:text-foreground/40 mb-3"
        placeholder="Note title..."
      />

      {/* Checklist Items */}
      <div className="space-y-2">
        {note.items.map((item) => (
          <div key={item.id} className="flex items-start gap-2.5 group/item">
            <button
              onClick={() => toggleChecklistItem(boardId, note.id, item.id)}
              className={cn(
                "mt-0.5 flex-shrink-0 w-5 h-5 rounded-md border-2 transition-all touch-manipulation flex items-center justify-center",
                item.completed
                  ? "bg-primary border-primary text-primary-foreground"
                  : "border-foreground/30 hover:border-primary"
              )}
            >
              {item.completed && <Check className="w-3 h-3" />}
            </button>
            <input
              type="text"
              value={item.text}
              onChange={(e) => updateChecklistItem(boardId, note.id, item.id, e.target.value)}
              className={cn(
                "flex-1 bg-transparent border-none outline-none text-sm min-w-0",
                item.completed && "line-through text-foreground/50"
              )}
            />
            <button
              onClick={() => deleteChecklistItem(boardId, note.id, item.id)}
              className="opacity-0 group-hover/item:opacity-100 focus:opacity-100 text-foreground/40 hover:text-destructive transition-opacity p-1 touch-manipulation"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>

      {/* Add Item */}
      <div className="flex items-center gap-2 mt-3 text-foreground/50">
        <Plus className="w-4 h-4 flex-shrink-0" />
        <input
          ref={inputRef}
          type="text"
          value={newItemText}
          onChange={(e) => setNewItemText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAddItem()}
          placeholder="Add item..."
          className="flex-1 bg-transparent border-none outline-none text-sm placeholder:text-foreground/40 min-w-0"
        />
      </div>
    </div>
  );
}
