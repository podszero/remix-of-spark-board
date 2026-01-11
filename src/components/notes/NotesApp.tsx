import { useEffect, useState } from 'react';
import { Menu, Plus, LayoutGrid, Calendar } from 'lucide-react';
import { Sidebar } from './Sidebar';
import { Board } from './Board';
import { CalendarView } from './CalendarView';
import { CreateBoardDialog } from './CreateBoardDialog';
import { useNotesStore } from '@/stores/notesStore';
import { cn } from '@/lib/utils';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useIsMobile } from '@/hooks/use-mobile';

export function NotesApp() {
  const { boards, activeBoardId, sidebarOpen, setSidebarOpen, setActiveBoard, currentView } = useNotesStore();
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
        <header className="flex items-center gap-3 px-4 sm:px-6 py-3 border-b border-border bg-background/95 backdrop-blur-sm sticky top-0 z-20 flex-shrink-0">
          {/* Mobile Menu Button */}
          {isMobile && (
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <button className="p-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors touch-manipulation">
                  <Menu className="w-5 h-5" />
                </button>
              </SheetTrigger>
              <SheetContent side="left" className="p-0 w-[280px]">
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
            {currentView === 'boards' && activeBoard ? (
              <>
                <h1 className="font-display font-bold text-lg sm:text-xl text-foreground truncate">
                  {activeBoard.title}
                </h1>
                <p className="text-xs text-muted-foreground">
                  {activeBoard.columns.reduce((acc, col) => acc + col.noteIds.length, 0)} notes · {activeBoard.columns.length} columns
                </p>
              </>
            ) : currentView === 'boards' ? (
              <h1 className="font-display font-bold text-lg sm:text-xl text-foreground">
                Select a Board
              </h1>
            ) : null}
          </div>

          {/* Header Actions */}
          {currentView === 'boards' && (
            <button
              onClick={() => setCreateDialogOpen(true)}
              className="p-2 sm:px-3 sm:py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors touch-manipulation flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline text-sm font-medium">New Board</span>
            </button>
          )}
        </header>

        {/* Content */}
        {currentView === 'calendar' ? (
          <CalendarView />
        ) : activeBoard ? (
          <Board board={activeBoard} />
        ) : (
          <div className="flex-1 flex items-center justify-center p-6">
            <div className="text-center max-w-sm">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                <LayoutGrid className="w-8 h-8 text-primary" />
              </div>
              <h2 className="font-display font-bold text-lg text-foreground mb-2">
                No board selected
              </h2>
              <p className="text-sm text-muted-foreground mb-4">
                Create a new board to start organizing your thoughts.
              </p>
              <button
                onClick={() => setCreateDialogOpen(true)}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Create board
              </button>
            </div>
          </div>
        )}

        {/* Mobile Quick Add FAB */}
        {isMobile && currentView === 'boards' && activeBoard && (
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
