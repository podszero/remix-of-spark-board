import { useEffect, useState } from 'react';
import { Menu, Plus, Search, LayoutGrid } from 'lucide-react';
import { Sidebar } from './Sidebar';
import { Board } from './Board';
import { CreateBoardDialog } from './CreateBoardDialog';
import { useNotesStore } from '@/stores/notesStore';
import { cn } from '@/lib/utils';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useIsMobile } from '@/hooks/use-mobile';

export function NotesApp() {
  const { boards, activeBoardId, sidebarOpen, setSidebarOpen, setActiveBoard } = useNotesStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    if (!activeBoardId && boards.length > 0) {
      setActiveBoard(boards[0].id);
    }
  }, [activeBoardId, boards, setActiveBoard]);

  const activeBoard = boards.find(b => b.id === activeBoardId);

  return (
    <div className="flex h-[100dvh] bg-background overflow-hidden">
      {/* Desktop Sidebar */}
      {!isMobile && <Sidebar />}

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* Header */}
        <header className="flex items-center gap-3 px-4 sm:px-6 py-3 sm:py-4 border-b border-border bg-background/95 backdrop-blur-sm sticky top-0 z-20 flex-shrink-0">
          {/* Mobile Menu Button */}
          {isMobile && (
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <button className="p-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors touch-manipulation">
                  <Menu className="w-5 h-5" />
                </button>
              </SheetTrigger>
              <SheetContent side="left" className="p-0 w-[300px]">
                <Sidebar isMobile onClose={() => setMobileMenuOpen(false)} />
              </SheetContent>
            </Sheet>
          )}

          {/* Desktop Sidebar Toggle */}
          {!isMobile && !sidebarOpen && (
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>
          )}

          {/* Title */}
          <div className="flex-1 min-w-0">
            <h1 className="font-display font-bold text-lg sm:text-2xl text-foreground truncate">
              {activeBoard?.title || 'Select a Board'}
            </h1>
            {activeBoard && (
              <p className="text-xs sm:text-sm text-muted-foreground">
                {activeBoard.columns.reduce((acc, col) => acc + col.noteIds.length, 0)} notes · {activeBoard.columns.length} columns
              </p>
            )}
          </div>

          {/* Header Actions */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={() => setCreateDialogOpen(true)}
              className="p-2 sm:px-3 sm:py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors touch-manipulation flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline text-sm font-medium">New Board</span>
            </button>
          </div>
        </header>

        {/* Board Content */}
        {activeBoard ? (
          <Board board={activeBoard} />
        ) : (
          <div className="flex-1 flex items-center justify-center p-6">
            <div className="text-center max-w-sm">
              <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                <LayoutGrid className="w-10 h-10 text-primary" />
              </div>
              <h2 className="font-display font-bold text-xl sm:text-2xl text-foreground mb-3">
                No board selected
              </h2>
              <p className="text-muted-foreground mb-6">
                Create a new board to start organizing your thoughts with visual sticky notes.
              </p>
              <button
                onClick={() => setCreateDialogOpen(true)}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors touch-manipulation"
              >
                <Plus className="w-5 h-5" />
                Create your first board
              </button>
            </div>
          </div>
        )}

        {/* Mobile Quick Add FAB */}
        {isMobile && activeBoard && (
          <button
            onClick={() => {
              const firstColumn = activeBoard.columns[0];
              if (firstColumn) {
                useNotesStore.getState().addNote(activeBoard.id, firstColumn.id, '', 'yellow');
              }
            }}
            className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-primary text-primary-foreground shadow-lg hover:shadow-xl transition-all touch-manipulation flex items-center justify-center z-30"
          >
            <Plus className="w-6 h-6" />
          </button>
        )}
      </main>

      <CreateBoardDialog open={createDialogOpen} onOpenChange={setCreateDialogOpen} />
    </div>
  );
}
