'use client';

import { useState, useEffect, useRef } from 'react';
import ContentCard from "../components/contentCard";
import CustomDropdown from "../components/customDropdown";
import Footer from "../components/footer";
import videosData from "../data/videos.json";

interface Video {
  title: string;
  subtitle: string;
  image: string;
  link: string;
  year: number;
  badge?: string;
}

export default function VideosPage() {
  const [activeYear, setActiveYear] = useState<string>('2025');
  const years = Object.keys(videosData).sort().reverse(); // ['2025', '2024', '2023']
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

  // Calculate video counts
  const getVideoCount = (year: string) => {
    return videosData[year as keyof typeof videosData]?.length || 0;
  };

  return (
    <>
      <div className="flex flex-col md:flex-row gap-8">
        {/* Mobile Year Selector */}
        <div className="md:hidden w-full mb-6 sticky top-20 z-40 bg-white dark:bg-transparent py-4 -mt-4">
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
            const videos = videosData[year as keyof typeof videosData];
            const videoCount = getVideoCount(year);
            
            return (
              <section key={year} id={`year-${year}`} className="mb-16 scroll-mt-8">
                <h2 className="font-semibold text-xl mb-6 text-neutral-900 dark:text-neutral-100 text-center md:text-left">
                  {videoCount} {videoCount === 1 ? 'video' : 'videos'} in {year}
                </h2>
                <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                  {videos.map((video: Video) => (
                    <ContentCard
                      key={crypto.randomUUID()}
                      title={video.title}
                      subtitle={video.subtitle}
                      image={video.image}
                      link={video.link}
                      from="video"
                      badge={video.badge}
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
