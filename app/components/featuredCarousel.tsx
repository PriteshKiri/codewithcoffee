'use client';

import { useState, useEffect, useMemo } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa6';
import ContentCard from './contentCard';

export interface FeaturedCarouselItem {
  title: string;
  subtitle: string;
  image: string;
  link?: string;
  post?: string;
  blog?: string;
  video?: string;
  badge?: string;
}

interface FeaturedCarouselProps {
  items: FeaturedCarouselItem[];
  /**
   * Number of cards visible per slide on `sm:`+ screens (default: 2).
   * Mobile (< 640px) is always paginated 1-per-slide.
   */
  itemsPerPage?: number;
  /**
   * Auto-advance interval in ms (default: 2000). Set to 0 to disable auto-scroll.
   */
  autoScrollInterval?: number;
  /**
   * Optional aria label for the carousel region (e.g. "Featured Videos").
   */
  ariaLabel?: string;
}

// Tailwind's `sm:` breakpoint.
const DESKTOP_QUERY = '(min-width: 640px)';

export default function FeaturedCarousel({
  items,
  itemsPerPage: desktopItemsPerPage = 2,
  autoScrollInterval = 2000,
  ariaLabel,
}: FeaturedCarouselProps) {
  // Pagination size is responsive: 1 on mobile, `desktopItemsPerPage` on sm:+.
  // Initial value (used for SSR + first client render) intentionally matches
  // the desktop layout to avoid hydration mismatches; the effect below adjusts
  // it after mount based on the actual viewport.
  const [itemsPerPage, setItemsPerPage] = useState(desktopItemsPerPage);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mql = window.matchMedia(DESKTOP_QUERY);
    const update = () =>
      setItemsPerPage(mql.matches ? desktopItemsPerPage : 1);
    update();
    mql.addEventListener('change', update);
    return () => mql.removeEventListener('change', update);
  }, [desktopItemsPerPage]);

  const pages = useMemo(() => {
    const result: FeaturedCarouselItem[][] = [];
    for (let i = 0; i < items.length; i += itemsPerPage) {
      result.push(items.slice(i, i + itemsPerPage));
    }
    return result;
  }, [items, itemsPerPage]);

  const totalPages = pages.length;
  const [currentPage, setCurrentPage] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused || totalPages <= 1 || autoScrollInterval <= 0) return;
    const timer = setInterval(() => {
      setCurrentPage((p) => (p + 1) % totalPages);
    }, autoScrollInterval);
    return () => clearInterval(timer);
  }, [isPaused, totalPages, autoScrollInterval]);

  // Reset to first page when the underlying items change.
  useEffect(() => {
    setCurrentPage(0);
  }, [totalPages]);

  if (items.length === 0) return null;

  const goPrev = () =>
    setCurrentPage((p) => (p - 1 + totalPages) % totalPages);
  const goNext = () => setCurrentPage((p) => (p + 1) % totalPages);

  return (
    <div
      className="my-8 w-full"
      role="region"
      aria-roledescription="carousel"
      aria-label={ariaLabel}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onBlur={() => setIsPaused(false)}
    >
      <div className="overflow-hidden">
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${currentPage * 100}%)` }}
          aria-live="polite"
        >
          {pages.map((page, pageIdx) => (
            // p-2 gives every card 8px of breathing room inside the slide so
            // that the absolutely-positioned badges (top:-0.5rem, right:-0.5rem
            // on ContentCard) and the cards' rounded corners don't get clipped
            // by the parent's `overflow-hidden`.
            <div
              key={pageIdx}
              className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full flex-shrink-0 p-2"
              aria-hidden={pageIdx !== currentPage}
            >
              {page.map((item, i) => (
                <ContentCard
                  key={item.link ?? `${pageIdx}-${i}-${item.title}`}
                  title={item.title}
                  subtitle={item.subtitle}
                  image={item.image}
                  link={item.link}
                  post={item.post}
                  blog={item.blog}
                  video={item.video}
                  badge={item.badge}
                  from="featured"
                />
              ))}
            </div>
          ))}
        </div>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-3 mt-5">
          <button
            type="button"
            onClick={goPrev}
            aria-label="Previous slide"
            className="w-9 h-9 rounded-full border border-neutral-300 dark:border-neutral-600 text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors flex items-center justify-center"
          >
            <FaChevronLeft className="w-3 h-3" />
          </button>

          <div className="flex gap-1.5">
            {pages.map((_, idx) => {
              const isActive = idx === currentPage;
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setCurrentPage(idx)}
                  aria-label={`Go to slide ${idx + 1}`}
                  aria-current={isActive ? 'true' : undefined}
                  className={`h-2 rounded-full transition-all ${
                    isActive
                      ? 'w-5 bg-neutral-700 dark:bg-neutral-200'
                      : 'w-2 bg-neutral-300 dark:bg-neutral-600 hover:bg-neutral-400 dark:hover:bg-neutral-500'
                  }`}
                />
              );
            })}
          </div>

          <button
            type="button"
            onClick={goNext}
            aria-label="Next slide"
            className="w-9 h-9 rounded-full border border-neutral-300 dark:border-neutral-600 text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors flex items-center justify-center"
          >
            <FaChevronRight className="w-3 h-3" />
          </button>
        </div>
      )}
    </div>
  );
}
