import { useState, useRef } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { 
  RiDraggable,
  RiMoreFill,
  RiDeleteBinLine,
  RiCalendarLine,
  RiAddLine
} from 'react-icons/ri';
import { cn } from '@/lib/utils';
import { Note, NoteColor, ItemType, TagColor } from '@/types/notes';
import { useNotesStore } from '@/stores/notesStore';
import { ItemTypeMenu, ItemIcon } from './ItemTypeMenu';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { format } from 'date-fns';

interface StickyNoteProps {
  note: Note;
  boardId: string;
  compact?: boolean;
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
  { color: 'white', label: 'White', class: 'bg-white border border-gray-300' },
  { color: 'yellow', label: 'Yellow', class: 'bg-amber-300' },
  { color: 'blue', label: 'Blue', class: 'bg-sky-300' },
  { color: 'pink', label: 'Pink', class: 'bg-pink-300' },
  { color: 'green', label: 'Green', class: 'bg-emerald-300' },
  { color: 'orange', label: 'Orange', class: 'bg-orange-300' },
];

const tagColorClasses: Record<TagColor, string> = {
  red: 'bg-red-100 text-red-700 border-red-200',
  orange: 'bg-orange-100 text-orange-700 border-orange-200',
  yellow: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  green: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  blue: 'bg-blue-100 text-blue-700 border-blue-200',
  purple: 'bg-purple-100 text-purple-700 border-purple-200',
  pink: 'bg-pink-100 text-pink-700 border-pink-200',
  gray: 'bg-gray-100 text-gray-700 border-gray-200',
};

