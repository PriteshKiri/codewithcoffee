import React from "react";

type Partner = {
  name: string;
  src: string;
  href: string;
};

const partners: Partner[] = [
  { name: "Microsoft", src: "/static/partners/microsoft.svg", href: "https://www.microsoft.com" },
  { name: "Qdrant", src: "/static/partners/qdrant.svg", href: "https://qdrant.tech" },
  { name: "Weaviate", src: "/static/partners/weaviate.svg", href: "https://weaviate.io" },
  { name: "LambdaTest", src: "/static/partners/lambdatest.svg", href: "https://www.lambdatest.com" },
  { name: "Kanini", src: "/static/partners/kanini.svg", href: "https://kanini.com" },
  { name: "ANSR", src: "/static/partners/ansr.svg", href: "https://ansrsource.com" },
  { name: "Razorpay", src: "/static/partners/razorpay.png", href: "https://razorpay.com" },
  { name: "Elasticsearch", src: "/static/partners/elasticsearch.svg", href: "https://www.elastic.co" },
  { name: "MongoDB", src: "/static/partners/mongodb.svg", href: "https://www.mongodb.com" },
  { name: "Postman", src: "/static/partners/postman.svg", href: "https://www.postman.com" },
  { name: "The AI Collective", src: "/static/partners/aicollective.svg", href: "https://www.aicollective.com" },
  { name: "Harness", src: "/static/partners/harness.svg", href: "https://www.harness.io" },
  { name: "ToolJet", src: "/static/partners/tooljet.svg", href: "https://www.tooljet.com" },
  { name: "Kong", src: "/static/partners/kong.svg", href: "https://konghq.com" },
  { name: "Cast AI", src: "/static/partners/castai.svg", href: "https://cast.ai" },
  { name: "Portkey", src: "/static/partners/portkey.svg", href: "https://portkey.ai" },
  { name: "ZopDev", src: "/static/partners/zopdev.svg", href: "https://zop.dev" },
  { name: "ImageKit", src: "/static/partners/imagekit.svg", href: "https://imagekit.io" },
  { name: "Sense HQ", src: "/static/partners/sensehq.svg", href: "https://www.sensehq.com" },
  { name: "Paytm", src: "/static/partners/paytm.svg", href: "https://paytm.com" },
  { name: "Contentstack", src: "/static/partners/contentstack.png", href: "https://www.contentstack.com" },
  { name: "DevRev", src: "/static/partners/devrev.svg", href: "https://devrev.ai" },
  { name: "Flipkart", src: "/static/partners/flipkart.svg", href: "https://www.flipkart.com" },
  { name: "Canonical", src: "/static/partners/canonical.svg", href: "https://canonical.com" },
];

const rowCount = 3;
const perRow = Math.ceil(partners.length / rowCount);
const rows: Partner[][] = Array.from({ length: rowCount }, (_, i) =>
  partners.slice(i * perRow, (i + 1) * perRow)
);

function MarqueeRow({
  items,
  direction,
}: {
  items: Partner[];
  direction: "left" | "right";
}) {
  const loop = [...items, ...items];

  return (
    <div className="partner-marquee">
      <div
        className={`partner-marquee-track ${
          direction === "left" ? "is-left" : "is-right"
        }`}
      >
        {loop.map((p, idx) => {
          const isClone = idx >= items.length;
          return (
            <a
              key={`${p.name}-${idx}`}
              href={p.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={p.name}
              aria-hidden={isClone ? true : undefined}
              tabIndex={isClone ? -1 : 0}
              title={p.name}
              className="flex h-10 w-28 shrink-0 items-center justify-center"
            >
              <img
                src={p.src}
                alt={p.name}
                loading="lazy"
                draggable={false}
                className="max-h-6 max-w-full object-contain opacity-70 grayscale transition duration-300 hover:opacity-100 hover:grayscale-0 select-none"
              />
            </a>
          );
        })}
      </div>
    </div>
  );
}

export default function PartnerMarquee() {
  return (
    <section className="my-12 w-full" aria-label="Partnered with">
      <h2 className="font-medium text-2xl mb-8 tracking-tighter text-center">
        Partnered with
      </h2>
      <div className="flex flex-col gap-2">
        <MarqueeRow items={rows[0]} direction="left" />
        <MarqueeRow items={rows[1]} direction="right" />
        <MarqueeRow items={rows[2]} direction="left" />
      </div>
    </section>
  );
}
