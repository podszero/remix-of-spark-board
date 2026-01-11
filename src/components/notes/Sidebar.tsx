import { useState } from 'react';
import { 
  ChevronLeft, 
  Calendar, 
  LayoutGrid, 
  Plus, 
  Clock, 
  ChevronDown, 
  ChevronRight, 
  X, 
  Search,
  CalendarDays,
  CalendarRange,
  Grid3X3,
  Tag,
  StickyNote
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useNotesStore } from '@/stores/notesStore';
import { CreateBoardDialog } from './CreateBoardDialog';
import { TagColor } from '@/types/notes';

interface SidebarProps {
  isMobile?: boolean;
  onClose?: () => void;
}

const tagDotClasses: Record<TagColor, string> = {
  red: 'bg-red-500',
  orange: 'bg-orange-500',
  yellow: 'bg-yellow-500',
  green: 'bg-emerald-500',
  blue: 'bg-blue-500',
  purple: 'bg-purple-500',
  pink: 'bg-pink-500',
  gray: 'bg-gray-500',
};

export function Sidebar({ isMobile, onClose }: SidebarProps) {
  const { 
    boards, 
    activeBoardId, 
    sidebarOpen, 
    setSidebarOpen, 
    setActiveBoard,
    currentView,
    setCurrentView,
    calendarView,
    setCalendarView,
    tags,
    activeTagFilter,
    setActiveTagFilter
  } = useNotesStore();
  const [calendarOpen, setCalendarOpen] = useState(true);
  const [boardsOpen, setBoardsOpen] = useState(true);
  const [tagsOpen, setTagsOpen] = useState(true);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredBoards = boards.filter(board => 
    board.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleBoardSelect = (id: string) => {
    setActiveBoard(id);
    setActiveTagFilter(null);
    if (isMobile && onClose) {
      onClose();
    }
  };

  const handleCalendarSelect = (view: 'daily' | 'weekly' | 'monthly') => {
    setCalendarView(view);
    setCurrentView('calendar');
    setActiveTagFilter(null);
    if (isMobile && onClose) {
      onClose();
    }
  };

  const handleTagFilter = (tagId: string | null) => {
    setActiveTagFilter(tagId === activeTagFilter ? null : tagId);
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
            ? "w-full max-w-[280px]" 
            : sidebarOpen ? "w-60" : "w-0 overflow-hidden"
        )}
      >
        {/* Header */}
        <div className="p-3 flex items-center justify-between border-b border-sidebar-border flex-shrink-0">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-amber-400 flex items-center justify-center shadow-sm flex-shrink-0">
              <StickyNote className="w-4 h-4 text-white" />
            </div>
            <div className="min-w-0">
              <h1 className="font-display font-bold text-sm text-foreground truncate">Sticky Notes</h1>
              <p className="text-[10px] text-muted-foreground">Workspace</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-1.5 rounded-md hover:bg-sidebar-accent text-muted-foreground hover:text-foreground transition-colors flex-shrink-0"
          >
            {isMobile ? <X className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Search */}
        <div className="p-2 border-b border-sidebar-border flex-shrink-0">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-sm bg-background border border-border rounded-lg outline-none focus:ring-1 focus:ring-primary/30 focus:border-primary transition-all"
            />
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-2 space-y-1">
          {/* Calendar Section */}
          <div className="mb-1">
            <button
              onClick={() => setCalendarOpen(!calendarOpen)}
              className="w-full flex items-center gap-2 px-2.5 py-2 rounded-lg text-sm font-medium text-sidebar-foreground hover:bg-sidebar-accent transition-colors"
            >
              <div className="w-6 h-6 rounded-md bg-primary/10 flex items-center justify-center">
                <Calendar className="w-3.5 h-3.5 text-primary" />
              </div>
              <span className="flex-1 text-left text-sm">Calendar</span>
              {calendarOpen ? (
                <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
              ) : (
                <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />
              )}
            </button>
            
            {calendarOpen && (
              <div className="ml-2 mt-0.5 space-y-0.5 border-l-2 border-border pl-2">
                {[
                  { name: 'Daily', icon: CalendarDays, view: 'daily' as const },
                  { name: 'Weekly', icon: CalendarRange, view: 'weekly' as const },
                  { name: 'Monthly', icon: Grid3X3, view: 'monthly' as const },
                ].map((item) => {
                  const isActive = currentView === 'calendar' && calendarView === item.view;
                  return (
                    <button
                      key={item.name}
                      onClick={() => handleCalendarSelect(item.view)}
                      className={cn(
                        "w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-sm transition-colors",
                        isActive 
                          ? "bg-primary/10 text-primary font-medium" 
                          : "text-muted-foreground hover:text-foreground hover:bg-sidebar-accent"
                      )}
                    >
                      <item.icon className="w-3.5 h-3.5" />
                      <span>{item.name}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Tags Section */}
          <div className="mb-1">
            <button
              onClick={() => setTagsOpen(!tagsOpen)}
              className="w-full flex items-center gap-2 px-2.5 py-2 rounded-lg text-sm font-medium text-sidebar-foreground hover:bg-sidebar-accent transition-colors"
            >
              <div className="w-6 h-6 rounded-md bg-purple-500/10 flex items-center justify-center">
                <Tag className="w-3.5 h-3.5 text-purple-500" />
              </div>
              <span className="flex-1 text-left text-sm">Tags</span>
              <span className="text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                {tags.length}
              </span>
              {tagsOpen ? (
                <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
              ) : (
                <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />
              )}
            </button>

            {tagsOpen && (
              <div className="ml-2 mt-0.5 space-y-0.5 border-l-2 border-border pl-2">
                {tags.map((tag) => (
                  <button
                    key={tag.id}
                    onClick={() => handleTagFilter(tag.id)}
                    className={cn(
                      "w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-sm transition-all",
                      activeTagFilter === tag.id
                        ? "bg-primary/10 text-primary font-medium"
                        : "text-muted-foreground hover:text-foreground hover:bg-sidebar-accent"
                    )}
                  >
                    <div className={cn("w-2.5 h-2.5 rounded-full", tagDotClasses[tag.color])} />
                    <span>{tag.name}</span>
                  </button>
                ))}
                {activeTagFilter && (
                  <button
                    onClick={() => setActiveTagFilter(null)}
                    className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-sidebar-accent"
                  >
                    <X className="w-3.5 h-3.5" />
                    <span>Clear filter</span>
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Boards Section */}
          <div>
            <button
              onClick={() => setBoardsOpen(!boardsOpen)}
              className="w-full flex items-center gap-2 px-2.5 py-2 rounded-lg text-sm font-medium text-sidebar-foreground hover:bg-sidebar-accent transition-colors"
            >
              <div className="w-6 h-6 rounded-md bg-blue-500/10 flex items-center justify-center">
                <LayoutGrid className="w-3.5 h-3.5 text-blue-500" />
              </div>
              <span className="flex-1 text-left text-sm">Boards</span>
              <span className="text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                {boards.length}
              </span>
              {boardsOpen ? (
                <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
              ) : (
                <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />
              )}
            </button>

            {boardsOpen && (
              <div className="ml-2 mt-0.5 space-y-0.5 border-l-2 border-border pl-2">
                {filteredBoards.length === 0 ? (
                  <p className="px-2.5 py-1.5 text-xs text-muted-foreground">
                    {searchQuery ? 'No boards found' : 'No boards yet'}
                  </p>
                ) : (
                  filteredBoards.map((board) => {
                    const isActive = currentView === 'boards' && activeBoardId === board.id;
                    return (
                      <button
                        key={board.id}
                        onClick={() => handleBoardSelect(board.id)}
                        className={cn(
                          "w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-sm transition-all",
                          isActive
                            ? "bg-primary/10 text-primary font-medium"
                            : "text-muted-foreground hover:text-foreground hover:bg-sidebar-accent"
                        )}
                      >
                        <span className="text-sm flex-shrink-0">
                          {board.type === 'kanban' ? '📋' : '📝'}
                        </span>
                        <span className="truncate">{board.title}</span>
                      </button>
                    );
                  })
                )}
              </div>
            )}

            <button
              onClick={() => setCreateDialogOpen(true)}
              className="w-full flex items-center gap-2 px-2.5 py-2 mt-1 rounded-lg text-sm font-medium text-primary hover:bg-primary/10 transition-colors"
            >
              <div className="w-6 h-6 rounded-md bg-primary/10 flex items-center justify-center">
                <Plus className="w-3.5 h-3.5" />
              </div>
              <span>New board</span>
            </button>
          </div>
        </nav>

        {/* Footer */}
        <div className="p-2 border-t border-sidebar-border flex-shrink-0">
          <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-muted/50">
            <Clock className="w-3.5 h-3.5 text-muted-foreground" />
            <span className="text-[10px] text-muted-foreground">Auto-saved locally</span>
          </div>
        </div>
      </aside>

      <CreateBoardDialog open={createDialogOpen} onOpenChange={setCreateDialogOpen} />
    </>
  );
}
