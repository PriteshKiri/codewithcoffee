import ChannelLink from "../components/channelLinks";


export const metadata = {
  title: 'Blog',
  description: 'Read my thoughts on software development, and more.',
};

export default function BlogPage() {


  return (
    <section>
      <h1 className="font-medium text-2xl mb-8 tracking-tighter">
        read my blogs on
      </h1>
      <div className="my-8 flex flex-col sm:flex-row flex-wrap gap-y-2 w-full">
        <ChannelLink
          img="https://media2.dev.to/dynamic/image/quality=100/https://dev-to-uploads.s3.amazonaws.com/uploads/logos/resized_logo_UQww2soKuUsjaOGNB38o.png"
          name="Dev.to"
          sub={""}
          link="https://dev.to/priteshkiri"
        />
        <ChannelLink
          img="/static/linkedin.webp"
          name="LinkedIn"
          sub={""}
          link="https://www.linkedin.com/in/pritesh-kiri/recent-activity/articles"
        />
        <ChannelLink
          img="/static/hashnode.jpeg"
          name="Hashnode"
          link="https://priteshkiri.hashnode.dev/"
          sub={""}
        />
      </div>
    
    </section>
  );
}
