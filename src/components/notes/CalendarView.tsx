import { useState, useMemo } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar as CalendarIcon, 
  Plus,
  StickyNote as StickyNoteIcon,
  CalendarDays,
  CalendarRange
} from 'lucide-react';
import { format, addDays, subDays, startOfWeek, endOfWeek, eachDayOfInterval, isToday, isSameDay } from 'date-fns';
import { cn } from '@/lib/utils';
import { useNotesStore } from '@/stores/notesStore';
import { Button } from '@/components/ui/button';
import { Note } from '@/types/notes';

interface CalendarNoteCardProps {
  note: Note & { boardId: string; boardTitle: string };
}

function CalendarNoteCard({ note }: CalendarNoteCardProps) {
  const colorClasses: Record<string, string> = {
    yellow: 'bg-note-yellow',
    blue: 'bg-note-blue',
    pink: 'bg-note-pink',
    green: 'bg-note-green',
    orange: 'bg-note-orange',
    white: 'bg-note-white border border-border',
  };

  const completedCount = note.items.filter(i => i.completed).length;
  const totalItems = note.items.length;

  return (
    <div className={cn(
      "rounded-xl p-4 shadow-soft transition-all hover:shadow-note",
      colorClasses[note.color]
    )}>
      <h4 className="font-display font-bold text-base mb-2">{note.title || 'Untitled'}</h4>
      
      <div className="space-y-1.5">
        {note.items.slice(0, 3).map((item) => (
          <div key={item.id} className="flex items-center gap-2 text-sm">
            <div className={cn(
              "w-4 h-4 rounded border flex items-center justify-center flex-shrink-0",
              item.completed ? "bg-primary border-primary text-primary-foreground" : "border-foreground/30"
            )}>
              {item.completed && <span className="text-xs">✓</span>}
            </div>
            <span className={cn(
              "truncate",
              item.completed && "line-through text-foreground/50"
            )}>
              {item.text}
            </span>
          </div>
        ))}
        {note.items.length > 3 && (
          <p className="text-xs text-muted-foreground">+{note.items.length - 3} more items</p>
        )}
      </div>

      <div className="flex items-center justify-between mt-3 pt-2 border-t border-foreground/10">
        <span className="text-xs text-muted-foreground">{note.boardTitle}</span>
        {totalItems > 0 && (
          <span className="text-xs font-medium text-primary">{completedCount}/{totalItems}</span>
        )}
      </div>
    </div>
  );
}

export function CalendarView() {
  const { selectedDate, setSelectedDate, calendarView, setCalendarView, boards } = useNotesStore();
  const currentDate = new Date(selectedDate);

  const getNotesForDate = (date: string) => {
    return boards.flatMap((board) => 
      Object.values(board.notes)
        .filter(note => note.dueDate === date)
        .map(note => ({ ...note, boardId: board.id, boardTitle: board.title }))
    );
  };

  const navigateDate = (direction: 'prev' | 'next') => {
    const newDate = direction === 'prev' 
      ? subDays(currentDate, calendarView === 'weekly' ? 7 : 1)
      : addDays(currentDate, calendarView === 'weekly' ? 7 : 1);
    setSelectedDate(format(newDate, 'yyyy-MM-dd'));
  };

  const goToToday = () => {
    setSelectedDate(format(new Date(), 'yyyy-MM-dd'));
  };

  // Get week days for the date picker
  const weekDays = useMemo(() => {
    const start = startOfWeek(currentDate, { weekStartsOn: 0 });
    return eachDayOfInterval({ start, end: addDays(start, 6) });
  }, [selectedDate]);

  // Get week range for weekly view
  const weekRange = useMemo(() => {
    const start = startOfWeek(currentDate, { weekStartsOn: 0 });
    const end = endOfWeek(currentDate, { weekStartsOn: 0 });
    return eachDayOfInterval({ start, end });
  }, [selectedDate]);

  const notesForSelectedDate = getNotesForDate(selectedDate);

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Header */}
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-4 sm:px-6 py-4 border-b border-border bg-background/95 backdrop-blur-sm">
        <div>
          <h1 className="font-display font-bold text-xl sm:text-2xl text-foreground">
            {calendarView === 'daily' 
              ? format(currentDate, 'MMMM d, yyyy')
              : `Week of ${format(weekRange[0], 'MMM d')}`
            }
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center bg-muted rounded-lg p-1">
            <button
              onClick={() => setCalendarView('daily')}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors",
                calendarView === 'daily' 
                  ? "bg-background text-foreground shadow-sm" 
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <CalendarDays className="w-4 h-4" />
              Day
            </button>
            <button
              onClick={() => setCalendarView('weekly')}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors",
                calendarView === 'weekly' 
                  ? "bg-background text-foreground shadow-sm" 
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <CalendarRange className="w-4 h-4" />
              Week
            </button>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 overflow-auto p-4 sm:p-6">
        {calendarView === 'daily' ? (
          <DailyView 
            currentDate={currentDate}
            selectedDate={selectedDate}
            weekDays={weekDays}
            notesForSelectedDate={notesForSelectedDate}
            onDateSelect={(date) => setSelectedDate(format(date, 'yyyy-MM-dd'))}
            onNavigate={navigateDate}
          />
        ) : (
          <WeeklyView 
            weekRange={weekRange}
            selectedDate={selectedDate}
            getNotesForDate={getNotesForDate}
            onDateSelect={(date) => setSelectedDate(format(date, 'yyyy-MM-dd'))}
            onNavigate={navigateDate}
            onGoToToday={goToToday}
          />
        )}
      </div>
    </div>
  );
}

