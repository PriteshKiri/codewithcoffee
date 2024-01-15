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
          img="/static/hashnode.jpeg"
          name="Hashnode"
          link="https://priteshkiri.hashnode.dev/"
          sub={""}
        />
        <ChannelLink
          img="/static/showwcase.jpeg"
          name="Showwcase"
          sub={""}
          link="https://priteshkiri.showwcase.com/articles"
        />
      </div>
    
    </section>
  );
}
