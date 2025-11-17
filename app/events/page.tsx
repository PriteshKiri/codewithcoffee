'use client';

import { useState } from 'react';
import ContentCard from "../components/contentCard";
import eventsData from "../data/events.json";

interface Event {
  title: string;
  subtitle: string;
  image: string;
  link: string;
  year: number;
}

export default function EventsPage() {
  const [activeYear, setActiveYear] = useState<string>('2025');
  const years = Object.keys(eventsData).sort().reverse();

  const scrollToYear = (year: string) => {
    setActiveYear(year);
    const element = document.getElementById(`year-${year}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const getEventCount = (year: string) => {
    return eventsData[year as keyof typeof eventsData]?.length || 0;
  };

  return (
    <div className="flex gap-8">
      {/* Left Sidebar */}
      <aside className="hidden md:block w-32 flex-shrink-0">
        <div className="sticky top-8 space-y-2">
          <h2 className="font-semibold text-sm text-neutral-500 dark:text-neutral-400 mb-4 uppercase tracking-wider">
            Years
          </h2>
          {years.map((year) => (
            <button
              key={year}
              onClick={() => scrollToYear(year)}
              className={`block w-full text-left px-4 py-2 rounded-lg transition-all ${
                activeYear === year
                  ? 'bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 font-semibold'
                  : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800'
              }`}
            >
              {year}
            </button>
          ))}
        </div>
      </aside>

      {/* Mobile Year Selector */}
      <div className="md:hidden w-full mb-6">
        <select
          value={activeYear}
          onChange={(e) => scrollToYear(e.target.value)}
          className="w-full px-4 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100"
        >
          {years.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>

      {/* Right Content Area */}
      <main className="flex-1 min-w-0">
        {years.map((year) => {
          const events = eventsData[year as keyof typeof eventsData];
          const eventCount = getEventCount(year);
          
          return (
            <section key={year} id={`year-${year}`} className="mb-16 scroll-mt-8">
              <h2 className="font-semibold text-xl mb-6 text-neutral-900 dark:text-neutral-100">
                {eventCount} {eventCount === 1 ? 'event' : 'events'} in {year}
              </h2>
              <div className="flex flex-wrap gap-4">
                {events.map((event: Event) => (
                  <ContentCard
                    key={crypto.randomUUID()}
                    title={event.title}
                    subtitle={event.subtitle}
                    image={event.image}
                    link={event.link}
                    from="video"
                  />
                ))}
              </div>
            </section>
          );
        })}
      </main>
    </div>
  );
}
