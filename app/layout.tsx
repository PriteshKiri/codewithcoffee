import { Navbar } from './components/nav';
import './globals.css';
import type { Metadata } from 'next';


export const metadata: Metadata = {
  metadataBase: new URL('https://codewithcoffee.in'),
  title: {
    default: 'Pritesh Kiri - DevRel Engineer at Harness',
    template: '%s | Pritesh Kiri',
  },
  description:
    'Pritesh Kiri, DevRel Engineer at Harness and LitmusChaos maintainer. Talks, videos, and blogs on chaos engineering, MCP, AI agents, and developer communities.',
  openGraph: {
    title: 'Pritesh Kiri - DevRel Engineer at Harness',
    description:
      'Talks, videos, and blogs on chaos engineering, MCP, AI agents, and developer communities. Speaker, LitmusChaos maintainer, and AI Dev Circle organizer.',
    url: 'https://codewithcoffee.in',
    siteName: 'Pritesh Kiri',
    locale: 'en_US',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  twitter: {
    title: 'Pritesh Kiri - DevRel Engineer at Harness',
    description:
      'Talks, videos, and blogs on chaos engineering, MCP, AI agents, and developer communities.',
    card: 'summary_large_image',
    creator: '@PriteshKiri',
  },
};


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={
        'text-black bg-white dark:text-white dark:bg-[#111010]'
 
    }
    >
      <head>
      </head>
      <body className="antialiased max-w-2xl mb-40 flex flex-col md:flex-row mx-4 mt-8 lg:mx-auto">
        <main className="flex-auto min-w-0 mt-6 flex flex-col px-2 md:px-0">
          <Navbar />
          {children}
        </main>
      </body>
    </html>
  );
}