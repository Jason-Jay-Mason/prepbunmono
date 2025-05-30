import { Logo } from "../../Logos";

export const LoginLayout: React.FC<any> = (p) => {
  return (
    <main className="w-[100dvw] h-[100dvh] px-5 md:px-0">
      <div className="grid grid-cols-1 md:grid-cols-3 h-full w-full">
        <div className="hidden md:flex relative w-full h-full overflow-clip items-start">
          <div className="w-full h-full absolute z-10 bg-black bg-primary/60"></div>
          <Logo className="relative w-60 p-10 top-0 left-0 z-20 fill-white" />
          <video
            className="absolute h-full w-full object-cover z-0 top-0"
            loop
            autoPlay
            muted
            playsInline
            controls={false}
          >
            <source
              src="https://res.cloudinary.com/daki5cwn0/video/upload/v1747346376/home-hero_qfeodl.mp4"
              type="video/mp4"
            />
          </video>
        </div>
        <div
          id="form"
          className="col-span-2 flex flex-col justify-center items-center"
        >
          {p.children}
        </div>
      </div>
    </main>
  );
};
