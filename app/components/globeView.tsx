'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Globe, { type GlobeMethods } from 'react-globe.gl';
import type { Place, Trip, VisitKind } from '../travel/places';

const KIND_COLORS: Record<VisitKind, string> = {
  talk: '#f97316',
  event: '#3b82f6',
  travel: '#10b981',
};

const HOME_COUNTRY_COLOR = '#14b8a6';
// Natural Earth names that differ from the `country` used in places.json.
const COUNTRY_ALIASES: Record<string, string> = { 'United States of America': 'USA' };

type LabelAlign = 'center' | 'start' | 'end';
// Small countries whose centre sits on a visited city: anchor the label beside the country instead.
// `end` runs the text west of the anchor, `start` runs it east.
const LABEL_PLACEMENT: Record<string, { lat: number; lng: number; align: LabelAlign }> = {
  Nepal: { lat: 28.8, lng: 83.2, align: 'end' },
  Bhutan: { lat: 27.9, lng: 91.2, align: 'start' },
  'South Korea': { lat: 36.2, lng: 125.9, align: 'end' },
};
const ALIGN_CLASSES: Record<LabelAlign, string> = {
  center: 'left-1/2 -translate-x-1/2',
  start: 'left-0',
  end: 'right-0',
};

interface CountryFeature {
  type: 'Feature';
  properties: { name: string; lat: number; lng: number };
  geometry: object;
}

interface Country {
  name: string;
  color: string;
  lat: number;
  lng: number;
  align: LabelAlign;
  feature: CountryFeature;
}

export interface CameraTarget {
  lat: number;
  lng: number;
  altitude: number;
}

interface GlobeViewProps {
  size: number;
  places: Place[];
  trips: Trip[];
  activeTripId: string | null;
  selectedIds: string[];
  camera: CameraTarget | null;
  onSelectPlace: (place: Place) => void;
  onClear: () => void;
  onReady: () => void;
}

interface ArcDatum {
  startLat: number;
  startLng: number;
  endLat: number;
  endLng: number;
  tripId: string | null;
  color: string;
  layer: 'route' | 'pulse' | 'local';
  index: number;
  legs: number;
  altitude: number;
}

const INITIAL_VIEW: CameraTarget = { lat: 18, lng: 82, altitude: 2 };
const LEG_ANIMATION_MS = 1800;
const PULSE_LENGTH = 0.35;

const DEG = Math.PI / 180;

// Scales with distance, with a floor so short hops like Seoul–Busan still read as arcs.
// `lift` raises legs that repeat an earlier pair of cities so the return trip doesn't overlap.
function arcAltitude(a: { lat: number; lng: number }, b: { lat: number; lng: number }, lift: number) {
  const h =
    Math.sin(((b.lat - a.lat) * DEG) / 2) ** 2 +
    Math.cos(a.lat * DEG) * Math.cos(b.lat * DEG) * Math.sin(((b.lng - a.lng) * DEG) / 2) ** 2;
  const angle = 2 * Math.asin(Math.sqrt(h));
  return Math.max(angle * 0.18, 0.04) * (1 + 0.8 * lift);
}

const withAlpha = (hex: string, alpha: number) =>
  hex +
  Math.round(alpha * 255)
    .toString(16)
    .padStart(2, '0');

function createMarker(place: Place, onClick: () => void) {
  const color = KIND_COLORS[place.kind];
  const el = document.createElement('button');
  el.type = 'button';
  el.setAttribute('aria-label', place.city);
  el.className = 'group relative block h-4 w-4 cursor-pointer transition-opacity duration-300';
  el.style.pointerEvents = 'auto';
  el.innerHTML = `
    <span class="absolute inset-0 m-auto h-3 w-3 rounded-full transition-transform duration-200 group-hover:scale-125 group-data-[selected=true]:scale-150" style="background:${color};box-shadow:0 0 0 2px #fff, 0 0 10px 3px ${withAlpha(color, 0.75)}"></span>
    <span class="pointer-events-none absolute left-full top-1/2 ml-1 -translate-y-1/2 whitespace-nowrap rounded-full bg-white/95 px-2 py-0.5 text-[11px] font-medium text-neutral-800 shadow-md ring-1 ring-black/5 opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-data-[labeled=true]:opacity-100">${place.city}</span>
  `;
  el.addEventListener('click', (e) => {
    e.stopPropagation();
    onClick();
  });
  return el;
}

function createCountryLabel(country: Country) {
  const el = document.createElement('div');
  el.className = 'group pointer-events-none relative h-0 w-0 transition-opacity duration-300';
  el.innerHTML = `<span class="absolute bottom-1.5 ${ALIGN_CLASSES[country.align]} whitespace-nowrap text-[10px] font-semibold uppercase tracking-[0.2em] text-white transition-opacity duration-300 group-data-[muted=true]:opacity-40" style="text-shadow:0 1px 3px rgba(0,0,0,0.7),0 0 8px rgba(0,0,0,0.35)">${country.name}</span>`;
  return el;
}

