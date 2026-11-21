import placesData from '../data/places.json';
import talksData from '../data/talks.json';
import eventsData from '../data/events.json';
import tripsData from '../data/trips.json';

export const HOME_PLACE = 'bengaluru';

export type VisitKind = 'talk' | 'event' | 'travel';

export interface VisitLink {
  label: string;
  href: string;
}

export interface Visit {
  kind: VisitKind;
  title: string;
  image?: string;
  year?: number;
  links: VisitLink[];
}

export interface Place {
  id: string;
  city: string;
  country: string;
  lat: number;
  lng: number;
  isHome: boolean;
  kind: VisitKind;
  visits: Visit[];
}

export interface TripLeg {
  from: string;
  to: string;
  index: number;
  // Bumped when the same two cities are connected again, so return legs don't overlap.
  lift: number;
}

export interface Trip {
  id: string;
  title: string;
  year?: number;
  color: string;
  stops: string[];
  legs: TripLeg[];
}

interface LinkedEntry {
  title: string;
  image?: string;
  year?: number;
  place?: string;
  post?: string;
  blog?: string;
  video?: string;
  link?: string;
}

interface TripEntry {
  id: string;
  title: string;
  year?: number;
  color: string;
  stops: string[];
  image?: string;
  link?: string;
}

type PlaceInfo = { city: string; country: string; lat: number; lng: number };

const PLACES = placesData as Record<string, PlaceInfo>;
const TRIPS = tripsData as TripEntry[];
const KIND_PRIORITY: VisitKind[] = ['talk', 'event', 'travel'];

function assertPlace(id: string, where: string) {
  if (!PLACES[id]) {
    throw new Error(`Unknown place "${id}" on "${where}". Add it to app/data/places.json.`);
  }
}

function linksOf(entry: LinkedEntry): VisitLink[] {
  return (
    [
      ['Post', entry.post],
      ['Blog', entry.blog],
      ['Video', entry.video],
      ['Link', entry.link],
    ] as const
  )
    .filter(([, href]) => href)
    .map(([label, href]) => ({ label, href: href! }));
}

function byYearDesc(data: Record<string, LinkedEntry[]>): LinkedEntry[] {
  return Object.keys(data)
    .sort()
    .reverse()
    .flatMap((year) => data[year]);
}

export function buildPlaces(): Place[] {
  const visitsByPlace = new Map<string, Visit[]>();

  const add = (id: string, kind: VisitKind, entry: LinkedEntry) => {
    assertPlace(id, entry.title);
    const visits = visitsByPlace.get(id) ?? [];
    visits.push({
      kind,
      title: entry.title,
      image: entry.image,
      year: entry.year,
      links: linksOf(entry),
    });
    visitsByPlace.set(id, visits);
  };

  // Talks and events without a `place` happened in the home city.
  byYearDesc(talksData as Record<string, LinkedEntry[]>).forEach((t) => add(t.place ?? HOME_PLACE, 'talk', t));
  byYearDesc(eventsData as Record<string, LinkedEntry[]>).forEach((e) => add(e.place ?? HOME_PLACE, 'event', e));
  TRIPS.forEach((trip) =>
    new Set(trip.stops.filter((id) => id !== HOME_PLACE)).forEach((id) => add(id, 'travel', trip)),
  );

  return Array.from(visitsByPlace, ([id, visits]) => ({
    id,
    ...PLACES[id],
    isHome: id === HOME_PLACE,
    kind: KIND_PRIORITY.find((k) => visits.some((v) => v.kind === k))!,
    visits,
  })).sort((a, b) => Number(b.isHome) - Number(a.isHome) || b.visits.length - a.visits.length);
}

export function buildTrips(): Trip[] {
  return TRIPS.map((trip) => {
    trip.stops.forEach((id) => assertPlace(id, trip.title));
    const seen = new Map<string, number>();
    const legs = trip.stops.slice(1).map((to, index) => {
      const from = trip.stops[index];
      const pair = [from, to].sort().join('|');
      const lift = seen.get(pair) ?? 0;
      seen.set(pair, lift + 1);
      return { from, to, index, lift };
    });
    return {
      id: trip.id,
      title: trip.title,
      year: trip.year,
      color: trip.color,
      stops: trip.stops,
      legs,
    };
  });
}
