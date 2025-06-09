export const MessagePage: React.FC<{
  headline: string;
  blurb: string;
  videoSrc: string;
}> = (p) => {
  return (
    <section className="min-h-max px-5">
      <div className="m-auto flex h-[80%] max-w-7xl flex-col items-center gap-6 pt-10 pb-24 text-center md:pt-24 md:text-left xl:pt-36 xl:pb-36">
        <h1 className="headline text-7xl lg:text-9xl">{p.headline}</h1>
        <p className="text-xl lg:text-2xl"> {p.blurb}</p>
      </div>
    </section>
  );
};
