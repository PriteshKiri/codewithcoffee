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
        hey, I&apos;m Pritesh 👋
      </h1>
      <p className="prose prose-neutral dark:prose-invert">
        {`A creative and artistic software developer, a community builder, a tech content creator and a tech speaker. I currently `}
        <Link href="/work">work</Link>
        {` as a software engineer at `}
        <Link href="https://sleeksky.com">Sleeksky</Link>
        {`. Apart from that I'm community manager/organizer at `}
        <Link href="https://reactplay.io">Reactplay.io</Link>
        {` and founder at `}
        <Link href="https://thehumansoftech.com">Humans of Tech</Link>.
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
          I create tech educational content on web development topics for
          developers on my social media channels like twitter, linkedin and
          Instagram in the form of threads, crousel posts, tech blogs and video
          content.
        </p>
      </div>
      <div className="my-8 flex flex-col sm:flex-row space-x-0 sm:space-x-4 space-y-4 sm:space-y-0 w-full">
        <ChannelLink
          img="/static/__reactplay.png"
          name="Reactlplay"
          link="https://www.youtube.com/@leerob"
          sub={"Opensource community"}
        />
        <ChannelLink
          img="/static/__thot.jpg"
          name="Humans of Tech"
          sub={"Tech podcasts"}
          link="https://www.youtube.com/@vercelhq"
        />
      </div>
      <div className="prose prose-neutral dark:prose-invert">
        <p>
          Apart from this, I work on designing poster, creating content
          calendar, scheduling posts on twitter and linkedIn, managing events
          like, discord tech talks,twitter spaces, hackathons, college
          workshops, offline and online tech meetups and many more.And also
          getting sponsors for these events of <b>Reactplay</b>
        </p>
        <p>
          I&apos;m founder at <b>Humans of tech</b>, world&apos;s first tech
          storytelling platform, where I invite super talented tech people who
          has an inspiring story to tell. I document these stories in audio,
          video and text format on platforms like{" "}
          <Link href="https://open.spotify.com/show/3x2H8IQKlHw71JzQA4SgBH">
            spotify
          </Link>{" "}
          , <Link href="https://www.youtube.com/@TheHumansOfTech">youtube</Link>{" "}
          ,{" "}
          <Link href="https://www.instagram.com/thehumansoftech/">
            instagram
          </Link>{" "}
          , <Link href="https://twitter.com/thehumansoftech">twitter</Link> and{" "}
          <Link href="https://www.thehumansoftech.com/blog">blogs</Link> . I
          have a team who helps me manage these things.
        </p>
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
          link="https://www.tasktunes.net/signin"
        />
        <ChannelLink
          img="/static/_sxs.png"
          name="ShowwcaseXS"
          link="https://showwcasexs.vercel.app/"
          sub={"A chrome extension to use Showwcase on any webpage"}
        />
      
        <ChannelLink
          img="/static/sgpt.png"
          name="ScreenGPT"
          sub={"coming soon...."}
          link="#"
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
          <a href="https://www.instagram.com/codewithcoffee.in/">
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
      <div className="prose prose-neutral dark:prose-invert">
        <p>
          This website has made from an open source portfolio of a person who is
          my inspiration in tech world,
          <Link href="https://twitter.com/leeerob"> Lee Robinson</Link>.
        </p>
      </div>
      <ul className="flex flex-col md:flex-row mt-8 space-x-0 md:space-x-4 space-y-2 md:space-y-0 font-sm text-neutral-600 dark:text-neutral-300">
        <li>
          <a
            className="flex items-center hover:text-neutral-800 dark:hover:text-neutral-100 transition-all"
            rel="noopener noreferrer"
            target="_blank"
            href="https://twitter.com/priteshkiri"
          >
            <ArrowIcon />
            <p className="h-7 ml-2">Let&apos;s connect!</p>
          </a>
        </li>
      </ul>
    </section>
  );
}
