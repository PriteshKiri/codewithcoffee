import Image from "next/image";
import Link from "next/link";

interface TalkLinks {
  post?: string;
  blog?: string;
  video?: string;
}

interface ContentCardProps {
  title: string;
  subtitle: string;
  image: string;
  link?: string;
  from?: string;
  badge?: string;
  post?: string;
  blog?: string;
  video?: string;
}

const BUTTON_CONFIG: Array<{ key: keyof TalkLinks; label: string }> = [
  { key: "post", label: "Post" },
  { key: "blog", label: "Blog" },
  { key: "video", label: "Video" },
];

export default function ContentCard({
  title,
  subtitle,
  image,
  link,
  from = "default",
  badge,
  post,
  blog,
  video,
}: ContentCardProps) {
  const cardSizeClass = from === "dev2"
    ? "w-full sm:w-[calc(50%-1rem)] sm:min-w-[280px] sm:max-w-[380px]"
    : from === "blog"
    ? "w-full sm:w-[calc(50%-0.5rem)] sm:min-w-0 sm:max-w-none"
    : from === "video"
    ? "w-full sm:w-[calc(25%-0.75rem)] sm:min-w-[220px] sm:max-w-[240px]"
    : "w-full sm:w-[calc(33.333%-1rem)] sm:min-w-[280px] sm:max-w-[280px]";

  const imageHeightClass = from === "dev2"
    ? "h-32"
    : from === "blog"
    ? "h-28 md:h-24"
    : from === "video"
    ? "h-44 md:h-32 "
    : "h-44 md:h-40";

  const links: TalkLinks = { post, blog, video };
  const presentButtons = BUTTON_CONFIG.filter(
    ({ key }) => typeof links[key] === "string" && links[key]!.length > 0,
  );
  const showButtons = presentButtons.length >= 2;

  // Fallback `link` if no buttons are shown: use the explicit `link` prop, or
  // the single available talk url (post → blog → video), in that order.
  const primaryLink =
    link || (presentButtons[0] ? links[presentButtons[0].key] : undefined);

  const cardInner = (
    <>
      {badge && (
        <div className="absolute top-[-0.5rem] right-[-0.5rem] bg-neutral-500/80 dark:bg-white/15 backdrop-blur-md text-white text-[10px] font-medium tracking-wide px-2 py-0.5 rounded-md border border-white/10 dark:border-white/20 shadow-md hover:shadow-lg transition-shadow z-10">
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
      <div className={from === "blog" ? "p-3" : "p-4"}>
        <h3
          className={`font-semibold mb-2 text-neutral-900 dark:text-neutral-100 group-hover:text-neutral-700 dark:group-hover:text-neutral-300 transition-colors leading-tight ${
            from === "blog" ? "text-sm line-clamp-2" : "text-lg"
          }`}
        >
          {title}
        </h3>
        <p
          className={`text-neutral-600 dark:text-neutral-400 line-clamp-2 ${
            from === "blog" ? "text-xs" : "text-sm"
          }`}
        >
          {subtitle}
        </p>

        {showButtons && (
          <div className="mt-3 flex flex-wrap gap-2">
            {presentButtons.map(({ key, label }) => (
              <Link
                key={key}
                href={links[key]!}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-medium px-3 py-1 rounded-full border border-neutral-300 dark:border-neutral-600 text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors no-underline"
              >
                {label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </>
  );

  const wrapperClass = `group block ${cardSizeClass} border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 rounded-lg hover:border-neutral-300 dark:hover:border-neutral-600 transition-all relative`;

  if (!showButtons && primaryLink) {
    return (
      <Link
        href={primaryLink}
        target="_blank"
        rel="noopener noreferrer"
        className={wrapperClass}
      >
        {cardInner}
      </Link>
    );
  }

  return <div className={wrapperClass}>{cardInner}</div>;
}
