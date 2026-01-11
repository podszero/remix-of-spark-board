import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { useNotesStore } from '@/stores/notesStore';
import { LayoutGrid, Columns3 } from 'lucide-react';

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
      <DialogContent className="sm:max-w-md bg-card">
        <DialogHeader>
          <DialogTitle className="font-display text-xl">Create New Board</DialogTitle>
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
                  "flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all",
                  type === 'simple'
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-muted-foreground/30"
                )}
              >
                <div className={cn(
                  "w-12 h-12 rounded-lg flex items-center justify-center",
                  type === 'simple' ? "bg-primary" : "bg-muted"
                )}>
                  <LayoutGrid className={cn(
                    "w-6 h-6",
                    type === 'simple' ? "text-primary-foreground" : "text-muted-foreground"
                  )} />
                </div>
                <div className="text-center">
                  <p className="font-medium text-sm">Simple</p>
                  <p className="text-xs text-muted-foreground">Notes in chronological order</p>
                </div>
              </button>

              <button
                onClick={() => setType('kanban')}
                className={cn(
                  "flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all",
                  type === 'kanban'
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-muted-foreground/30"
                )}
              >
                <div className={cn(
                  "w-12 h-12 rounded-lg flex items-center justify-center",
                  type === 'kanban' ? "bg-sky-500" : "bg-muted"
                )}>
                  <Columns3 className={cn(
                    "w-6 h-6",
                    type === 'kanban' ? "text-white" : "text-muted-foreground"
                  )} />
                </div>
                <div className="text-center">
                  <p className="font-medium text-sm">Kanban</p>
                  <p className="text-xs text-muted-foreground">Organize notes in columns with drag & drop</p>
                </div>
              </button>
            </div>
          </div>

          {/* Title Input */}
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">
              Title
            </label>
            <Input
              placeholder="Board name"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
              className="bg-background"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3">
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleCreate} disabled={!title.trim()}>
            Create
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