interface DailyViewProps {
  currentDate: Date;
  selectedDate: string;
  weekDays: Date[];
  notesForSelectedDate: (Note & { boardId: string; boardTitle: string })[];
  onDateSelect: (date: Date) => void;
  onNavigate: (direction: 'prev' | 'next') => void;
}

function DailyView({ currentDate, selectedDate, weekDays, notesForSelectedDate, onDateSelect, onNavigate }: DailyViewProps) {
  return (
    <div className="max-w-3xl mx-auto">
      {/* Week Date Picker */}
      <div className="flex items-center gap-2 mb-6">
        <button
          onClick={() => onNavigate('prev')}
          className="p-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <div className="flex-1 flex justify-center gap-1 sm:gap-2">
          {weekDays.map((day) => {
            const dateStr = format(day, 'yyyy-MM-dd');
            const isSelected = dateStr === selectedDate;
            const isTodayDate = isToday(day);

            return (
              <button
                key={dateStr}
                onClick={() => onDateSelect(day)}
                className={cn(
                  "flex flex-col items-center py-2 px-2 sm:px-4 rounded-xl transition-all",
                  isSelected 
                    ? "bg-foreground text-background" 
                    : isTodayDate 
                      ? "bg-primary/10 text-primary" 
                      : "hover:bg-muted text-muted-foreground hover:text-foreground"
                )}
              >
                <span className="text-[10px] sm:text-xs font-medium uppercase">
                  {format(day, 'EEE')}
                </span>
                <span className={cn(
                  "text-lg sm:text-xl font-bold",
                  isSelected && "text-background"
                )}>
                  {format(day, 'd')}
                </span>
              </button>
            );
          })}
        </div>

        <button
          onClick={() => onNavigate('next')}
          className="p-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Notes Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <StickyNoteIcon className="w-4 h-4 text-primary" />
          </div>
          <h2 className="font-display font-bold text-lg">Notes</h2>
        </div>

        {notesForSelectedDate.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {notesForSelectedDate.map((note) => (
              <CalendarNoteCard key={note.id} note={note} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-muted/30 rounded-2xl">
            <CalendarIcon className="w-12 h-12 mx-auto text-muted-foreground/50 mb-3" />
            <p className="text-muted-foreground mb-1">No notes for this date</p>
            <p className="text-sm text-muted-foreground/70">
              Add a due date to your notes to see them here
            </p>
          </div>
        )}

        {/* Add Note Button */}
        <button className="w-full flex items-center justify-center gap-2 py-4 rounded-xl border-2 border-dashed border-muted hover:border-primary/50 hover:bg-primary/5 text-muted-foreground hover:text-foreground transition-all">
          <Plus className="w-5 h-5" />
          <span className="font-medium">Add note</span>
        </button>
      </div>
    </div>
  );
}

interface WeeklyViewProps {
  weekRange: Date[];
  selectedDate: string;
  getNotesForDate: (date: string) => (Note & { boardId: string; boardTitle: string })[];
  onDateSelect: (date: Date) => void;
  onNavigate: (direction: 'prev' | 'next') => void;
  onGoToToday: () => void;
}

function WeeklyView({ weekRange, selectedDate, getNotesForDate, onDateSelect, onNavigate, onGoToToday }: WeeklyViewProps) {
  return (
    <div>
      {/* Navigation */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => onNavigate('prev')}
          className="p-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        
        <span className="font-medium">
          {format(weekRange[0], 'MMM d')} - {format(weekRange[6], 'd, yyyy')}
        </span>

        <button
          onClick={() => onNavigate('next')}
          className="p-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        <Button variant="outline" size="sm" onClick={onGoToToday}>
          This Week
        </Button>
      </div>

      {/* Week Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {weekRange.map((day) => {
          const dateStr = format(day, 'yyyy-MM-dd');
          const notes = getNotesForDate(dateStr);
          const isTodayDate = isToday(day);
          const isSelected = dateStr === selectedDate;

          return (
            <div 
              key={dateStr}
              className={cn(
                "min-h-[200px] rounded-2xl border p-4 transition-all cursor-pointer hover:shadow-soft",
                isSelected ? "border-primary bg-primary/5" : "border-border",
                isTodayDate && !isSelected && "border-primary/50"
              )}
              onClick={() => onDateSelect(day)}
            >
              {/* Day Header */}
              <div className="flex items-center gap-2 mb-3">
                <div className={cn(
                  "w-10 h-10 rounded-xl flex flex-col items-center justify-center",
                  isTodayDate ? "bg-foreground text-background" : "bg-muted"
                )}>
                  <span className="text-[10px] font-medium uppercase leading-none">
                    {format(day, 'EEE')}
                  </span>
                  <span className="text-lg font-bold leading-none">
                    {format(day, 'd')}
                  </span>
                </div>
                <span className="text-sm text-muted-foreground">
                  {format(day, 'MMM')}
                </span>
              </div>

              {/* Notes */}
              <div className="space-y-2">
                {notes.slice(0, 2).map((note) => (
                  <div
                    key={note.id}
                    className={cn(
                      "rounded-lg p-2 text-sm",
                      note.color === 'white' ? 'bg-muted' : `bg-note-${note.color}`
                    )}
                  >
                    <p className="font-medium truncate">{note.title || 'Untitled'}</p>
                    {note.items.length > 0 && (
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {note.items.filter(i => i.completed).length}/{note.items.length} completed
                      </p>
                    )}
                  </div>
                ))}
                {notes.length > 2 && (
                  <p className="text-xs text-muted-foreground text-center">
                    +{notes.length - 2} more
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
