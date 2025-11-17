import ContentCard from "../components/contentCard";
import Footer from "../components/footer";
import talksData from "../data/talks.json";

interface Talk {
  title: string;
  subtitle: string;
  image: string;
  link: string;
  year: number;
}

export default function TalksPage() {
  // Flatten all talks from all years into a single array
  const allTalks: Talk[] = Object.values(talksData).flat();

  return (
    <section>
      <h1 className="font-medium text-2xl mb-8 tracking-tighter">
        my talks
      </h1>
      <p className="prose prose-neutral dark:prose-invert mb-8">
        I love speaking at conferences and meetups about CNCF, chaos engineering, frontend development, React, AI, MCP servers, and community building. Here are some of my talks where I share my knowledge and experiences with the tech community.
      </p>
      <div className="flex flex-wrap gap-4">
        {allTalks.map((talk) => (
          <ContentCard
            key={crypto.randomUUID()}
            title={talk.title}
            subtitle={talk.subtitle}
            image={talk.image}
            link={talk.link}
            from="default"
          />
        ))}
      </div>

      <Footer />
    </section>
  );
}
