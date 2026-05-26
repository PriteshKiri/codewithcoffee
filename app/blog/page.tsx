'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import ContentCard from '../components/contentCard';
import CustomDropdown, { DropdownOption } from '../components/customDropdown';
import Footer from '../components/footer';
import blogsData from '../data/blogs.json';

interface Blog {
  title: string;
  subtitle: string;
  image: string;
  link: string;
  source: string;
  year: number;
  date?: string;
}

const ALL_SOURCES = 'All';
const SOURCE_ORDER = ['Dev.to', 'LinkedIn', 'Hashnode', 'Harness', 'CNCF'];

export default function BlogPage() {
  const years = Object.keys(blogsData).sort().reverse();
  const observerRef = useRef<IntersectionObserver | null>(null);

  const allBlogs = useMemo(() => {
    const list: (Blog & { _year: string })[] = [];
    years.forEach((year) => {
      const blogs = (blogsData[year as keyof typeof blogsData] as Blog[]) || [];
      blogs.forEach((b) => list.push({ ...b, _year: year }));
    });
    return list;
  }, [years]);

  const [selectedSource, setSelectedSource] = useState<string>(ALL_SOURCES);
  const [activeYear, setActiveYear] = useState<string>(years[0] || '');

  // Source counts (always reflect total per source, irrespective of year)
  const sourceCounts = useMemo(() => {
    const counts: Record<string, number> = { [ALL_SOURCES]: allBlogs.length };
    SOURCE_ORDER.forEach((s) => {
      counts[s] = 0;
    });
    allBlogs.forEach((b) => {
      if (counts[b.source] !== undefined) {
        counts[b.source] += 1;
      }
    });
    return counts;
  }, [allBlogs]);

  const sourceOptions: DropdownOption[] = useMemo(
    () => [
      { value: ALL_SOURCES, label: ALL_SOURCES, count: sourceCounts[ALL_SOURCES] || 0 },
      ...SOURCE_ORDER.map((s) => ({
        value: s,
        label: s,
        count: sourceCounts[s] || 0,
      })),
    ],
    [sourceCounts]
  );

  // Filter blogs by source, grouped by year and sorted by date desc within each year.
  const filteredBlogsByYear = useMemo(() => {
    const result: Record<string, Blog[]> = {};
    years.forEach((year) => {
      const blogs = (blogsData[year as keyof typeof blogsData] as Blog[]) || [];
      const filtered = blogs.filter(
        (b) => selectedSource === ALL_SOURCES || b.source === selectedSource
      );
      // Sort newest first within each year if date is available
      result[year] = [...filtered].sort((a, b) => {
        const da = a.date ? new Date(a.date).getTime() : 0;
        const db = b.date ? new Date(b.date).getTime() : 0;
        return db - da;
      });
    });
    return result;
  }, [selectedSource, years]);

  const visibleYears = useMemo(
    () => years.filter((year) => (filteredBlogsByYear[year]?.length || 0) > 0),
    [years, filteredBlogsByYear]
  );

  const yearOptions: DropdownOption[] = useMemo(
    () =>
      visibleYears.map((year) => ({
        value: year,
        label: year,
        count: filteredBlogsByYear[year]?.length || 0,
      })),
    [visibleYears, filteredBlogsByYear]
  );

  const scrollToYear = (year: string) => {
    setActiveYear(year);
    const element = document.getElementById(`year-${year}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

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

  const getBlogCount = (year: string) => filteredBlogsByYear[year]?.length || 0;

  const blogNoun = (count: number) => (count === 1 ? 'blog' : 'blogs');

  const sourceSuffix = selectedSource === ALL_SOURCES ? '' : ` · ${selectedSource}`;

  return (
    <>
      <section>
        <h1 className="font-medium text-2xl mb-4 tracking-tighter">my blogs</h1>
        <p className="prose prose-neutral dark:prose-invert mb-8">
          A collection of articles I&apos;ve written across Dev.to, LinkedIn, Hashnode,
          and the Harness blog, on chaos engineering, reliability, developer
          experience, and community.
        </p>
      </section>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Mobile Filters */}
        <div className="md:hidden w-full mb-6 sticky top-20 z-40 bg-white dark:bg-[#111010] py-4 -mt-4 space-y-3">
          <div>
            <label className="block text-xs font-semibold text-neutral-500 dark:text-neutral-400 mb-1 uppercase tracking-wider">
              Source
            </label>
            <CustomDropdown
              options={sourceOptions}
              value={selectedSource}
              onChange={setSelectedSource}
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
                Source
              </h2>
              <CustomDropdown
                options={sourceOptions}
                value={selectedSource}
                onChange={setSelectedSource}
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
                    const count = filteredBlogsByYear[year]?.length || 0;
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
                No blogs found
              </p>
              <p className="text-sm text-neutral-500 dark:text-neutral-400">
                Try a different source.
              </p>
            </div>
          ) : (
            visibleYears.map((year) => {
              const blogs = filteredBlogsByYear[year];
              const blogCount = getBlogCount(year);

              return (
                <section key={year} id={`year-${year}`} className="mb-16 scroll-mt-8">
                  <h2 className="font-semibold text-xl mb-6 text-neutral-900 dark:text-neutral-100 text-center md:text-left">
                    {blogCount} {blogNoun(blogCount)} in {year}
                    {sourceSuffix && (
                      <span className="text-neutral-500 dark:text-neutral-400 font-normal">
                        {sourceSuffix}
                      </span>
                    )}
                  </h2>
                  <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                    {blogs.map((blog: Blog) => (
                      <ContentCard
                        key={crypto.randomUUID()}
                        title={blog.title}
                        subtitle={blog.subtitle}
                        image={blog.image}
                        link={blog.link}
                        from="blog"
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
