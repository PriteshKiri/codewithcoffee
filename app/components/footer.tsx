import Link from "next/link";
import {
  FaGithub,
  FaHashnode,
  FaInstagram,
  FaLinkedin,
  FaProductHunt,
  FaXTwitter,
} from "react-icons/fa6";

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

export default function Footer() {
  return (
    <footer className="mt-16">
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
    </footer>
  );
}
