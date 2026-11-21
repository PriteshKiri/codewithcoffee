'use client';

import dynamic from 'next/dynamic';
import Image from 'next/image';
import Link from 'next/link';
import { Component, useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import type { Place, Trip, Visit, VisitKind } from '../travel/places';
import type { CameraTarget } from './globeView';

// globe.gl touches `window` on import, so it only loads in the browser.
const GlobeView = dynamic(() => import('./globeView'), { ssr: false });

const KINDS: Record<VisitKind, { label: string; dot: string }> = {
  talk: { label: 'Talks', dot: 'bg-orange-500' },
  event: { label: 'Events', dot: 'bg-blue-500' },
  travel: { label: 'Travel', dot: 'bg-emerald-500' },
};

type GlobeStatus = 'loading' | 'ready' | 'failed';

// Reveal whatever has rendered if the Earth texture never reports ready (e.g. a stalled request).
const GLOBE_READY_TIMEOUT_MS = 15000;

// Catches WebGL or chunk-loading failures so the rest of the page keeps working.
class GlobeErrorBoundary extends Component<{ onError: () => void; children: ReactNode }, { failed: boolean }> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error: unknown) {
    console.error('Travel globe failed to load', error);
    this.props.onError();
  }

  render() {
    return this.state.failed ? null : this.props.children;
  }
}

const DEG = Math.PI / 180;
// Nearby cities (e.g. Ahmedabad and Gandhinagar) open together when a marker is clicked.
const CLUSTER_KM = 130;
// Shifts the camera east of a selected city so the card on the right doesn't cover it.
const CARD_OFFSET_LNG = 22;

type LatLng = { lat: number; lng: number };

function distanceKm(a: LatLng, b: LatLng) {
  const dLat = (b.lat - a.lat) * DEG;
  const dLng = (b.lng - a.lng) * DEG;
  const h =
    Math.sin(dLat / 2) ** 2 + Math.cos(a.lat * DEG) * Math.cos(b.lat * DEG) * Math.sin(dLng / 2) ** 2;
  return 2 * 6371 * Math.asin(Math.sqrt(h));
}

// Frames every stop of a trip except home, so the camera centres on where the trip happened.
function tripCamera(trip: Trip, byId: Map<string, Place>): CameraTarget {
  const stops = Array.from(new Set(trip.stops))
    .map((id) => byId.get(id)!)
    .filter((p) => !p.isHome);
  const v = stops.reduce(
    (acc, p) => {
      acc[0] += Math.cos(p.lat * DEG) * Math.cos(p.lng * DEG);
      acc[1] += Math.cos(p.lat * DEG) * Math.sin(p.lng * DEG);
      acc[2] += Math.sin(p.lat * DEG);
      return acc;
    },
    [0, 0, 0],
  );
  const center: LatLng = {
    lat: Math.atan2(v[2], Math.hypot(v[0], v[1])) / DEG,
    lng: Math.atan2(v[1], v[0]) / DEG,
  };
  const spreadKm = Math.max(...stops.map((p) => distanceKm(center, p)));
  return { ...center, altitude: Math.min(Math.max(0.6 + spreadKm / 1500, 0.75), 2) };
}