export function StickyNote({ note, boardId, compact }: StickyNoteProps) {
  const [newItemText, setNewItemText] = useState('');
  const [isTouchDevice] = useState(() => 'ontouchstart' in window);
  const inputRef = useRef<HTMLInputElement>(null);
  const { 
    updateNote, 
    deleteNote, 
    addChecklistItem, 
    updateChecklistItem, 
    deleteChecklistItem,
    tags,
    addTagToNote,
    removeTagFromNote
  } = useNotesStore();

  const noteTags = tags.filter(t => note.tagIds?.includes(t.id));
  const availableTags = tags.filter(t => !note.tagIds?.includes(t.id));

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
      addChecklistItem(boardId, note.id, newItemText.trim(), 'todo');
      setNewItemText('');
      inputRef.current?.focus();
    }
  };

  const handleColorChange = (color: NoteColor) => {
    updateNote(boardId, note.id, { color });
  };

  const handleTypeChange = (itemId: string, newType: ItemType) => {
    const completed = newType === 'done';
    updateChecklistItem(boardId, note.id, itemId, { type: newType, completed });
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "group relative rounded-xl shadow-note transition-all duration-200 touch-manipulation",
        colorClasses[note.color],
        isDragging ? "opacity-50 shadow-hover scale-[1.02] z-50" : "hover:shadow-hover",
        compact ? "p-3" : "p-4"
      )}
    >
      {/* Actions Menu */}
      <div className={cn(
        "absolute -top-2 -right-2 flex items-center gap-1 transition-all duration-200 z-10",
        "opacity-0 group-hover:opacity-100",
        isTouchDevice && "opacity-100"
      )}>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="p-1.5 rounded-full bg-card hover:bg-card shadow-md border border-border touch-manipulation">
              <RiMoreFill className="w-4 h-4 text-muted-foreground" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56 bg-card" align="end">
            {/* Color picker */}
            <div className="px-2 py-2">
              <p className="text-xs font-medium text-muted-foreground mb-2">Color</p>
              <div className="flex gap-1.5 flex-wrap">
                {colorOptions.map((option) => (
                  <button
                    key={option.color}
                    onClick={() => handleColorChange(option.color)}
                    className={cn(
                      "w-6 h-6 rounded-full transition-transform hover:scale-110 touch-manipulation",
                      option.class,
                      note.color === option.color && "ring-2 ring-primary ring-offset-1"
                    )}
                  />
                ))}
              </div>
            </div>
            <DropdownMenuSeparator />
            
            {/* Tags */}
            <div className="px-2 py-2">
              <p className="text-xs font-medium text-muted-foreground mb-2">Tags</p>
              <div className="flex flex-wrap gap-1">
                {availableTags.map((tag) => (
                  <button
                    key={tag.id}
                    onClick={() => addTagToNote(boardId, note.id, tag.id)}
                    className={cn(
                      "px-2 py-0.5 rounded-full text-[10px] font-medium border transition-transform hover:scale-105",
                      tagColorClasses[tag.color]
                    )}
                  >
                    + {tag.name}
                  </button>
                ))}
                {availableTags.length === 0 && (
                  <span className="text-xs text-muted-foreground">All tags added</span>
                )}
              </div>
            </div>
            
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer">
              <RiCalendarLine className="w-4 h-4 mr-2" />
              Set due date
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              onClick={() => deleteNote(boardId, note.id)}
              className="text-destructive focus:text-destructive cursor-pointer"
            >
              <RiDeleteBinLine className="w-4 h-4 mr-2" />
              Delete note
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <button
          {...attributes}
          {...listeners}
          className="p-1.5 rounded-full bg-card hover:bg-card shadow-md border border-border cursor-grab active:cursor-grabbing touch-manipulation"
        >
          <RiDraggable className="w-4 h-4 text-muted-foreground" />
        </button>
      </div>

      {/* Tags */}
      {noteTags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-2">
          {noteTags.map(tag => (
            <span 
              key={tag.id}
              onClick={() => removeTagFromNote(boardId, note.id, tag.id)}
              className={cn(
                "px-2 py-0.5 rounded-full text-[10px] font-medium border cursor-pointer hover:opacity-70 transition-opacity",
                tagColorClasses[tag.color]
              )}
            >
              {tag.name} ×
            </span>
          ))}
        </div>
      )}

      {/* Title */}
      <input
        type="text"
        value={note.title}
        onChange={(e) => updateNote(boardId, note.id, { title: e.target.value })}
        className={cn(
          "w-full font-display font-bold bg-transparent border-none outline-none placeholder:text-foreground/40",
          compact ? "text-base mb-2" : "text-lg mb-3"
        )}
        placeholder="Note title..."
      />

      {/* Checklist Items */}
      <div className="space-y-1.5">
        {note.items.map((item) => (
          <div key={item.id} className="flex items-start gap-2 group/item">
            <div className="mt-0.5">
              <ItemTypeMenu 
                type={item.type || 'todo'} 
                onTypeChange={(newType) => handleTypeChange(item.id, newType)}
                size="sm"
              />
            </div>
            <input
              type="text"
              value={item.text}
              onChange={(e) => updateChecklistItem(boardId, note.id, item.id, { text: e.target.value })}
              className={cn(
                "flex-1 bg-transparent border-none outline-none text-sm min-w-0",
                (item.completed || item.type === 'cancelled') && "line-through text-foreground/50"
              )}
            />
            <button
              onClick={() => deleteChecklistItem(boardId, note.id, item.id)}
              className="opacity-0 group-hover/item:opacity-100 focus:opacity-100 text-foreground/40 hover:text-destructive transition-opacity p-1 touch-manipulation"
            >
              <RiDeleteBinLine className="w-3 h-3" />
            </button>
          </div>
        ))}
      </div>

      {/* Add Item */}
      <div className="flex items-center gap-2 mt-2 text-foreground/50">
        <RiAddLine className="w-4 h-4 flex-shrink-0" />
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

      {/* Due Date */}
      {note.dueDate && (
        <div className="flex items-center gap-1.5 mt-3 pt-2 border-t border-foreground/10">
          <RiCalendarLine className="w-3.5 h-3.5 text-muted-foreground" />
          <span className="text-xs text-muted-foreground">
            {format(new Date(note.dueDate), 'MMM d, yyyy')}
          </span>
        </div>
      )}
    </div>
  );
}
