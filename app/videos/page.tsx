'use client';

import { useState, useEffect } from 'react';
import ContentCard from "../components/contentCard";
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

  const scrollToYear = (year: string) => {
    setActiveYear(year);
    const element = document.getElementById(`year-${year}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Calculate video counts
  const getVideoCount = (year: string) => {
    return videosData[year as keyof typeof videosData]?.length || 0;
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
          const videos = videosData[year as keyof typeof videosData];
          const videoCount = getVideoCount(year);
          
          return (
            <section key={year} id={`year-${year}`} className="mb-16 scroll-mt-8">
              <h2 className="font-semibold text-xl mb-6 text-neutral-900 dark:text-neutral-100">
                {videoCount} {videoCount === 1 ? 'video' : 'videos'} in {year}
              </h2>
              <div className="flex flex-wrap gap-4">
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
  );
}
