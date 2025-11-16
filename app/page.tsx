import Link from "next/link";
import Image from "next/image";

import {
  FaGithub,
  FaHashnode,
  FaInstagram,
  FaLinkedin,
  FaProductHunt,
  FaXTwitter,
} from "react-icons/fa6";
import { GiSchoolBag } from "react-icons/gi";
import ChannelLink from "./components/channelLinks";
import ContentCard from "./components/contentCard";
import contentData from "./data/content.json";
// import ChannelLink from "./components/channelLink";

function ArrowIcon() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M2.07102 11.3494L0.963068 10.2415L9.2017 1.98864H2.83807L2.85227 0.454545H11.8438V9.46023H10.2955L10.3097 3.09659L2.07102 11.3494Z"
        fill="currentColor"
      />
    </svg>
  );
}

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
        {`as Community Manager, managing the `}
        <Link target="_blank" href="https://litmuschaos.io" className="my-link">
          LitmusChaos
        </Link>
        {` community (a CNCF incubating project). I have 4+ years of experince in tech. Apart from that I'm community head at `}
        <Link target="_blank" href="https://reactplay.io" className="my-link">
          Reactplay.io
        </Link>
        {` hosting monthly `}
        <Link target="_blank" href="https://www.meetup.com/reactplay-bengaluru/" className="my-link">
          meetups 
        </Link>
        {` and events in Bengaluru. `}
      </p>
      <div className="columns-1 sm:columns-3 gap-4 my-8">
        <div className="relative h-40 mb-4">
          <Image
            alt="Me speaking on stage at React Summit about the future of Next.js"
            src="/static/portfolio2.jpeg"
            fill
            sizes="(max-width: 768px) 213px, 33vw"
            priority
            className="rounded-lg object-cover"
          />
        </div>
        <div className="relative h-80 mb-4 sm:mb-0">
          <Image
            alt="Me, Lydia, and Delba filming the Next.js Conf keynote"
            src="/static/portfolio5.jpeg"
            fill
            sizes="(max-width: 768px) 213px, 33vw"
            priority
            className="rounded-lg object-cover object-[-16px] sm:object-center"
          />
        </div>
        <div className="relative h-40 sm:h-80 mb-4">
          <Image
            alt="Me standing on stage at Reactathon delivering the keynote"
            src="/static/portfolio3.jpeg"
            fill
            sizes="(max-width: 768px) 213px, 33vw"
            priority
            className="rounded-lg object-cover object-top sm:object-center"
          />
        </div>
        <div className="relative h-40 mb-4 sm:mb-0">
          <Image
            alt="Me standing on stage at SmashingConf giving a talk about my optimism for the web"
            src="/static/portfolio4.jpeg"
            fill
            sizes="(max-width: 768px) 213px, 33vw"
            priority
            className="rounded-lg object-cover"
          />
        </div>
        <div className="relative h-40 mb-4">
          <Image
            alt="Me and Guillermo Rauch on stage for Vercel Ship, answering questions from the Next.js community"
            src="/static/portfolio6.jpeg"
            fill
            sizes="(max-width: 768px) 213px, 33vw"
            priority
            className="rounded-lg object-cover"
          />
        </div>
        <div className="relative h-80">
          <Image
            alt="My badge on top of a pile of badges from a Vercel meetup we held"
            src="/static/portfolio1.jpeg"
            fill
            sizes="(min-width: 768px) 213px, 33vw"
            priority
            className="rounded-lg object-cover"
          />
        </div>
      </div>
      <div className="prose prose-neutral dark:prose-invert">
        <p>
        Writing content on <Link target="_blank" href="https://www.linkedin.com/in/pritesh-kiri" className="my-link">LinkedIn</Link> and <Link target="_blank" href="https://twitter.com/PriteshKiri" className="my-link">Twitter</Link> changed my life upside down. Now, I'm on a path to educate people about AI through my <Link target="_blank" href="https://www.instagram.com/pritesh_ai_/" className="my-link">video content</Link>.
        </p>
        <p>
        Apart from my professional work, I lead ReactPlay community, an open source React community, and I also vlog at conferences and share those videos on Humans of Tech.
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
      <div className="prose prose-neutral dark:prose-invert">
        <p>Here are my socials: </p>
      </div>
      <div className="my-4 flex flex-row space-x-2 w-full h-[auto] flex-wrap gap-y-2">
        <div className="border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 rounded flex items-center justify-between px-6 py-3">
          <a href="https://github.com/PriteshKiri">
            <FaGithub />
          </a>
        </div>
        <div className="border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 rounded flex items-center justify-between px-6 py-3">
          <a href="https://twitter.com/PriteshKiri">
            <FaXTwitter />
          </a>
        </div>
        <div className="border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 rounded flex items-center justify-between px-6 py-3">
          <a href="https://www.linkedin.com/in/pritesh-kiri">
            <FaLinkedin />
          </a>
        </div>
        <div className="border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 rounded flex items-center justify-between px-6 py-3">
          <a href="https://www.instagram.com/pritesh_ai_/">
            <FaInstagram />
          </a>
        </div>
        <div className="border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 rounded flex items-center justify-between px-6 py-3">
          <a href="https://www.showwcase.com/priteshkiri">
            <GiSchoolBag />
          </a>
        </div>

        <div className="border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 rounded flex items-center justify-between px-6 py-3">
          <a href="https://www.producthunt.com/@pritesh_kiri">
            <FaProductHunt />
          </a>
        </div>
        <div className="border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 rounded flex items-center justify-between px-6 py-3">
          <a href="https://priteshkiri.hashnode.dev/">
            <FaHashnode />
          </a>
        </div>
      </div>

      <ul className="flex flex-col md:flex-row mt-8 space-x-0 md:space-x-4 space-y-2 md:space-y-0 font-sm text-neutral-600 dark:text-neutral-300">
        <li>
          <a
            className="flex items-center hover:text-neutral-800 dark:hover:text-neutral-100 transition-all"
            rel="noopener noreferrer"
            target="_blank"
            href="https://www.linkedin.com/in/pritesh-kiri"
          >
            <ArrowIcon />
            <p className="h-7 ml-2">Let&apos;s connect!</p>
          </a>
        </li>
      </ul>
    </section>
  );
}
