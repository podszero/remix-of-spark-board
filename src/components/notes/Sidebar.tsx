import { useState } from 'react';
import { ChevronLeft, Calendar, LayoutGrid, Plus, Clock, ChevronDown, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useNotesStore } from '@/stores/notesStore';
import { CreateBoardDialog } from './CreateBoardDialog';

export function Sidebar() {
  const { boards, activeBoardId, sidebarOpen, setSidebarOpen, setActiveBoard } = useNotesStore();
  const [calendarOpen, setCalendarOpen] = useState(true);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);

  return (
    <>
      <aside
        className={cn(
          "h-screen bg-sidebar border-r border-sidebar-border flex flex-col transition-all duration-300 ease-in-out",
          sidebarOpen ? "w-64" : "w-0 overflow-hidden"
        )}
      >
        {/* Header */}
        <div className="p-4 flex items-center justify-between border-b border-sidebar-border">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-lg">🍚</span>
            </div>
            <div>
              <h1 className="font-display font-bold text-foreground">Personal</h1>
              <p className="text-xs text-muted-foreground">Workspace</p>
            </div>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="p-1.5 rounded-md hover:bg-sidebar-accent text-muted-foreground hover:text-foreground transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-3 space-y-1">
          {/* Calendar Section */}
          <div className="mb-4">
            <button
              onClick={() => setCalendarOpen(!calendarOpen)}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-sidebar-foreground hover:bg-sidebar-accent transition-colors"
            >
              <Calendar className="w-4 h-4 text-primary" />
              <span>Calendar</span>
              {calendarOpen ? (
                <ChevronDown className="w-4 h-4 ml-auto text-muted-foreground" />
              ) : (
                <ChevronRight className="w-4 h-4 ml-auto text-muted-foreground" />
              )}
            </button>
            
            {calendarOpen && (
              <div className="ml-4 mt-1 space-y-0.5">
                {['Daily', 'Weekly', 'Monthly'].map((view) => (
                  <button
                    key={view}
                    className="w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-sidebar-accent transition-colors"
                  >
                    <div className={cn(
                      "w-4 h-4 rounded flex items-center justify-center text-xs",
                      view === 'Daily' && "bg-primary text-primary-foreground"
                    )}>
                      {view === 'Daily' && '📅'}
                    </div>
                    <span>{view}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Boards Section */}
          <div>
            <div className="flex items-center justify-between px-3 py-2">
              <div className="flex items-center gap-2">
                <LayoutGrid className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium text-sidebar-foreground">Boards</span>
              </div>
              <Clock className="w-4 h-4 text-muted-foreground" />
            </div>

            <div className="space-y-0.5">
              {boards.map((board) => (
                <button
                  key={board.id}
                  onClick={() => setActiveBoard(board.id)}
                  className={cn(
                    "w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors",
                    activeBoardId === board.id
                      ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                      : "text-muted-foreground hover:text-foreground hover:bg-sidebar-accent"
                  )}
                >
                  <div className={cn(
                    "w-5 h-5 rounded flex items-center justify-center text-xs",
                    activeBoardId === board.id ? "bg-primary/20 text-primary" : "bg-muted"
                  )}>
                    {board.type === 'kanban' ? '📋' : '📝'}
                  </div>
                  <span className="truncate">{board.title}</span>
                </button>
              ))}
            </div>

            {/* New Board Button */}
            <button
              onClick={() => setCreateDialogOpen(true)}
              className="w-full flex items-center gap-2 px-3 py-2 mt-1 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-sidebar-accent transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>New board</span>
            </button>
          </div>
        </nav>
      </aside>

      <CreateBoardDialog open={createDialogOpen} onOpenChange={setCreateDialogOpen} />
    </>
  );
}
