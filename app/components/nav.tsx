'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = {
  '/': {
    name: 'home',
  },
  '/work': {
    name: 'work',
  },
  '/videos': {
    name: 'videos',
  },
  '/blog': {
    name: 'blog',
  },
  '/talks': {
    name: 'talks',
  },
  '/events': {
    name: 'events',
  },
  'https://priteshkiri.gumroad.com/l/cssflexbox': {
    name: 'ebook',
  },
  'https://www.youtube.com/watch?v=vGS7kfjCMlY&list=PL451ezMNl8yNanc6EY19g1_yFCWpKv8Ho': {
    name: 'podcasts',
  },
};

export function Navbar() {
  const pathname = usePathname();

  return (
    <aside className="-ml-[8px] mb-8 md:mb-16 tracking-tight sticky top-0 z-50 bg-white dark:bg-[#111010] py-4">
      <div>
        <nav
          className="flex flex-row items-start relative px-0 pb-0 fade md:overflow-auto scroll-pr-6 md:relative"
          id="nav"
        >
          <div className="flex flex-row flex-wrap space-x-0 pr-10">
            {Object.entries(navItems).map(([path, { name }]) => {
              const isActive = pathname === path;
              const isExternal = path.startsWith('http');
              
              return (
                <Link
                  key={path}
                  href={path}
                  target={isExternal ? '_blank' : undefined}
                  className={`transition-all hover:text-neutral-800 dark:hover:text-neutral-200 flex align-middle relative py-1 px-2 ${
                    isActive ? 'text-neutral-800 dark:text-neutral-200' : ''
                  }`}
                >
                  {name}
                  {isActive && (
                    <span className="absolute bottom-0 left-2 right-2 h-[2px] bg-neutral-800 dark:bg-neutral-200" />
                  )}
                </Link>
              );
            })}
          </div>
        </nav>
      </div>
    </aside>
  );
}
