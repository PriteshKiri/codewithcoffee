'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import ContentCard from "../components/contentCard";
import CustomDropdown, { DropdownOption } from "../components/customDropdown";
import Footer from "../components/footer";
import {
  useInitialYearScroll,
  useQueryParamState,
  writeQueryParam,
} from "../hooks/useQueryParamState";
import eventsData from "../data/events.json";

interface Event {
  title: string;
  subtitle: string;
  image: string;
  post?: string;
  blog?: string;
  video?: string;
  badge?: string;
  category?: string;
  year: number;
}

const ALL_CATEGORIES = 'All';
const CATEGORY_ORDER = ['ReactPlay', 'Harness', 'Emcee'];

export default function EventsPage() {
  const years = Object.keys(eventsData).sort().reverse();
  const observerRef = useRef<IntersectionObserver | null>(null);

  const allEvents = useMemo(() => {
    const list: (Event & { _year: string })[] = [];
    years.forEach((year) => {
      const events = (eventsData[year as keyof typeof eventsData] as Event[]) || [];
      events.forEach((e) => list.push({ ...e, _year: year }));
    });
    return list;
  }, [years]);

  const [selectedCategory, setSelectedCategory] = useQueryParamState(
    'category',
    ALL_CATEGORIES,
    [ALL_CATEGORIES, ...CATEGORY_ORDER]
  );
  const [activeYear, setActiveYear] = useState<string>(years[0]);

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { [ALL_CATEGORIES]: allEvents.length };
    CATEGORY_ORDER.forEach((cat) => {
      counts[cat] = 0;
    });
    allEvents.forEach((e) => {
      if (e.category && counts[e.category] !== undefined) {
        counts[e.category] += 1;
      }
    });
    return counts;
  }, [allEvents]);

  const categoryOptions: DropdownOption[] = useMemo(
    () => [
      { value: ALL_CATEGORIES, label: ALL_CATEGORIES, count: categoryCounts[ALL_CATEGORIES] || 0 },
      ...CATEGORY_ORDER.map((cat) => ({
        value: cat,
        label: cat,
        count: categoryCounts[cat] || 0,
      })),
    ],
    [categoryCounts]
  );

  const filteredEventsByYear = useMemo(() => {
    const result: Record<string, Event[]> = {};
    years.forEach((year) => {
      const events = (eventsData[year as keyof typeof eventsData] as Event[]) || [];
      result[year] = events.filter(
        (e) => selectedCategory === ALL_CATEGORIES || e.category === selectedCategory
      );
    });
    return result;
  }, [selectedCategory, years]);

  const visibleYears = useMemo(
    () => years.filter((year) => (filteredEventsByYear[year]?.length || 0) > 0),
    [years, filteredEventsByYear]
  );

  const yearOptions: DropdownOption[] = useMemo(
    () =>
      visibleYears.map((year) => ({
        value: year,
        label: year,
        count: filteredEventsByYear[year]?.length || 0,
      })),
    [visibleYears, filteredEventsByYear]
  );

  const scrollToYear = (year: string) => {
    setActiveYear(year);
    writeQueryParam('year', year, visibleYears[0]);
    const element = document.getElementById(`year-${year}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  useInitialYearScroll(visibleYears, setActiveYear);

  useEffect(() => {
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
        rootMargin: '-20% 0px -70% 0px',
        threshold: 0,
      }
    );

    visibleYears.forEach((year) => {
      const element = document.getElementById(`year-${year}`);
      if (element && observerRef.current) {
        observerRef.current.observe(element);
      }
    });

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [visibleYears]);

  useEffect(() => {
    if (visibleYears.length > 0 && !visibleYears.includes(activeYear)) {
      setActiveYear(visibleYears[0]);
    }
  }, [visibleYears, activeYear]);

  const getEventCount = (year: string) => filteredEventsByYear[year]?.length || 0;

  const categorySuffix =
    selectedCategory === ALL_CATEGORIES ? '' : ` · ${selectedCategory}`;

  return (
    <>
      <div className="flex flex-col md:flex-row gap-8">
        {/* Mobile Filters */}
        <div className="md:hidden w-full mb-6 sticky top-20 z-40 bg-white dark:bg-[#111010] py-4 -mt-4 space-y-3">
          <div>
            <label className="block text-xs font-semibold text-neutral-500 dark:text-neutral-400 mb-1 uppercase tracking-wider">
              Category
            </label>
            <CustomDropdown
              options={categoryOptions}
              value={selectedCategory}
              onChange={setSelectedCategory}
            />
          </div>
          {visibleYears.length > 0 && (
            <div>
              <label className="block text-xs font-semibold text-neutral-500 dark:text-neutral-400 mb-1 uppercase tracking-wider">
                Year
              </label>
              <CustomDropdown
                options={yearOptions}
                value={visibleYears.includes(activeYear) ? activeYear : visibleYears[0]}
                onChange={scrollToYear}
              />
            </div>
          )}
        </div>

        {/* Left Sidebar */}
        <aside className="hidden md:block w-44 flex-shrink-0">
          <div className="sticky top-8 space-y-6">
            <div>
              <h2 className="font-semibold text-sm text-neutral-500 dark:text-neutral-400 mb-3 uppercase tracking-wider">
                Category
              </h2>
              <CustomDropdown
                options={categoryOptions}
                value={selectedCategory}
                onChange={setSelectedCategory}
              />
            </div>

            <div>
              <h2 className="font-semibold text-sm text-neutral-500 dark:text-neutral-400 mb-3 uppercase tracking-wider">
                Years
              </h2>
              <div className="space-y-2">
                {visibleYears.length === 0 ? (
                  <p className="text-sm text-neutral-500 dark:text-neutral-400 px-2">
                    No years
                  </p>
                ) : (
                  visibleYears.map((year) => {
                    const count = filteredEventsByYear[year]?.length || 0;
                    const isActive = activeYear === year;
                    return (
                      <button
                        key={year}
                        onClick={() => scrollToYear(year)}
                        className={`flex w-full items-center justify-between text-left px-4 py-2 rounded-lg transition-all ${
                          isActive
                            ? 'bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 font-semibold'
                            : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800'
                        }`}
                      >
                        <span>{year}</span>
                        <span
                          className={`text-xs font-normal ${
                            isActive
                              ? 'text-white/80 dark:text-neutral-900/70'
                              : 'text-neutral-500 dark:text-neutral-400'
                          }`}
                        >
                          {count}
                        </span>
                      </button>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        </aside>

        {/* Right Content Area */}
        <main className="flex-1 min-w-0">
          {visibleYears.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <p className="text-lg font-medium text-neutral-700 dark:text-neutral-200 mb-2">
                No events found
              </p>
              <p className="text-sm text-neutral-500 dark:text-neutral-400">
                Try a different category.
              </p>
            </div>
          ) : (
            visibleYears.map((year) => {
              const events = filteredEventsByYear[year];
              const eventCount = getEventCount(year);

              return (
                <section key={year} id={`year-${year}`} className="mb-16 scroll-mt-8">
                  <h2 className="font-semibold text-xl mb-6 text-neutral-900 dark:text-neutral-100 text-center md:text-left">
                    {eventCount} {eventCount === 1 ? 'event' : 'events'} in {year}
                    {categorySuffix && (
                      <span className="text-neutral-500 dark:text-neutral-400 font-normal">
                        {categorySuffix}
                      </span>
                    )}
                  </h2>
                  <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                    {events.map((event: Event) => (
                      <ContentCard
                        key={crypto.randomUUID()}
                        title={event.title}
                        subtitle={event.subtitle}
                        image={event.image}
                        post={event.post}
                        blog={event.blog}
                        video={event.video}
                        badge={event.badge}
                        from="video"
                      />
                    ))}
                  </div>
                </section>
              );
            })
          )}
        </main>
      </div>
      <Footer />
    </>
  );
}
