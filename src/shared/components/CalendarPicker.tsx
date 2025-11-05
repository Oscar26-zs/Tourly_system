import { useState } from 'react';
import { useTranslation } from 'react-i18next';

type CalendarPickerProps = {
  selected?: Date | undefined;
  onSelect: (date?: Date) => void;
  highlightedDays?: Date[];
};

function startOfMonth(d: Date) { return new Date(d.getFullYear(), d.getMonth(), 1); }
function endOfMonth(d: Date) { return new Date(d.getFullYear(), d.getMonth() + 1, 0); }

export default function CalendarPicker({ selected, onSelect, highlightedDays = [] }: CalendarPickerProps) {
  const { t, i18n } = useTranslation();
  const [view, setView] = useState<Date>(selected || new Date());

  const today = new Date();

  const start = startOfMonth(view);
  const end = endOfMonth(view);

  const days: Date[] = [];
  const firstDayIndex = start.getDay();
  // days before month to fill first week
  for (let i = 0; i < firstDayIndex; i++) days.push(new Date(start.getFullYear(), start.getMonth(), i - firstDayIndex + 1));
  for (let d = 1; d <= end.getDate(); d++) days.push(new Date(start.getFullYear(), start.getMonth(), d));

  const isHighlighted = (d: Date) => highlightedDays.some(h => h && h.toDateString() === d.toDateString());
  const isSameDay = (a?: Date, b?: Date) => !a || !b ? false : a.toDateString() === b.toDateString();

  const locale = i18n.language || undefined;

  // Generate localized short weekday names starting on Sunday
  const weekdayFormatter = new Intl.DateTimeFormat(locale, { weekday: 'short' });
  const baseSunday = new Date(Date.UTC(1970, 0, 4)); // known Sunday
  const weekdayNames = Array.from({ length: 7 }).map((_, i) => weekdayFormatter.format(new Date(baseSunday.getTime() + i * 86400000)));

  return (
    <div className="bg-white/3 p-3 rounded-lg">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <button aria-label={t('calendar.prevMonth')} onClick={() => setView(new Date(view.getFullYear(), view.getMonth() - 1, 1))} className="w-8 h-8 flex items-center justify-center rounded-md bg-white/5 hover:bg-white/7 text-neutral-200">◀</button>
          <div className="text-white font-semibold text-lg">{view.toLocaleString(locale, { month: 'long', year: 'numeric' })}</div>
        </div>
        <div className="flex items-center gap-2">
          <button aria-label={t('calendar.nextMonth')} onClick={() => setView(new Date(view.getFullYear(), view.getMonth() + 1, 1))} className="w-8 h-8 flex items-center justify-center rounded-md bg-white/5 hover:bg-white/7 text-neutral-200">▶</button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center text-sm">
        {weekdayNames.map((d) => (
          <div key={d} className="text-neutral-400 text-xs py-1">{d}</div>
        ))}
        {days.map((d, idx) => {
          const isCurrentMonth = d.getMonth() === view.getMonth();
          const highlighted = isHighlighted(d);
          const todayCls = isSameDay(d, today) ? 'ring-1 ring-white/20' : '';
          const selectedCls = selected && isSameDay(d, selected) ? 'bg-green-600 text-white' : '';
          const faded = !isCurrentMonth ? 'text-neutral-500' : 'text-white';
          const base = `py-2 rounded-full w-9 h-9 inline-flex items-center justify-center ${faded}`;
          const cls = `${base} ${highlighted ? 'bg-green-600 text-white' : ''} ${selectedCls} ${todayCls}`;
          return (
            <button key={idx} onClick={() => onSelect(d)} className={cls} aria-pressed={selected && isSameDay(d, selected)} title={d.toDateString()}>
              <span className="text-sm">{d.getDate()}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