export default function GlobeView({
  size,
  places,
  trips,
  activeTripId,
  selectedIds,
  camera,
  onSelectPlace,
  onClear,
  onReady,
}: GlobeViewProps) {
  const globeRef = useRef<GlobeMethods>();
  const readyRef = useRef(false);
  const onSelectRef = useRef(onSelectPlace);
  onSelectRef.current = onSelectPlace;
  const autoRotate = !activeTripId && !selectedIds.length;
  // Read in onGlobeReady so clicks made while the globe was loading still apply.
  const pendingRef = useRef({ camera, autoRotate });
  pendingRef.current = { camera, autoRotate };

  const byId = useMemo(() => new Map(places.map((p) => [p.id, p])), [places]);

  const [countryFeatures, setCountryFeatures] = useState<CountryFeature[]>([]);
  useEffect(() => {
    let cancelled = false;
    fetch('/static/globe/countries.json')
      .then((res) => (res.ok ? res.json() : Promise.reject(res.status)))
      .then((data) => !cancelled && setCountryFeatures(data.features))
      // The highlight is decorative; the globe works without it.
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  // Each country takes the colour of the first trip that visits it; home stays teal.
  const countries = useMemo<Country[]>(() => {
    const home = places.find((p) => p.isHome)!;
    const colors = new Map<string, string>();
    trips.forEach((trip) =>
      trip.stops.forEach((id) => {
        const country = byId.get(id)!.country;
        if (country !== home.country && !colors.has(country)) colors.set(country, trip.color);
      }),
    );
    const visited = new Set(places.map((p) => p.country));
    return countryFeatures.flatMap((feature) => {
      const { name: rawName, lat, lng } = feature.properties;
      const name = COUNTRY_ALIASES[rawName] ?? rawName;
      if (!visited.has(name)) return [];
      const placement = LABEL_PLACEMENT[name] ?? { lat, lng, align: 'center' as const };
      return [{ name, color: colors.get(name) ?? HOME_COUNTRY_COLOR, ...placement, feature }];
    });
  }, [countryFeatures, places, trips, byId]);

  // Markers and labels are plain DOM nodes owned by globe.gl, so build them once and toggle data attributes.
  const markers = useMemo(
    () => new Map(places.map((p) => [p.id, createMarker(p, () => onSelectRef.current(p))])),
    [places],
  );
  const countryLabels = useMemo(
    () => new Map(countries.map((c) => [c.name, createCountryLabel(c)])),
    [countries],
  );
  const htmlData = useMemo(() => [...countries, ...places], [countries, places]);

  const arcs = useMemo<ArcDatum[]>(() => {
    const onTrip = new Set(trips.flatMap((t) => t.stops));
    const home = places.find((p) => p.isHome)!;
    const tripArcs = trips.flatMap((trip) =>
      trip.legs.flatMap((leg) => {
        const a = byId.get(leg.from)!;
        const b = byId.get(leg.to)!;
        const base = {
          startLat: a.lat,
          startLng: a.lng,
          endLat: b.lat,
          endLng: b.lng,
          tripId: trip.id,
          color: trip.color,
          index: leg.index,
          legs: trip.legs.length,
          altitude: arcAltitude(a, b, leg.lift),
        };
        return [
          { ...base, layer: 'route' as const },
          { ...base, layer: 'pulse' as const },
        ];
      }),
    );
    // Talk and event cities that aren't part of a trip get a quiet link from home.
    const localArcs = places
      .filter((p) => !p.isHome && !onTrip.has(p.id))
      .map((p) => ({
        startLat: home.lat,
        startLng: home.lng,
        endLat: p.lat,
        endLng: p.lng,
        tripId: null,
        color: KIND_COLORS[p.kind],
        layer: 'local' as const,
        index: 0,
        legs: 1,
        altitude: arcAltitude(home, p, 0),
      }));
    return [...localArcs, ...tripArcs];
  }, [places, trips, byId]);

  const activeStops = useMemo(
    () => new Set(trips.find((t) => t.id === activeTripId)?.stops ?? []),
    [trips, activeTripId],
  );

  useEffect(() => {
    markers.forEach((el, id) => {
      const place = byId.get(id)!;
      const selected = selectedIds.includes(id);
      el.dataset.selected = String(selected);
      el.dataset.labeled = String(selected || place.isHome || activeStops.has(id));
    });
  }, [markers, byId, selectedIds, activeStops]);

  // Every trip starts at home, so only the countries it travels to count as part of it.
  const activeCountries = useMemo(() => {
    const homeCountry = places.find((p) => p.isHome)!.country;
    return new Set(
      Array.from(activeStops, (id) => byId.get(id)!.country).filter((c) => c !== homeCountry),
    );
  }, [activeStops, places, byId]);
  const isCountryMuted = (c: Country) => activeTripId !== null && !activeCountries.has(c.name);

  useEffect(() => {
    countryLabels.forEach((el, name) => {
      el.dataset.muted = String(activeTripId !== null && !activeCountries.has(name));
    });
  }, [countryLabels, activeTripId, activeCountries]);

  useEffect(() => {
    const globe = globeRef.current;
    if (readyRef.current && globe) globe.controls().autoRotate = autoRotate;
  }, [autoRotate]);

  useEffect(() => {
    if (readyRef.current && camera) globeRef.current?.pointOfView(camera, 1200);
  }, [camera]);

  const isDimmed = (d: ArcDatum) =>
    activeTripId !== null && d.tripId !== activeTripId;

  return (
    <Globe
      ref={globeRef}
      width={size}
      height={size}
      backgroundColor="rgba(0,0,0,0)"
      rendererConfig={{ antialias: true, alpha: true }}
      globeImageUrl="/static/globe/earth-day.jpg"
      bumpImageUrl="/static/globe/earth-topology.png"
      atmosphereColor="#7dd3fc"
      atmosphereAltitude={0.24}
      onGlobeReady={() => {
        const globe = globeRef.current;
        if (!globe) return;
        globe.renderer().setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
        const pending = pendingRef.current;
        globe.pointOfView(pending.camera ?? INITIAL_VIEW, 0);
        const controls = globe.controls();
        controls.enableZoom = false;
        controls.autoRotate = pending.autoRotate;
        controls.autoRotateSpeed = 0.35;
        readyRef.current = true;
        onReady();
      }}
      onGlobeClick={onClear}
      polygonsData={countries}
      polygonGeoJsonGeometry={(d) => (d as Country).feature.geometry as never}
      polygonCapColor={(d) => withAlpha((d as Country).color, isCountryMuted(d as Country) ? 0.1 : 0.4)}
      polygonSideColor={() => 'rgba(0,0,0,0)'}
      polygonStrokeColor={(d) => withAlpha((d as Country).color, isCountryMuted(d as Country) ? 0.3 : 0.95)}
      polygonAltitude={0.004}
      polygonsTransitionDuration={400}
      onPolygonClick={onClear}
      arcsData={arcs}
      // Always a [start, end] pair: globe.gl drops the alpha of single colour strings.
      arcColor={(d: object) => {
        const a = d as ArcDatum;
        const solid = (alpha: number) => [withAlpha(a.color, alpha), withAlpha(a.color, alpha)];
        if (a.layer === 'local') return solid(activeTripId ? 0.12 : 0.45);
        if (isDimmed(a)) return solid(a.layer === 'pulse' ? 0 : 0.15);
        if (a.layer === 'pulse') return ['#ffffff', a.color];
        return [withAlpha(a.color, 0.35), withAlpha(a.color, 0.9)];
      }}
      arcStroke={(d) => {
        const a = d as ArcDatum;
        if (a.layer === 'local') return 0.25;
        return a.layer === 'pulse' ? 0.9 : 0.45;
      }}
      arcAltitude={(d) => (d as ArcDatum).altitude}
      arcDashLength={(d) => ((d as ArcDatum).layer === 'pulse' ? PULSE_LENGTH : 1)}
      arcDashGap={(d) => {
        const a = d as ArcDatum;
        // Leaves room for every other leg of the trip to play before this one repeats.
        return a.layer === 'pulse' ? a.legs + 1 - PULSE_LENGTH : 0;
      }}
      arcDashInitialGap={(d) => {
        const a = d as ArcDatum;
        return a.layer === 'pulse' ? a.index : 0;
      }}
      arcDashAnimateTime={(d) => ((d as ArcDatum).layer === 'pulse' ? LEG_ANIMATION_MS : 0)}
      arcsTransitionDuration={1200}
      ringsData={places}
      ringColor={(d: object) => {
        const color = KIND_COLORS[(d as Place).kind];
        return (t: number) => withAlpha(color, 0.8 * (1 - t));
      }}
      ringMaxRadius={(d) => (selectedIds.includes((d as Place).id) ? 5 : 2.5)}
      ringPropagationSpeed={1.5}
      ringRepeatPeriod={1600}
      // Sits above the country fill so the pulses aren't hidden under it.
      ringAltitude={0.006}
      htmlElementsData={htmlData}
      htmlElement={(d) =>
        'id' in d ? markers.get((d as Place).id)! : countryLabels.get((d as Country).name)!
      }
      htmlAltitude={0.01}
      htmlElementVisibilityModifier={(el, visible) => {
        el.style.opacity = visible ? '1' : '0';
        if (el instanceof HTMLButtonElement) el.style.pointerEvents = visible ? 'auto' : 'none';
      }}
      htmlTransitionDuration={0}
    />
  );
}
