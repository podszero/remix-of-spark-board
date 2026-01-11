import { useEffect } from 'react';
import { Menu } from 'lucide-react';
import { Sidebar } from './Sidebar';
import { Board } from './Board';
import { useNotesStore } from '@/stores/notesStore';
import { cn } from '@/lib/utils';

export function NotesApp() {
  const { boards, activeBoardId, sidebarOpen, setSidebarOpen, setActiveBoard } = useNotesStore();

  // Set first board as active if none selected
  useEffect(() => {
    if (!activeBoardId && boards.length > 0) {
      setActiveBoard(boards[0].id);
    }
  }, [activeBoardId, boards, setActiveBoard]);

  const activeBoard = boards.find(b => b.id === activeBoardId);

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="flex items-center gap-4 px-6 py-4 border-b border-border bg-background/80 backdrop-blur-sm">
          {!sidebarOpen && (
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>
          )}

          <h1 className="font-display font-bold text-2xl text-foreground">
            {activeBoard?.title || 'Select a Board'}
          </h1>
        </header>

        {/* Board Content */}
        {activeBoard ? (
          <Board board={activeBoard} />
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-primary/10 flex items-center justify-center">
                <span className="text-3xl">📝</span>
              </div>
              <h2 className="font-display font-bold text-xl text-foreground mb-2">
                No board selected
              </h2>
              <p className="text-muted-foreground">
                Create a new board or select one from the sidebar
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
