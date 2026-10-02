import { NgClass } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-home',
  imports: [TranslatePipe, NgClass],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  protected data = signal<any[]>([
    {
      id: 1,
      title: 'something 1',
    },
    {
      id: 2,
      title: 'something 2',
    },
    {
      id: 3,
      title: 'something 3',
    },
    {
      id: 4,
      title: 'something 4',
    },
  ]);

  protected start = signal(0);
  protected readonly perView = 3;

  protected visible = computed(() => this.data().slice(this.start(), this.start() + this.perView));

  protected canPrev = computed(() => this.start() > 0);
  protected canNext = computed(() => this.start() + this.perView < this.data().length);

  protected next() {
    if (this.canNext()) this.start.update((s) => s + 1);
  }

  protected prev() {
    if (this.canPrev()) this.start.update((s) => s - 1);
  }

  readonly months = [
    'JANUARY',
    'FEBRUARY',
    'MARCH',
    'APRIL',
    'MAY',
    'JUNE',
    'JULY',
    'AUGUST',
    'SEPTEMBER',
    'OCTOBER',
    'NOVEMBER',
    'DECEMBER',
  ];
  // Monday-first
  readonly weekdays = signal([
    'MONDAY',
    'TUESDAY',
    'WEDNESDAY',
    'THURSDAY',
    'FRIDAY',
    'SATURDAY',
    'SUNDAY',
  ]);

  year = signal(2026);
  month = signal(9);
  selected = signal<Date | null>(null);

  monthName = computed(() => this.months[this.month()]);

  protected activeFestivals = signal([
    {
      id: 1,
      day: 24,
      title: 'something',
    },
  ]);

  cells = computed<Cell[]>(() => {
    const y = this.year();
    const m = this.month();
    const offset = (new Date(y, m, 1).getDay() + 6) % 7; // Mon = 0
    const total = new Date(y, m + 1, 0).getDate();
    const out: Cell[] = Array.from({ length: offset }, () => ({ day: null, date: null }));
    for (let d = 1; d <= total; d++) out.push({ day: d, date: new Date(y, m, d) });
    return out;
  });

  isSelected(c: Cell): boolean {
    const s = this.selected();
    return !!c.date && !!s && c.date.toDateString() === s.toDateString();
  }

  select(c: Cell): void {
    if (c.date) this.selected.set(c.date);
  }

  shift(delta: number): void {
    const d = new Date(this.year(), this.month() + delta, 1);
    this.year.set(d.getFullYear());
    this.month.set(d.getMonth());
  }

  isFestival(c: Cell): boolean {
    if (!c.date) return false;

    return this.activeFestivals().some((festival) => festival.day === c.date!.getDate());
  }
}

interface Cell {
  day: number | null;
  date: Date | null;
}
