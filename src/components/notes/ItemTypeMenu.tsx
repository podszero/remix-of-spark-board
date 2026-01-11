import { 
  RiCheckboxBlankLine,
  RiCheckboxLine,
  RiLoader4Line,
  RiCalendarEventLine,
  RiCalendarCheckLine,
  RiSubtractLine,
  RiCloseLine
} from 'react-icons/ri';
import { cn } from '@/lib/utils';
import { ItemType } from '@/types/notes';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface ItemTypeConfig {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  description: string;
  color: string;
}

export const itemTypeConfig: Record<ItemType, ItemTypeConfig> = {
  todo: { 
    icon: RiCheckboxBlankLine, 
    label: 'Todo', 
    description: 'Task to be completed',
    color: 'text-muted-foreground' 
  },
  doing: { 
    icon: RiLoader4Line, 
    label: 'Doing', 
    description: 'Currently in progress',
    color: 'text-amber-500' 
  },
  done: { 
    icon: RiCheckboxLine, 
    label: 'Done', 
    description: 'Completed task',
    color: 'text-emerald-500' 
  },
  event: { 
    icon: RiCalendarEventLine, 
    label: 'Event', 
    description: 'Scheduled occurrence',
    color: 'text-blue-500' 
  },
  note: { 
    icon: RiSubtractLine, 
    label: 'Note', 
    description: 'Information to remember',
    color: 'text-muted-foreground' 
  },
  cancelled: { 
    icon: RiCloseLine, 
    label: 'Cancelled', 
    description: 'No longer relevant',
    color: 'text-muted-foreground' 
  },
};

// Extended types for Event Done
export type ExtendedItemType = ItemType | 'eventDone';

interface ExtendedItemTypeConfig extends ItemTypeConfig {}

export const extendedItemTypeConfig: Record<ExtendedItemType, ExtendedItemTypeConfig> = {
  ...itemTypeConfig,
  eventDone: { 
    icon: RiCalendarCheckLine, 
    label: 'Event Done', 
    description: 'Attended event',
    color: 'text-teal-500' 
  },
};

interface ItemTypeMenuProps {
  type: ItemType;
  onTypeChange: (type: ItemType) => void;
  size?: 'sm' | 'md';
}

export function ItemTypeMenu({ type, onTypeChange, size = 'md' }: ItemTypeMenuProps) {
  const config = itemTypeConfig[type] || itemTypeConfig.todo;
  const Icon = config.icon;

  const iconSize = size === 'sm' ? 'w-4 h-4' : 'w-5 h-5';

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex-shrink-0 touch-manipulation hover:scale-110 transition-transform focus:outline-none">
          <Icon className={cn(iconSize, config.color)} />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        className="w-56 p-2 bg-card shadow-lg border border-border rounded-xl" 
        align="start"
        sideOffset={8}
      >
        <div className="space-y-0.5">
          {Object.entries(extendedItemTypeConfig).map(([key, config]) => {
            const ItemIcon = config.icon;
            const itemType = key === 'eventDone' ? 'done' : key as ItemType;
            const isSelected = type === itemType && (key !== 'eventDone' || type === 'done');
            
            return (
              <button
                key={key}
                onClick={() => onTypeChange(itemType)}
                className={cn(
                  "w-full flex items-center gap-3 p-2.5 rounded-lg transition-colors text-left group",
                  isSelected ? "bg-muted" : "hover:bg-muted/50"
                )}
              >
                <ItemIcon className={cn("w-5 h-5 flex-shrink-0", config.color)} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground">{config.label}</p>
                  <p className="text-xs text-muted-foreground">{config.description}</p>
                </div>
              </button>
            );
          })}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

interface ItemIconProps {
  type: ItemType | undefined;
  className?: string;
}

export function ItemIcon({ type, className }: ItemIconProps) {
  const config = itemTypeConfig[type || 'todo'] || itemTypeConfig.todo;
  const Icon = config.icon;
  return <Icon className={cn("w-4 h-4", config.color, className)} />;
}
