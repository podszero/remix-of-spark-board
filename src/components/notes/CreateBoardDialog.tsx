import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { useNotesStore } from '@/stores/notesStore';
import { LayoutGrid, Columns3, Sparkles } from 'lucide-react';

interface CreateBoardDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateBoardDialog({ open, onOpenChange }: CreateBoardDialogProps) {
  const [title, setTitle] = useState('');
  const [type, setType] = useState<'simple' | 'kanban'>('simple');
  const createBoard = useNotesStore((state) => state.createBoard);

  const handleCreate = () => {
    if (title.trim()) {
      createBoard(title.trim(), type);
      setTitle('');
      setType('simple');
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-card mx-4 rounded-2xl">
        <DialogHeader>
          <DialogTitle className="font-display text-xl flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            Create New Board
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Board Type Selection */}
          <div>
            <label className="text-sm font-medium text-foreground mb-3 block">
              Board Type
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setType('simple')}
                className={cn(
                  "flex flex-col items-center gap-3 p-4 rounded-xl border-2 transition-all touch-manipulation",
                  type === 'simple'
                    ? "border-primary bg-primary/5 shadow-sm"
                    : "border-border hover:border-muted-foreground/30 hover:bg-muted/50"
                )}
              >
                <div className={cn(
                  "w-14 h-14 rounded-xl flex items-center justify-center transition-colors",
                  type === 'simple' ? "bg-primary" : "bg-muted"
                )}>
                  <LayoutGrid className={cn(
                    "w-7 h-7",
                    type === 'simple' ? "text-primary-foreground" : "text-muted-foreground"
                  )} />
                </div>
                <div className="text-center">
                  <p className="font-semibold text-sm">Simple</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Chronological order</p>
                </div>
              </button>

              <button
                onClick={() => setType('kanban')}
                className={cn(
                  "flex flex-col items-center gap-3 p-4 rounded-xl border-2 transition-all touch-manipulation",
                  type === 'kanban'
                    ? "border-primary bg-primary/5 shadow-sm"
                    : "border-border hover:border-muted-foreground/30 hover:bg-muted/50"
                )}
              >
                <div className={cn(
                  "w-14 h-14 rounded-xl flex items-center justify-center transition-colors",
                  type === 'kanban' ? "bg-sky-500" : "bg-muted"
                )}>
                  <Columns3 className={cn(
                    "w-7 h-7",
                    type === 'kanban' ? "text-white" : "text-muted-foreground"
                  )} />
                </div>
                <div className="text-center">
                  <p className="font-semibold text-sm">Kanban</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Columns & drag-drop</p>
                </div>
              </button>
            </div>
          </div>

          {/* Title Input */}
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">
              Board Name
            </label>
            <Input
              placeholder="e.g., Project Ideas, Weekly Goals..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
              className="bg-background h-12 text-base"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-2">
          <Button 
            variant="ghost" 
            onClick={() => onOpenChange(false)}
            className="flex-1 h-11"
          >
            Cancel
          </Button>
          <Button 
            onClick={handleCreate} 
            disabled={!title.trim()}
            className="flex-1 h-11"
          >
            Create Board
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
