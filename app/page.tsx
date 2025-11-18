import Link from "next/link";
import Image from "next/image";

import ChannelLink from "./components/channelLinks";
import ContentCard from "./components/contentCard";
import Footer from "./components/footer";
import contentData from "./data/content.json";

export default function Page() {
  return (
    <section>
      <h1 className="font-medium text-2xl mb-8 tracking-tighter">
        hey,&nbsp;&nbsp;I&apos;m Pritesh 👋
      </h1>
      <p className="prose prose-neutral dark:prose-invert">
        {`I'm a developer by heart. I love creating videos, building communities, and speaking/hosting events. I work at `}
        <Link target="_blank" href="https://www.harness.io/" className="my-link">
          Harness
        </Link>
        {` as Community Manager, managing the `}
        <Link target="_blank" href="https://litmuschaos.io" className="my-link">
          LitmusChaos
        </Link>
        {` community (a CNCF incubating project). I have 4+ years of experince in tech. I'm also the community head at `}
        <Link target="_blank" href="https://reactplay.io" className="my-link">
          Reactplay.io
        </Link>
        {` hosting monthly tech `}
        <Link target="_blank" href="https://www.meetup.com/reactplay-bengaluru/" className="my-link">
          meetups 
        </Link>
        {` and events in Bengaluru. `}
      </p>
      <div className="columns-1 sm:columns-3 gap-4 my-8">
        <div className="relative h-40 mb-4">
          <Image
            alt="Me speaking on stage at React Summit about the future of Next.js"
            src="/static/3.JPG"
            fill
            sizes="(max-width: 768px) 213px, 33vw"
            priority
            className="rounded-lg object-cover"
          />
        </div>
        <div className="relative h-80 mb-4 sm:mb-0">
          <Image
            alt="Me, Lydia, and Delba filming the Next.js Conf keynote"
            src="/static/6.JPG"
            fill
            sizes="(max-width: 768px) 213px, 33vw"
            priority
            className="rounded-lg object-cover object-[-16px] sm:object-center"
          />
        </div>
        <div className="relative h-40 sm:h-80 mb-4">
          <Image
            alt="Me standing on stage at Reactathon delivering the keynote"
            src="/static/2.JPG"
            fill
            sizes="(max-width: 768px) 213px, 33vw"
            priority
            className="rounded-lg object-cover object-top sm:object-center"
          />
        </div>
        <div className="relative h-40 mb-4 sm:mb-0">
          <Image
            alt="Me standing on stage at SmashingConf giving a talk about my optimism for the web"
            src="/static/5.jpg"
            fill
            sizes="(max-width: 768px) 213px, 33vw"
            priority
            className="rounded-lg object-cover"
          />
        </div>
        <div className="relative h-40 mb-4">
          <Image
            alt="Me and Guillermo Rauch on stage for Vercel Ship, answering questions from the Next.js community"
            src="/static/6_.jpg"
            fill
            sizes="(max-width: 768px) 213px, 33vw"
            priority
            className="rounded-lg object-cover"
          />
        </div>
        <div className="relative h-80">
          <Image
            alt="My badge on top of a pile of badges from a Vercel meetup we held"
            src="/static/4.JPG"
            fill
            sizes="(min-width: 768px) 213px, 33vw"
            priority
            className="rounded-lg object-cover"
          />
        </div>
      </div>

      <div className="prose prose-neutral dark:prose-invert">
        <p>
        I’m a fitness enthusiast from Gujarat who loves hitting the gym and being outdoors. I like keeping life active, simple, and full of good energy.
        </p>
      </div>
      <div className="prose prose-neutral dark:prose-invert">
        <p>
        Writing content on <Link target="_blank" href="https://www.linkedin.com/in/pritesh-kiri" className="my-link">LinkedIn</Link> and <Link target="_blank" href="https://twitter.com/PriteshKiri" className="my-link">Twitter</Link> changed my life upside down. Now, I&apos;m on a path to educate people about AI through my <Link target="_blank" href="https://www.instagram.com/pritesh_ai_/" className="my-link">video content</Link>.
        </p>
        <p>
        Apart from my professional work, I lead     <Link target="_blank" href="https://reactplay.io" className="my-link">
          Reactplay.io
        </Link> community, an open source React community, and I also vlog at conferences and share those videos on Humans of Tech YouTube channel.
        </p>
      </div>
      <div className="my-8 flex flex-col sm:flex-row space-x-0 sm:space-x-4 space-y-4 sm:space-y-0 w-full">
        <ChannelLink
          img="/static/__reactplay.png"
          name="Reactlplay"
          link="https://reactplay.io/"
          sub={"Opensource community"}
        />
        <ChannelLink
          img="/static/__thot.jpg"
          name="Humans of Tech"
          sub={"Conference Vlogging"}
          link="https://www.youtube.com/@TheHumansOfTech"
        />
      </div>

      {/* Featured Videos Section */}
      <h2 className="font-medium text-2xl mb-8 tracking-tighter">
        Featured Videos
      </h2>
      <div className="my-8 flex flex-row flex-wrap gap-4 w-full">
        {contentData.featuredVideos.map((video) => (
          <ContentCard
            key={crypto.randomUUID()}
            title={video.title}
            subtitle={video.subtitle}
            image={video.image}
            link={video.link}
            from={video.from}
          />
        ))}
      </div>
      <div className="flex justify-start mb-8">
        <Link 
          href="/videos"
          className="text-sm font-medium text-neutral-600 dark:text-neutral-300 hover:text-neutral-800 dark:hover:text-neutral-100 transition-all px-4 py-2 no-underline"
        >
          Explore More →
        </Link>
      </div>

      {/* Featured Blogs Section */}
      <h2 className="font-medium text-2xl mb-8 tracking-tighter">
        Featured Blogs
      </h2>
      <div className="my-8 flex flex-row flex-wrap gap-4 w-full">
        {contentData.featuredBlogs.map((blog) => (
          <ContentCard
            key={crypto.randomUUID()}
            title={blog.title}
            subtitle={blog.subtitle}
            image={blog.image}
            link={blog.link}
            from={blog.from}
          />
        ))}
      </div>
      <div className="flex justify-start mb-8">
        <Link 
          href="/blog"
          className="text-sm font-medium text-neutral-600 dark:text-neutral-300 hover:text-neutral-800 dark:hover:text-neutral-100 transition-all px-4 py-2 no-underline"
        >
          Explore More →
        </Link>
      </div>

      {/* Featured Talks Section */}
      <h2 className="font-medium text-2xl mb-8 tracking-tighter">
        Featured Talks
      </h2>
      <div className="my-8 flex flex-row flex-wrap gap-4 w-full">
        {contentData.featuredTalks.map((talk) => (
          <ContentCard
            key={crypto.randomUUID()}
            title={talk.title}
            subtitle={talk.subtitle}
            image={talk.image}
            link={talk.link}
            from={talk.from}
          />
        ))}
      </div>
      <div className="flex justify-start mb-8">
        <Link 
          href="/talks"
          className="text-sm font-medium text-neutral-600 dark:text-neutral-300 hover:text-neutral-800 dark:hover:text-neutral-100 transition-all px-4 py-2 no-underline"
        >
          Explore More →
        </Link>
      </div>

      {/* Featured Events Section */}
      <h2 className="font-medium text-2xl mb-8 tracking-tighter">
        Featured Events
      </h2>
      <div className="my-8 flex flex-row flex-wrap gap-4 w-full">
        {contentData.featuredEvents.map((event) => (
          <ContentCard
            key={crypto.randomUUID()}
            title={event.title}
            subtitle={event.subtitle}
            image={event.image}
            link={event.link}
            from={event.from}
          />
        ))}
      </div>
      <div className="flex justify-start mb-8">
        <Link 
          href="/events"
          className="text-sm font-medium text-neutral-600 dark:text-neutral-300 hover:text-neutral-800 dark:hover:text-neutral-100 transition-all px-4 py-2 no-underline"
        >
          Explore More →
        </Link>
      </div>

      <div className="prose prose-neutral dark:prose-invert">
        <p>
          I love building and shipping tech products, here are some of my
          products.
        </p>
      </div>
      <div className="my-8 flex flex-col sm:flex-row flex-wrap gap-y-2 w-full">
        <ChannelLink
          img="/static/__hashx.png"
          name="HashX"
          sub={"Access Hashnode blogs on every website"}
          link="https://hashx.vercel.app"
        />
        <ChannelLink
          img="/static/__tasktunes.jpeg"
          name="Tasktunes"
          sub={"One stop to your productivity (built with appwrite)"}
          link="https://tasktunes.vercel.app"
        />
        <ChannelLink
          img="/static/_sxs.png"
          name="ShowwcaseXS -  Launched on Product hunt"
          link="https://showwcasexs.vercel.app/"
          sub={"A chrome extension to use Showwcase on any webpage"}
        />

      </div>

      <Footer />
    </section>
  );
}
