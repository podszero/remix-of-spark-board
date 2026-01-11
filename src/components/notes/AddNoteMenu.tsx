import { useState } from 'react';
import { 
  RiListCheck2, 
  RiText, 
  RiFileTextLine, 
  RiHashtag, 
  RiCheckboxCircleLine 
} from 'react-icons/ri';
import { Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { NoteColor } from '@/types/notes';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export type NoteType = 'checklist' | 'bigtext' | 'richtext' | 'count' | 'donecount';

interface NoteTypeOption {
  type: NoteType;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  description: string;
  color: string;
  bgColor: string;
}

const noteTypeOptions: NoteTypeOption[] = [
  { 
    type: 'checklist', 
    icon: RiListCheck2, 
    label: 'Note', 
    description: 'Checklist, tasks, or bullet points',
    color: 'text-amber-600',
    bgColor: 'bg-amber-50'
  },
  { 
    type: 'bigtext', 
    icon: RiText, 
    label: 'Big Text', 
    description: 'Large text for headers or highlights',
    color: 'text-orange-500',
    bgColor: 'bg-orange-50'
  },
  { 
    type: 'richtext', 
    icon: RiFileTextLine, 
    label: 'Rich Text', 
    description: 'Formatted text with links and lists',
    color: 'text-purple-500',
    bgColor: 'bg-purple-50'
  },
  { 
    type: 'count', 
    icon: RiHashtag, 
    label: 'Count', 
    description: 'Count notes in the board',
    color: 'text-emerald-500',
    bgColor: 'bg-emerald-50'
  },
  { 
    type: 'donecount', 
    icon: RiCheckboxCircleLine, 
    label: 'Done Count', 
    description: 'Count notes marked as done',
    color: 'text-teal-500',
    bgColor: 'bg-teal-50'
  },
];

interface AddNoteMenuProps {
  onAddNote: (type: NoteType, color?: NoteColor) => void;
  className?: string;
}

export function AddNoteMenu({ onAddNote, className }: AddNoteMenuProps) {
  const [open, setOpen] = useState(false);

  const handleSelect = (type: NoteType) => {
    // Map note types to default colors
    const colorMap: Record<NoteType, NoteColor> = {
      checklist: 'yellow',
      bigtext: 'orange',
      richtext: 'white',
      count: 'green',
      donecount: 'blue',
    };
    onAddNote(type, colorMap[type]);
    setOpen(false);
  };

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <button
          className={cn(
            "w-full flex items-center justify-center gap-2 py-4 px-4 rounded-xl",
            "border-2 border-dashed border-muted hover:border-primary/50 hover:bg-primary/5",
            "text-muted-foreground hover:text-foreground transition-all touch-manipulation",
            className
          )}
        >
          <Plus className="w-4 h-4" />
          <span className="text-sm font-medium">Add note</span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        className="w-64 p-2 bg-card shadow-lg border border-border rounded-xl" 
        align="start"
        sideOffset={8}
      >
        <div className="space-y-1">
          {noteTypeOptions.map((option) => {
            const Icon = option.icon;
            return (
              <button
                key={option.type}
                onClick={() => handleSelect(option.type)}
                className="w-full flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors text-left group"
              >
                <div className={cn(
                  "flex items-center justify-center w-8 h-8 rounded-lg flex-shrink-0",
                  option.bgColor
                )}>
                  <Icon className={cn("w-5 h-5", option.color)} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground">{option.label}</p>
                  <p className="text-xs text-muted-foreground leading-snug">{option.description}</p>
                </div>
              </button>
            );
          })}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
