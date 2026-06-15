'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import ContentCard from "../components/contentCard";
import CustomDropdown, { DropdownOption } from "../components/customDropdown";
import Footer from "../components/footer";
import { useInitialYearScroll, writeQueryParam } from "../hooks/useQueryParamState";
import talksData from "../data/talks.json";

interface Talk {
  title: string;
  subtitle: string;
  image: string;
  post?: string;
  blog?: string;
  video?: string;
  year: number;
}

export default function TalksPage() {
  const years = useMemo(() => Object.keys(talksData).sort().reverse(), []);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const talksByYear = useMemo(() => {
    const result: Record<string, Talk[]> = {};
    years.forEach((year) => {
      result[year] = (talksData[year as keyof typeof talksData] as Talk[]) || [];
    });
    return result;
  }, [years]);

  const [activeYear, setActiveYear] = useState<string>(years[0]);

  const yearOptions: DropdownOption[] = useMemo(
    () =>
      years.map((year) => ({
        value: year,
        label: year,
        count: talksByYear[year]?.length || 0,
      })),
    [years, talksByYear]
  );

  const scrollToYear = (year: string) => {
    setActiveYear(year);
    writeQueryParam('year', year, years[0]);
    const element = document.getElementById(`year-${year}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  useInitialYearScroll(years, setActiveYear);

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

    years.forEach((year) => {
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
  }, [years]);

  return (
    <>
      <section className="mb-8">
        <h1 className="font-medium text-2xl mb-8 tracking-tighter">
          my talks
        </h1>
        <p className="prose prose-neutral dark:prose-invert">
          I love speaking at conferences and meetups about CNCF, chaos engineering, frontend development, React, AI, MCP servers, and community building. Here are some of my talks where I share my knowledge and experiences with the tech community.
        </p>
      </section>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Mobile Year Dropdown */}
        <div className="md:hidden w-full mb-2 sticky top-20 z-40 bg-white dark:bg-[#111010] py-4 -mt-4">
          <label className="block text-xs font-semibold text-neutral-500 dark:text-neutral-400 mb-1 uppercase tracking-wider">
            Year
          </label>
          <CustomDropdown
            options={yearOptions}
            value={activeYear}
            onChange={scrollToYear}
          />
        </div>

        {/* Left Sidebar */}
        <aside className="hidden md:block w-44 flex-shrink-0">
          <div className="sticky top-8 space-y-6">
            <div>
              <h2 className="font-semibold text-sm text-neutral-500 dark:text-neutral-400 mb-3 uppercase tracking-wider">
                Years
              </h2>
              <div className="space-y-2">
                {years.map((year) => {
                  const count = talksByYear[year]?.length || 0;
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
                })}
              </div>
            </div>
          </div>
        </aside>

        {/* Right Content Area */}
        <main className="flex-1 min-w-0">
          {years.map((year) => {
            const talks = talksByYear[year] || [];
            if (talks.length === 0) return null;

            return (
              <section key={year} id={`year-${year}`} className="mb-16 scroll-mt-8">
                <h2 className="font-semibold text-xl mb-6 text-neutral-900 dark:text-neutral-100 text-center md:text-left">
                  {talks.length} {talks.length === 1 ? 'talk' : 'talks'} in {year}
                </h2>
                <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                  {talks.map((talk: Talk) => (
                    <ContentCard
                      key={crypto.randomUUID()}
                      title={talk.title}
                      subtitle={talk.subtitle}
                      image={talk.image}
                      post={talk.post}
                      blog={talk.blog}
                      video={talk.video}
                      from="talks"
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
