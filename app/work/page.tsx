import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Work",
  description: "A summary of my work and contributions.",
};

async function Stars() {
  let res = await fetch("https://api.github.com/repos/vercel/next.js");
  let json = await res.json();
  let count = Math.round(json.stargazers_count / 1000);
  return `${count}k stars`;
}

export default function WorkPage() {
  return (
    <section>
      <h1 className="font-medium text-2xl mb-8 tracking-tighter">my work</h1>
      <div className="prose prose-neutral dark:prose-invert">
      <hr className="my-6 border-neutral-100 dark:border-neutral-800" />
        <h2 className="font-medium text-xl mb-1 tracking-tighter">
          <a href="https://www.tooljet.com">ToolJet</a>
        </h2>
        <p className="text-neutral-600 dark:text-neutral-400 text-sm">
          Developer Advocate - (May 2024 - Present) - 8 mo
        </p>
        <ul className="flex flex-col gap-y-3 list-disc mt-4">
        <li>Grew the ToolJet community to 5k+ members through consistent engagement and support.</li>
    <li>Collaborated with Elasticsearch, LambdaTest, Portkey, Qdrant, and many more.</li>
    <li>Hosted monthly community calls on ToolJet’s YouTube channel, building use-case-based apps.</li>
    <li>Conducted customer demos to showcase ToolJet's capabilities.</li>
    <li>Actively helped users and contributors by answering questions and resolving issues in the Slack community.</li>
    <li>Increased ToolJet's GitHub stars from 28k to 33.5k by supporting community contributions.</li>
    <li>Managed ToolJet's community GitHub repository, creating and managing over 80 contribution issues and pull requests from contributors.</li>
    <li>Produced video tutorials to help users get started with ToolJet.</li>
    <li>Wrote technical documentation that made ToolJet easier to understand and use for everyone.</li>
    <li>Collaborated with technical newsletters for brand awareness.</li>
    <li>Gathered valuable feedback from the community and helped the product and engineering team with product improvements.</li>
        </ul>

        <hr className="my-6 border-neutral-100 dark:border-neutral-800" />
        <h2 className="font-medium text-xl mb-1 tracking-tighter">
          <a href="https://www.sleeksky.com">Locofy AI</a>
        </h2>
        <p className="text-neutral-600 dark:text-neutral-400 text-sm">
          Developer Advocate - (March 2024 - April 2024) - 2 mo
        </p>
        <ul className="flex flex-col gap-y-3 list-disc mt-4">
          <li>Worked on building detailed documentation for the product.</li>
          <li>
            Edited and created live stream breakdown clips on Davinci Resolve
          </li>
          <li>Recorded and edited tutorials for different product features</li>
          <li>Worked on community engagement and user queries on discord.</li>
          <li> Intensely involved in testing new features for the product</li>
          <li>Worked with the Growth team to organize offline meetups along with managing sponsors, swags, and beverages.</li>
          <li>
            Created the social media calendar and also the content for Linkedin,
            Twitter and Youtube.
          </li>
        </ul>

        <hr className="my-6 border-neutral-100 dark:border-neutral-800" />
        <h2 className="font-medium text-xl mb-1 tracking-tighter">
          <a href="https://www.sleeksky.com">Sleeksky</a>
        </h2>
        <p className="text-neutral-600 dark:text-neutral-400 text-sm">
          Sofware Engineer - (Jan 2023 - Feb 204) - 1 yr 1 mo
        </p>
        <ul className="flex flex-col gap-y-3 list-disc mt-4">
          <li>
            Worked on large-scale applications, building high-performant
            features with Angular
          </li>
          <li>
            Closely worked with CEO, <b>brainstorming</b> and building headless{" "}
            <b>CMS features</b> with React and Material UI
          </li>
          <li>Worked on enhancing the Ejs website UIs for various products</li>
          <li>
            Helped the organization with creating highly engaging{" "}
            <b>technical content</b> on their LinkedIn page
          </li>
        </ul>
        <hr className="my-6 border-neutral-100 dark:border-neutral-800" />
        <h2 className="font-medium text-xl mb-1 tracking-tighter">
          <a href="https://www.sleeksky.com">Cofactory AI</a>
        </h2>
        <p className="text-neutral-600 dark:text-neutral-400 text-sm">
          Sofware Engineer - (Aug 2023 - Jan 2024) - 6 months
        </p>
        <ul className="flex flex-col gap-y-3 list-disc mt-4">
          <li>
            Closely worked with Cofounders to build multiple AI products from
            scratch.
          </li>
          <li>
            Led a team of engineers focused on the front-end features of the AI
            website builder tool.
          </li>
          <li>
            Developed major features like user onboarding flow, interactive AI
            content generation module, and optimized Google Ads integration for
            the multi tenant AI website builder.
          </li>
          <li>
            Worked intensively on making important product decisions with the
            product and design team.
          </li>
          <li>
            Developed an AI hotel Chat application along with Open AI
            integration with Next JS.
          </li>
          <li>
            Developed important features like multi-navigation, organization
            onboarding flow, and Open AI integrations for the AI grant
            application tool.
          </li>
        </ul>

        <hr className="my-6 border-neutral-100 dark:border-neutral-800" />
        <h2 className="font-medium text-xl mb-1 tracking-tighter">
          <a href="https://reactplay.io/">ReactPlay</a>{" "}
        </h2>
        <p className="text-neutral-600 dark:text-neutral-400 text-sm">
          Community manager/Organizer - (Feb 2023 - Present) - 1 yr 3 mo
        </p>
        <ul className="flex flex-col gap-y-3 list-disc mt-4">
          <li>
            Worked on building plays on the platform and made major UI fixes and
            added features like filters, search on the{" "}
            <Link href="https://hustles.reactplay.io/events/23/hackrplay">
              Hack-R-Play{" "}
            </Link>{" "}
            ( Hackathon platform of Reactplay )
          </li>
          <li>
            Skillfully managed Reactplay&apos;s social media platforms ({" "}
            <Link href="https://www.linkedin.com/company/reactplay/">
              LinkedIn
            </Link>{" "}
            ,<Link href="https://twitter.com/reactplayio">Twitter </Link>,
            <Link href="https://discord.gg/vrTxWUP8Am">Discord</Link> ,
            <Link href="https://www.youtube.com/@tapasadhikary/streams">
              YouTube{" "}
            </Link>{" "}
            ), driving significant community growth to over{" "}
            <b>7,000+ members.</b>
          </li>
          <li>
            Designed visually appealing posters for community events, Twitter
            spaces, YT lives, discord events etc.and posted super engaging
            content on the socials.
          </li>
          <li>Hosted 5+ Twitter Spaces with renowned tech speakers</li>
          <li>
            Launched and hosted an initiative <b>Reactplay Live</b>, an online
            technical meetup of Reactplay
          </li>
          <li>
            Managed <b>Hack-R-Play</b> (Hackathon platform of Reactplay) from
            start to finish, including participant recruitment, content
            creation, and event coordination etc.
          </li>
          <li>
            Started the initiative of <b>Reactplay Banglore,</b> our offline
            technical meetups
          </li>
          <li>
            Managed these events end-to-end from scouting for venue sponsors to
            Hosting the event.
          </li>
          <li>
            Grown the offline community from <b>0 to 730+ </b>in just two months
          </li>
          <li>
            Successfully completed 2 events with <b>400+ RSVPs</b> and 8+
            amazing speakers
          </li>
        </ul>

        <hr className="my-6 border-neutral-100 dark:border-neutral-800" />
        <h2 className="font-medium text-xl mb-1 tracking-tighter">
          <a href="https://www.thehumansoftech.com/">Humans of Tech</a>
        </h2>
        <p className="text-neutral-600 dark:text-neutral-400 text-sm">
          Founder - (Sep 2023 - Present) - 6 mos
        </p>

        <ul className="flex flex-col gap-y-3 list-disc mt-4">
          <li>
            Managing the content creation and content flow cross different
            channels like spotify, youtube, instagram and blogs on the website
            and hashnode.
          </li>
          <li>
            Managing a team for timely delivering the content in the respective
            social channels.
          </li>
        </ul>

        <hr className="my-6 border-neutral-100 dark:border-neutral-800" />
        <h2 className="font-medium text-xl mb-1 tracking-tighter">
          <a href="https://www.showwcase.com/">Showwcase</a>
        </h2>
        <p className="text-neutral-600 dark:text-neutral-400 text-sm">
          Founding creator - (May 2023 - Nov 2023) - 7 mos
        </p>

        <ul className="flex flex-col gap-y-3 list-disc">
          <li>
            Posted Highly technical and engaging content on Web development
            concepts
          </li>
          <li>
            Wrote <b>39 + blogs </b> on the platform
          </li>
        </ul>

        <hr className="my-6 border-neutral-100 dark:border-neutral-800" />
        <h2 className="font-medium text-xl mb-1 tracking-tighter">
          {" "}
          <a href="https://www.unschool.in/">Unschool-(Backed by YC)</a>
        </h2>
        <p className="text-neutral-600 dark:text-neutral-400 text-sm">
          Jr. Fullstack developer - (Dec 2021 - Jan 2023) - 1 year
        </p>

        <ul className="flex flex-col gap-y-3 list-disc mt-4">
          <li>
            Have designed and developed an internship portal and admin panel
            built on react and firebase with a tight timeline of 48 hours.
          </li>
          <li>
            Developed and deployed <b>4+ new product-line</b> and responsive
            landing pages in the current codebase written in a react-based
            framework resulting in a traffic increase of 5x.
          </li>
          <li>
            Have been POC for the tech partners like Leadsquared, Chargee,
            Razorpay, Dyte, and many more for the integration with the web app.
          </li>
          <li>
            <b>Collaborated</b> with the tech teams for maintaining the codebase
            and completing projects before the deadline.
          </li>
          <li>
            Working closely with <b>marketing, SEO, and product</b> team for
            improving the website ranking on google and for optimizing the user
            journey on the web app.
          </li>
          <li>
            Have been awarded <b> employee of the quarter</b> for exceptional
            work on solely managing the entire tech department of the
            organization.
          </li>
          <li>
            Managing the entire Tech department and working{" "}
            <b>closely with co-founders</b> for implementing solutions and
            features to improve the user experience of the product.
          </li>
        </ul>

        <p className="text-neutral-600 dark:text-neutral-400 text-sm mt-6">
          Sales and Marketing executive - (June 2021 - Nov 2021) - 6 mo
        </p>
        <ul className="flex flex-col gap-y-3 list-disc mt-4">
          <li>
            Handling a team of <b>500+ interns</b> for markeing and sales.
          </li>
          <li>
            Handling <b>50+ Team Leaders</b> for boosting revenue for the
            company.
          </li>
          <li>
            Ran WhatsApp and LinkedIn marketing campaigns in{" "}
            <b>60+ Universities</b> for lead generation.
          </li>
          <li>
            Using strategies and Ideas to achieve targets before the deadline.
          </li>
          <li>
            Impacted <b>150+ students</b> to get upskilled.
          </li>
        </ul>
      </div>
    </section>
  );
}
