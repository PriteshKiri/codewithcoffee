'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Writes (or removes) a single query param on the current URL without
 * triggering a navigation. The param is removed when it equals the default
 * value so that shareable URLs stay clean.
 */
export function writeQueryParam(key: string, value: string, defaultValue?: string) {
  if (typeof window === 'undefined') return;

  const params = new URLSearchParams(window.location.search);
  if (defaultValue !== undefined && value === defaultValue) {
    params.delete(key);
  } else {
    params.set(key, value);
  }

  const queryString = params.toString();
  const newUrl = queryString
    ? `${window.location.pathname}?${queryString}`
    : window.location.pathname;

  window.history.replaceState(null, '', newUrl);
}

/** Reads a single query param from the current URL. */
export function readQueryParam(key: string): string | null {
  if (typeof window === 'undefined') return null;
  return new URLSearchParams(window.location.search).get(key);
}

/**
 * Like useState, but keeps the value in sync with a URL query param so the
 * current filter selection can be shared via the URL.
 *
 * Starts from `defaultValue` (matching the server render) and hydrates from the
 * URL after mount to avoid hydration mismatches. `allowedValues` guards against
 * arbitrary/invalid values being read from the URL.
 */
export function useQueryParamState(
  key: string,
  defaultValue: string,
  allowedValues?: readonly string[]
): [string, (value: string) => void] {
  const [value, setValue] = useState(defaultValue);

  useEffect(() => {
    const param = readQueryParam(key);
    if (param !== null && (!allowedValues || allowedValues.includes(param))) {
      setValue(param);
    }
    // Only read from the URL once, on mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setParam = useCallback(
    (newValue: string) => {
      setValue(newValue);
      writeQueryParam(key, newValue, defaultValue);
    },
    [key, defaultValue]
  );

  return [value, setParam];
}

/**
 * On first load, scrolls to the `year` from the URL (if present and visible)
 * and marks it active. Waits until the year sections are actually rendered
 * (i.e. `visibleYears` is populated) so the scroll target exists. Runs once.
 */
export function useInitialYearScroll(
  visibleYears: string[],
  setActiveYear: (year: string) => void
) {
  const didScroll = useRef(false);

  useEffect(() => {
    if (didScroll.current || visibleYears.length === 0) return;

    const year = readQueryParam('year');
    // Only act once the year is actually visible. If a URL filter is also set,
    // `visibleYears` may update on a later render, so we keep waiting until then.
    if (year && visibleYears.includes(year)) {
      didScroll.current = true;
      setActiveYear(year);
      // Defer to the next frame so the target element is laid out.
      requestAnimationFrame(() => {
        document
          .getElementById(`year-${year}`)
          ?.scrollIntoView({ behavior: 'auto', block: 'start' });
      });
    }
  }, [visibleYears, setActiveYear]);
}
