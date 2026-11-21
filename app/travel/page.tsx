import type { Metadata } from 'next';
import Footer from '../components/footer';
import TravelGlobe from '../components/travelGlobe';
import { buildPlaces, buildTrips } from './places';

export const metadata: Metadata = {
  title: 'Travel',
  description: 'Places I have spoken at, hosted events in, and travelled to.',
};

export default function TravelPage() {
  const places = buildPlaces();
  const trips = buildTrips();

  return (
    <>
      <section className="mb-8">
        <h1 className="font-medium text-2xl mb-8 tracking-tighter">travel</h1>
        <p className="prose prose-neutral dark:prose-invert">
          Every talk, meetup, and trip on one globe. Bengaluru is home. Pick a trip to replay the
          route stop by stop, or click any city to see what happened there.
        </p>
      </section>
      <TravelGlobe places={places} trips={trips} />
      <Footer />
    </>
  );
}
