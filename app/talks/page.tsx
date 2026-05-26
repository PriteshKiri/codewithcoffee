import ContentCard from "../components/contentCard";
import Footer from "../components/footer";
import talksData from "../data/talks.json";

interface Talk {
  title: string;
  subtitle: string;
  image: string;
  post?: string;
  blog?: string;
  video?: string;
  year: number;
}

export default function TalksPage() {
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
            post={talk.post}
            blog={talk.blog}
            video={talk.video}
            from="default"
          />
        ))}
      </div>

      <Footer />
    </section>
  );
}