export default function TravelGlobe({ places, trips }: { places: Place[]; trips: Trip[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState(0);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [activeTripId, setActiveTripId] = useState<string | null>(null);
  const [camera, setCamera] = useState<CameraTarget | null>(null);
  const [globeStatus, setGlobeStatus] = useState<GlobeStatus>('loading');

  const byId = useMemo(() => new Map(places.map((p) => [p.id, p])), [places]);
  const home = places.find((p) => p.isHome) ?? places[0];
  const selected = selectedIds.map((id) => byId.get(id)!).filter(Boolean);
  const activeTrip = trips.find((t) => t.id === activeTripId) ?? null;

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new ResizeObserver(() => setSize(el.offsetWidth));
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(
      () => setGlobeStatus((status) => (status === 'loading' ? 'ready' : status)),
      GLOBE_READY_TIMEOUT_MS,
    );
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setSelectedIds([]);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const selectPlaces = useCallback((targets: Place[]) => {
    setSelectedIds(targets.map((p) => p.id));
    if (!targets.length) return;
    const [primary] = targets;
    const wide = window.matchMedia('(min-width: 640px)').matches;
    setCamera({
      lat: primary.lat,
      lng: primary.lng + (wide ? CARD_OFFSET_LNG : 0),
      altitude: 1.5,
    });
    if (!wide) {
      requestAnimationFrame(() => cardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' }));
    }
  }, []);

  const onMarkerClick = useCallback(
    (place: Place) =>
      selectPlaces([place, ...places.filter((p) => p !== place && distanceKm(p, place) <= CLUSTER_KM)]),
    [places, selectPlaces],
  );

  const toggleTrip = (trip: Trip | null) => {
    setSelectedIds([]);
    if (!trip || trip.id === activeTripId) {
      setActiveTripId(null);
      setCamera({ lat: home.lat + 5, lng: home.lng + 5, altitude: 2 });
      return;
    }
    setActiveTripId(trip.id);
    setCamera(tripCamera(trip, byId));
  };

  const stats = useMemo(() => {
    const count = (kind: VisitKind) =>
      places.reduce((n, p) => n + p.visits.filter((v) => v.kind === kind).length, 0);
    return {
      countries: new Set(places.map((p) => p.country)).size,
      cities: places.length,
      talks: count('talk'),
      events: count('event'),
    };
  }, [places]);

  const countries = useMemo(() => {
    const groups = new Map<string, Place[]>();
    places.forEach((p) => groups.set(p.country, [...(groups.get(p.country) ?? []), p]));
    return Array.from(groups).sort(
      ([a, pa], [b, pb]) =>
        Number(b === home.country) - Number(a === home.country) || pb.length - pa.length,
    );
  }, [places, home]);

  return (
    <div>
      <p className="font-mono text-xs text-neutral-500 dark:text-neutral-400 mb-4">
        {stats.countries} countries · {stats.cities} cities · {trips.length} trips · {stats.talks} talks ·{' '}
        {stats.events} events
      </p>

      <div className="flex flex-wrap gap-2 mb-2">
        <TripButton label="All journeys" active={!activeTripId} onClick={() => toggleTrip(null)} />
        {trips.map((trip) => (
          <TripButton
            key={trip.id}
            label={trip.title}
            meta={trip.year ? String(trip.year) : undefined}
            color={trip.color}
            active={trip.id === activeTripId}
            onClick={() => toggleTrip(trip)}
          />
        ))}
      </div>

      <p className="min-h-[1.25rem] text-xs text-neutral-500 dark:text-neutral-400">
        {activeTrip &&
          activeTrip.stops.map((id, i) => (
            <span key={`${id}-${i}`}>
              {i > 0 && <span className="mx-1 text-neutral-300 dark:text-neutral-600">→</span>}
              <button
                onClick={() => selectPlaces([byId.get(id)!])}
                className="hover:text-neutral-900 dark:hover:text-neutral-100 hover:underline underline-offset-2"
              >
                {byId.get(id)!.city}
              </button>
            </span>
          ))}
      </p>

      <div className="relative mt-2">
        <div
          ref={containerRef}
          className="relative w-full max-w-[600px] mx-auto aspect-square select-none"
          // Zoomed-in views overflow the square canvas, so fade its edges into a circle.
          style={{
            maskImage: 'radial-gradient(circle, #000 62%, transparent 70%)',
            WebkitMaskImage: 'radial-gradient(circle, #000 62%, transparent 70%)',
          }}
        >
          <div className="absolute inset-[12%] rounded-full bg-sky-100/60 blur-2xl" aria-hidden />
          {size > 0 && globeStatus !== 'failed' && (
            <div
              className={`absolute inset-0 transition-opacity duration-700 ${
                globeStatus === 'ready' ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <GlobeErrorBoundary onError={() => setGlobeStatus('failed')}>
                <GlobeView
                  size={size}
                  places={places}
                  trips={trips}
                  activeTripId={activeTripId}
                  selectedIds={selectedIds}
                  camera={camera}
                  onSelectPlace={onMarkerClick}
                  onClear={() => setSelectedIds([])}
                  onReady={() => setGlobeStatus('ready')}
                />
              </GlobeErrorBoundary>
            </div>
          )}
          {globeStatus !== 'ready' && <GlobeLoader failed={globeStatus === 'failed'} />}
        </div>

        {selected.length > 0 && (
          <div
            ref={cardRef}
            className="relative z-10 mt-4 sm:mt-0 sm:absolute sm:right-0 sm:top-1/2 sm:-translate-y-1/2 sm:w-[290px] rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white/95 dark:bg-neutral-900/95 backdrop-blur shadow-lg"
          >
            <div className="max-h-[420px] overflow-y-auto p-4">
              {selected.map((place, i) => (
                <PlaceDetails
                  key={place.id}
                  place={place}
                  divided={i > 0}
                  onClose={i === 0 ? () => setSelectedIds([]) : undefined}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-neutral-500 dark:text-neutral-400">
        {(Object.keys(KINDS) as VisitKind[]).map((kind) => (
          <span key={kind} className="flex items-center gap-1.5">
            <span className={`h-2 w-2 rounded-full ${KINDS[kind].dot}`} />
            {KINDS[kind].label}
          </span>
        ))}
        <span className="hidden sm:inline ml-auto">drag to spin · click a city</span>
      </div>

      <div className="mt-10 space-y-6">
        {countries.map(([country, cityPlaces]) => (
          <section key={country}>
            <h2 className="font-semibold text-sm text-neutral-500 dark:text-neutral-400 mb-3 uppercase tracking-wider">
              {country}
            </h2>
            <div className="flex flex-wrap gap-2">
              {cityPlaces.map((place) => {
                const isActive = selectedIds[0] === place.id;
                return (
                  <button
                    key={place.id}
                    onClick={() => selectPlaces(isActive ? [] : [place])}
                    className={`flex items-center gap-2 rounded-full border px-3 py-1 text-sm transition-colors ${
                      isActive
                        ? 'border-neutral-900 dark:border-neutral-100 bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900'
                        : 'border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800'
                    }`}
                  >
                    <span className={`h-2 w-2 rounded-full ${KINDS[place.kind].dot}`} />
                    {place.city}
                    <span className={isActive ? 'opacity-70' : 'text-neutral-400 dark:text-neutral-500'}>
                      {place.visits.length}
                    </span>
                  </button>
                );
              })}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}

function GlobeLoader({ failed }: { failed: boolean }) {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center" role="status">
      <div
        className={`w-[58%] aspect-square rounded-full bg-gradient-to-br from-sky-100 via-sky-200 to-blue-300 shadow-[0_0_60px_10px_rgba(125,211,252,0.45)] ${
          failed ? 'opacity-60' : 'motion-safe:animate-pulse'
        }`}
      />
      <p className="absolute font-mono text-xs text-sky-900/70 max-w-[50%] text-center">
        {failed ? "The globe couldn't load here. Every city is still listed below." : 'Loading globe…'}
      </p>
    </div>
  );
}

function TripButton({
  label,
  meta,
  color,
  active,
  onClick,
}: {
  label: string;
  meta?: string;
  color?: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 rounded-full border px-3 py-1 text-xs transition-colors ${
        active
          ? 'border-neutral-900 dark:border-neutral-100 bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900'
          : 'border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800'
      }`}
    >
      {color && <span className="h-2 w-2 rounded-full" style={{ background: color }} />}
      {label}
      {meta && <span className={active ? 'opacity-70' : 'text-neutral-400 dark:text-neutral-500'}>{meta}</span>}
    </button>
  );
}

function PlaceDetails({
  place,
  divided,
  onClose,
}: {
  place: Place;
  divided: boolean;
  onClose?: () => void;
}) {
  const groups = (Object.keys(KINDS) as VisitKind[])
    .map((kind) => ({ kind, visits: place.visits.filter((v) => v.kind === kind) }))
    .filter(({ visits }) => visits.length);

  return (
    <div className={divided ? 'mt-5 pt-5 border-t border-neutral-200 dark:border-neutral-700' : ''}>
      <div className="flex items-start justify-between gap-2">
        <div>
          <h3 className="font-semibold text-neutral-900 dark:text-neutral-100 leading-tight">{place.city}</h3>
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            {place.country}
            {place.isHome && ' · home'}
          </p>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            aria-label="Close"
            className="-mr-1 -mt-1 rounded-full p-1 text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        )}
      </div>

      {groups.map(({ kind, visits }) => (
        <div key={kind} className="mt-4">
          <p className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-2">
            <span className={`h-1.5 w-1.5 rounded-full ${KINDS[kind].dot}`} />
            {KINDS[kind].label} · {visits.length}
          </p>
          <ul className="space-y-3">
            {visits.map((visit, i) => (
              <VisitRow key={`${visit.title}-${i}`} visit={visit} />
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

function VisitRow({ visit }: { visit: Visit }) {
  const [primary, ...rest] = visit.links;
  const title = (
    <span className="text-sm font-medium leading-snug text-neutral-900 dark:text-neutral-100 line-clamp-2">
      {visit.title}
    </span>
  );

  return (
    <li className="flex gap-3">
      {visit.image ? (
        <Image
          src={visit.image}
          alt=""
          width={64}
          height={48}
          className="h-12 w-16 flex-shrink-0 rounded-md object-cover"
        />
      ) : (
        <div className="h-12 w-16 flex-shrink-0 rounded-md bg-neutral-100 dark:bg-neutral-800" />
      )}
      <div className="min-w-0">
        {primary ? (
          <Link href={primary.href} target="_blank" rel="noopener noreferrer" className="hover:underline">
            {title}
          </Link>
        ) : (
          title
        )}
        <div className="mt-1 flex flex-wrap items-center gap-x-2 text-xs text-neutral-500 dark:text-neutral-400">
          {visit.year && <span>{visit.year}</span>}
          {rest.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-2 hover:text-neutral-900 dark:hover:text-neutral-100"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </li>
  );
}
