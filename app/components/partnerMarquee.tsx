import React from "react";

type Partner = {
  name: string;
  src: string;
  href: string;
};

const partners: Partner[] = [
  { name: "Microsoft", src: "/static/partner_img/logo-microsoft.png", href: "https://www.microsoft.com" },
  { name: "IBM", src: "/static/partner_img/logo-ibm.png", href: "https://www.ibm.com" },
  { name: "Qdrant", src: "/static/partner_img/logo-qdrant.png", href: "https://qdrant.tech" },
  { name: "Weaviate", src: "/static/partner_img/logo-weaviate.png", href: "https://weaviate.io" },
  { name: "LambdaTest", src: "/static/partner_img/logo-lambdatest.png", href: "https://www.lambdatest.com" },
  { name: "Kanini", src: "/static/partner_img/logo-kanini.png", href: "https://kanini.com" },
  { name: "ANSR", src: "/static/partner_img/ansr.png", href: "https://ansrsource.com" },
  { name: "Amadeus", src: "/static/partner_img/amadeus.png", href: "https://amadeus.com" },
  { name: "Razorpay", src: "/static/partner_img/logo-razorpay.png", href: "https://razorpay.com" },
  { name: "Cashfree", src: "/static/partner_img/logo-cashfree.png", href: "https://www.cashfree.com" },
  { name: "Elasticsearch", src: "/static/partner_img/logo-elasticsearch.png", href: "https://www.elastic.co" },
  { name: "MongoDB", src: "/static/partner_img/logo-mongodb.png", href: "https://www.mongodb.com" },
  { name: "Postman", src: "/static/partner_img/logo-postman.png", href: "https://www.postman.com" },
  { name: "The AI Collective", src: "/static/partner_img/AI-Collective.png", href: "https://www.aicollective.com" },
  { name: "Harness", src: "/static/partner_img/logo-harness.png", href: "https://www.harness.io" },
  { name: "CodeRabbit", src: "/static/partner_img/logo-coderabbit.png", href: "https://www.coderabbit.ai" },
  { name: "ToolJet", src: "/static/partner_img/logo-tooljet.png", href: "https://www.tooljet.com" },
  { name: "Kong", src: "/static/partner_img/logo-kong.png", href: "https://konghq.com" },
  { name: "Cast AI", src: "/static/partner_img/logo-castai.png", href: "https://cast.ai" },
  { name: "Portkey", src: "/static/partner_img/logo-portkey.png", href: "https://portkey.ai" },
  { name: "ZopDev", src: "/static/partner_img/logo-zopdev.png", href: "https://zop.dev" },
  { name: "ImageKit", src: "/static/partner_img/logo-imagekit.png", href: "https://imagekit.io" },
  { name: "GeekyAnts", src: "/static/partner_img/logo-geekyants.png", href: "https://geekyants.com" },
  { name: "Sense HQ", src: "/static/partner_img/logo-sensehq.png", href: "https://www.sensehq.com" },
  { name: "Hinge Health", src: "/static/partner_img/logo-hingehealth.png", href: "https://www.hingehealth.com" },
  { name: "Paytm", src: "/static/partner_img/logo-paytm.png", href: "https://paytm.com" },
  { name: "Contentstack", src: "/static/partner_img/logo-contentstack.png", href: "https://www.contentstack.com" },
  { name: "DevRev", src: "/static/partner_img/logo-devrev.png", href: "https://devrev.ai" },
  { name: "Flipkart", src: "/static/partner_img/logo-flipkart.png", href: "https://www.flipkart.com" },
  { name: "Canonical", src: "/static/partner_img/logo-canonical.png", href: "https://canonical.com" },
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
              className="flex h-16 w-36 shrink-0 items-center justify-center"
            >
              <img
                src={p.src}
                alt={p.name}
                loading="lazy"
                draggable={false}
                width={600}
                height={400}
                className="h-full w-full object-contain opacity-70 grayscale transition duration-300 hover:opacity-100 hover:grayscale-0 select-none"
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
      <div className="flex flex-col">
        <MarqueeRow items={rows[0]} direction="left" />
        <MarqueeRow items={rows[1]} direction="right" />
        <MarqueeRow items={rows[2]} direction="left" />
      </div>
    </section>
  );
}
