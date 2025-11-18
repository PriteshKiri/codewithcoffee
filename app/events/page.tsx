'use client';

import { useState, useEffect, useRef } from 'react';
import ContentCard from "../components/contentCard";
import CustomDropdown from "../components/customDropdown";
import Footer from "../components/footer";
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
  const observerRef = useRef<IntersectionObserver | null>(null);

  const scrollToYear = (year: string) => {
    setActiveYear(year);
    const element = document.getElementById(`year-${year}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  useEffect(() => {
    // Create an Intersection Observer to track which year section is in view
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const year = entry.target.id.replace('year-', '');
            setActiveYear(year);
          }
        });
      },
      {
        rootMargin: '-20% 0px -70% 0px', // Trigger when section is in the upper portion of viewport
        threshold: 0,
      }
    );

    // Observe all year sections
    years.forEach((year) => {
      const element = document.getElementById(`year-${year}`);
      if (element && observerRef.current) {
        observerRef.current.observe(element);
      }
    });

    // Cleanup
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [years]);

  const getEventCount = (year: string) => {
    return eventsData[year as keyof typeof eventsData]?.length || 0;
  };

  return (
    <>
      <div className="flex flex-col md:flex-row gap-8">
        {/* Mobile Year Selector */}
        <div className="md:hidden w-full mb-6 sticky top-20 z-40 bg-white dark:bg-[#111010] py-4 -mt-4">
          <CustomDropdown
            options={years}
            value={activeYear}
            onChange={scrollToYear}
          />
        </div>

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

        {/* Right Content Area */}
        <main className="flex-1 min-w-0">
          {years.map((year) => {
            const events = eventsData[year as keyof typeof eventsData];
            const eventCount = getEventCount(year);
            
            return (
              <section key={year} id={`year-${year}`} className="mb-16 scroll-mt-8">
                <h2 className="font-semibold text-xl mb-6 text-neutral-900 dark:text-neutral-100 text-center md:text-left">
                  {eventCount} {eventCount === 1 ? 'event' : 'events'} in {year}
                </h2>
                <div className="flex flex-wrap gap-4 justify-center md:justify-start">
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
      <Footer />
    </>
  );
}
