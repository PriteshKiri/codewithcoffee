import Image from "next/image";
import Link from "next/link";

interface ContentCardProps {
  title: string;
  subtitle: string;
  image: string;
  link: string;
  from?: string;
  badge?: string;
}

export default function ContentCard({ title, subtitle, image, link, from = "default", badge }: ContentCardProps) {
  // Determine card size based on 'from' parameter
  const cardSizeClass = from === "dev2" 
    ? "w-full sm:w-[calc(50%-1rem)] min-w-[280px] max-w-[380px]" // Larger size for dev2
    : from === "video"
    ? "w-full sm:w-[calc(25%-0.75rem)] min-w-[220px] max-w-[240px]" // Smaller size for videos
    : "w-full sm:w-[calc(33.333%-1rem)] min-w-[280px] max-w-[280px]"; // Default size
  
  const imageHeightClass = from === "dev2" 
    ? "h-32" // Taller image for dev2
    : from === "video"
    ? "h-32" // Smaller height for videos (maintains 16:9 aspect ratio)
    : "h-40"; // Default image height

  return (
    <Link
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      className={`group block ${cardSizeClass} border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 rounded-lg hover:border-neutral-300 dark:hover:border-neutral-600 transition-all relative`}
    >
      {badge && (
        <div className="absolute top-[-0.5rem] right-[-0.5rem] bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-500 dark:to-purple-500 text-white text-xs font-semibold px-3 py-1.5 rounded-full shadow-lg hover:shadow-xl transition-shadow z-10">
          {badge}
        </div>
      )}
      <div className={`relative ${imageHeightClass} w-full overflow-hidden rounded-t-lg`}>
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-lg mb-2 text-neutral-900 dark:text-neutral-100 group-hover:text-neutral-700 dark:group-hover:text-neutral-300 transition-colors leading-tight">
          {title}
        </h3>
        <p className="text-sm text-neutral-600 dark:text-neutral-400 line-clamp-2">
          {subtitle}
        </p>
      </div>
    </Link>
  );
}
