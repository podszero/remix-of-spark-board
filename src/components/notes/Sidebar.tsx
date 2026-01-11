import { useState } from 'react';
import { ChevronLeft, Calendar, LayoutGrid, Plus, Clock, ChevronDown, ChevronRight, X, Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useNotesStore } from '@/stores/notesStore';
import { CreateBoardDialog } from './CreateBoardDialog';
import { format } from 'timeago.js';

interface SidebarProps {
  isMobile?: boolean;
  onClose?: () => void;
}

export function Sidebar({ isMobile, onClose }: SidebarProps) {
  const { boards, activeBoardId, sidebarOpen, setSidebarOpen, setActiveBoard } = useNotesStore();
  const [calendarOpen, setCalendarOpen] = useState(true);
  const [boardsOpen, setBoardsOpen] = useState(true);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredBoards = boards.filter(board => 
    board.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleBoardSelect = (id: string) => {
    setActiveBoard(id);
    if (isMobile && onClose) {
      onClose();
    }
  };

  const handleClose = () => {
    if (isMobile && onClose) {
      onClose();
    } else {
      setSidebarOpen(false);
    }
  };

  return (
    <>
      <aside
        className={cn(
          "h-full bg-sidebar border-r border-sidebar-border flex flex-col transition-all duration-300 ease-in-out",
          isMobile 
            ? "w-full max-w-[300px]" 
            : sidebarOpen ? "w-64" : "w-0 overflow-hidden"
        )}
      >
        {/* Header */}
        <div className="p-4 flex items-center justify-between border-b border-sidebar-border flex-shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-sm flex-shrink-0">
              <span className="text-lg">📝</span>
            </div>
            <div className="min-w-0">
              <h1 className="font-display font-bold text-foreground truncate">Sticky Notes</h1>
              <p className="text-xs text-muted-foreground">Workspace</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-2 rounded-lg hover:bg-sidebar-accent text-muted-foreground hover:text-foreground transition-colors flex-shrink-0"
          >
            {isMobile ? <X className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
          </button>
        </div>

        {/* Search */}
        <div className="p-3 border-b border-sidebar-border flex-shrink-0">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search boards..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm bg-background border border-border rounded-lg outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            />
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-3 space-y-2">
          {/* Calendar Section */}
          <div className="mb-2">
            <button
              onClick={() => setCalendarOpen(!calendarOpen)}
              className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium text-sidebar-foreground hover:bg-sidebar-accent transition-colors"
            >
              <div className="w-6 h-6 rounded-lg bg-primary/10 flex items-center justify-center">
                <Calendar className="w-3.5 h-3.5 text-primary" />
              </div>
              <span className="flex-1 text-left">Calendar</span>
              {calendarOpen ? (
                <ChevronDown className="w-4 h-4 text-muted-foreground" />
              ) : (
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              )}
            </button>
            
            {calendarOpen && (
              <div className="ml-3 mt-1 space-y-0.5 border-l-2 border-border pl-3">
                {[
                  { name: 'Daily', icon: '📅', active: true },
                  { name: 'Weekly', icon: '📆', active: false },
                  { name: 'Monthly', icon: '🗓️', active: false },
                ].map((view) => (
                  <button
                    key={view.name}
                    className={cn(
                      "w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors",
                      view.active 
                        ? "bg-primary/10 text-primary font-medium" 
                        : "text-muted-foreground hover:text-foreground hover:bg-sidebar-accent"
                    )}
                  >
                    <span className="text-base">{view.icon}</span>
                    <span>{view.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Boards Section */}
          <div>
            <button
              onClick={() => setBoardsOpen(!boardsOpen)}
              className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium text-sidebar-foreground hover:bg-sidebar-accent transition-colors"
            >
              <div className="w-6 h-6 rounded-lg bg-blue-500/10 flex items-center justify-center">
                <LayoutGrid className="w-3.5 h-3.5 text-blue-500" />
              </div>
              <span className="flex-1 text-left">Boards</span>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                  {boards.length}
                </span>
                {boardsOpen ? (
                  <ChevronDown className="w-4 h-4 text-muted-foreground" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                )}
              </div>
            </button>

            {boardsOpen && (
              <div className="ml-3 mt-1 space-y-0.5 border-l-2 border-border pl-3">
                {filteredBoards.length === 0 ? (
                  <p className="px-3 py-2 text-sm text-muted-foreground">
                    {searchQuery ? 'No boards found' : 'No boards yet'}
                  </p>
                ) : (
                  filteredBoards.map((board) => (
                    <button
                      key={board.id}
                      onClick={() => handleBoardSelect(board.id)}
                      className={cn(
                        "w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all group",
                        activeBoardId === board.id
                          ? "bg-primary/10 text-primary font-medium"
                          : "text-muted-foreground hover:text-foreground hover:bg-sidebar-accent"
                      )}
                    >
                      <span className="text-base">
                        {board.type === 'kanban' ? '📋' : '📝'}
                      </span>
                      <div className="flex-1 min-w-0 text-left">
                        <p className="truncate">{board.title}</p>
                        <p className="text-xs text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                          {format(board.updatedAt)}
                        </p>
                      </div>
                    </button>
                  ))
                )}
              </div>
            )}

            {/* New Board Button */}
            <button
              onClick={() => setCreateDialogOpen(true)}
              className="w-full flex items-center gap-2 px-3 py-2.5 mt-2 rounded-lg text-sm font-medium text-primary hover:bg-primary/10 transition-colors"
            >
              <div className="w-6 h-6 rounded-lg bg-primary/10 flex items-center justify-center">
                <Plus className="w-4 h-4" />
              </div>
              <span>New board</span>
            </button>
          </div>
        </nav>

        {/* Footer */}
        <div className="p-3 border-t border-sidebar-border flex-shrink-0">
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-muted/50">
            <Clock className="w-4 h-4 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">Auto-saved locally</span>
          </div>
        </div>
      </aside>

      <CreateBoardDialog open={createDialogOpen} onOpenChange={setCreateDialogOpen} />
    </>
  );
}
