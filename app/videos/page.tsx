'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import ContentCard from "../components/contentCard";
import CustomDropdown, { DropdownOption } from "../components/customDropdown";
import Footer from "../components/footer";
import videosData from "../data/videos.json";

interface Video {
  title: string;
  subtitle: string;
  image: string;
  link: string;
  year: number;
  badge?: string;
  org?: string;
  format?: string;
}

type VideoFormat = 'all' | 'long-form' | 'short-form';
const FORMAT_ORDER: VideoFormat[] = ['all', 'long-form', 'short-form'];
const FORMAT_LABELS: Record<VideoFormat, string> = {
  all: 'All',
  'long-form': 'Long-form',
  'short-form': 'Short-form',
};

const ALL_ORGS = 'All';
const ORG_ORDER = ['Harness', 'LitmusChaos', 'ToolJet', 'Personal'];

// Treat missing format as long-form for backwards compatibility
const getFormat = (v: Video): 'long-form' | 'short-form' =>
  v.format === 'short-form' ? 'short-form' : 'long-form';

export default function VideosPage() {
  const years = Object.keys(videosData).sort().reverse(); // ['2026', '2025', '2024', '2023']
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Flat list of all videos with year attached for easy aggregation
  const allVideos = useMemo(() => {
    const list: (Video & { _year: string })[] = [];
    years.forEach((year) => {
      const videos = (videosData[year as keyof typeof videosData] as Video[]) || [];
      videos.forEach((v) => list.push({ ...v, _year: year }));
    });
    return list;
  }, [years]);

  const [videoFormat, setVideoFormat] = useState<VideoFormat>('all');
  const [selectedOrg, setSelectedOrg] = useState<string>(ALL_ORGS);
  const [activeYear, setActiveYear] = useState<string>('2026');

  // Org counts: each option counts videos matching that org within the current format
  const orgCounts = useMemo(() => {
    const counts: Record<string, number> = { [ALL_ORGS]: 0 };
    ORG_ORDER.forEach((org) => {
      counts[org] = 0;
    });
    allVideos.forEach((v) => {
      const formatOk = videoFormat === 'all' || getFormat(v) === videoFormat;
      if (!formatOk) return;
      counts[ALL_ORGS] += 1;
      if (v.org && counts[v.org] !== undefined) {
        counts[v.org] += 1;
      }
    });
    return counts;
  }, [allVideos, videoFormat]);

  // Format counts: each option counts videos matching that format within the current org
  const formatCounts = useMemo(() => {
    const counts: Record<VideoFormat, number> = {
      all: 0,
      'long-form': 0,
      'short-form': 0,
    };
    allVideos.forEach((v) => {
      const orgOk = selectedOrg === ALL_ORGS || v.org === selectedOrg;
      if (!orgOk) return;
      counts.all += 1;
      counts[getFormat(v)] += 1;
    });
    return counts;
  }, [allVideos, selectedOrg]);

  const orgOptions: DropdownOption[] = useMemo(
    () => [
      { value: ALL_ORGS, label: ALL_ORGS, count: orgCounts[ALL_ORGS] || 0 },
      ...ORG_ORDER.map((org) => ({
        value: org,
        label: org,
        count: orgCounts[org] || 0,
      })),
    ],
    [orgCounts]
  );

  const formatOptions: DropdownOption[] = useMemo(
    () =>
      FORMAT_ORDER.map((fmt) => ({
        value: fmt,
        label: FORMAT_LABELS[fmt],
        count: formatCounts[fmt] || 0,
      })),
    [formatCounts]
  );

  // Filter videos by format + org, grouped by year
  const filteredVideosByYear = useMemo(() => {
    const result: Record<string, Video[]> = {};
    years.forEach((year) => {
      const videos = (videosData[year as keyof typeof videosData] as Video[]) || [];
      result[year] = videos.filter((v) => {
        const orgOk = selectedOrg === ALL_ORGS || v.org === selectedOrg;
        const formatOk = videoFormat === 'all' || getFormat(v) === videoFormat;
        return orgOk && formatOk;
      });
    });
    return result;
  }, [videoFormat, selectedOrg, years]);

  const visibleYears = useMemo(
    () => years.filter((year) => (filteredVideosByYear[year]?.length || 0) > 0),
    [years, filteredVideosByYear]
  );

  const yearOptions: DropdownOption[] = useMemo(
    () =>
      visibleYears.map((year) => ({
        value: year,
        label: year,
        count: filteredVideosByYear[year]?.length || 0,
      })),
    [visibleYears, filteredVideosByYear]
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

  const getVideoCount = (year: string) => filteredVideosByYear[year]?.length || 0;

  const formatNoun = (count: number) => {
    const base =
      videoFormat === 'short-form'
        ? 'short-form video'
        : videoFormat === 'long-form'
        ? 'long-form video'
        : 'video';
    return count === 1 ? base : `${base}s`;
  };

  const orgSuffix = selectedOrg === ALL_ORGS ? '' : ` · ${selectedOrg}`;

  return (
    <>
      <div className="flex flex-col md:flex-row gap-8">
        {/* Mobile Filters */}
        <div className="md:hidden w-full mb-6 sticky top-20 z-40 bg-white dark:bg-[#111010] py-4 -mt-4 space-y-3">
          <div>
            <label className="block text-xs font-semibold text-neutral-500 dark:text-neutral-400 mb-1 uppercase tracking-wider">
              Organization
            </label>
            <CustomDropdown
              options={orgOptions}
              value={selectedOrg}
              onChange={setSelectedOrg}
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-neutral-500 dark:text-neutral-400 mb-1 uppercase tracking-wider">
              Format
            </label>
            <CustomDropdown
              options={formatOptions}
              value={videoFormat}
              onChange={(val) => setVideoFormat(val as VideoFormat)}
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
                Organization
              </h2>
              <CustomDropdown
                options={orgOptions}
                value={selectedOrg}
                onChange={setSelectedOrg}
              />
            </div>

            <div>
              <h2 className="font-semibold text-sm text-neutral-500 dark:text-neutral-400 mb-3 uppercase tracking-wider">
                Format
              </h2>
              <CustomDropdown
                options={formatOptions}
                value={videoFormat}
                onChange={(val) => setVideoFormat(val as VideoFormat)}
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
                    const count = filteredVideosByYear[year]?.length || 0;
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
                No videos found
              </p>
              <p className="text-sm text-neutral-500 dark:text-neutral-400">
                Try a different combination of filters.
              </p>
            </div>
          ) : (
            visibleYears.map((year) => {
              const videos = filteredVideosByYear[year];
              const videoCount = getVideoCount(year);

              return (
                <section key={year} id={`year-${year}`} className="mb-16 scroll-mt-8">
                  <h2 className="font-semibold text-xl mb-6 text-neutral-900 dark:text-neutral-100 text-center md:text-left">
                    {videoCount} {formatNoun(videoCount)} in {year}
                    {orgSuffix && (
                      <span className="text-neutral-500 dark:text-neutral-400 font-normal">
                        {orgSuffix}
                      </span>
                    )}
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
            })
          )}
        </main>
      </div>
      <Footer />
    </>
  );
}
