import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center justify-center h-screen">
    <div
      className="
        fixed inset-0
        z-[-1]
        w-screen h-screen
        overflow-hidden
        bg-black

        before:content-['']
        before:absolute
        before:top-1/2
        before:left-[-150%]
        before:w-[400%]
        before:h-[200%]
        before:-translate-y-1/2
        before:rounded-full
        before:blur-xl
        before:bg-[radial-gradient(circle_at_20%_50%,rgba(105,255,151,0.35),transparent_40%),radial-gradient(circle_at_80%_40%,rgba(105,255,151,0.5),transparent_35%),radial-gradient(circle_at_50%_80%,rgba(105,255,151,0.5),transparent_30%)]
        before:animate-[liquid_16s_linear_infinite]

        after:content-['']
        after:absolute
        after:top-1/2
        after:left-[-50%]
        after:w-[200%]
        after:h-[200%]
        after:-translate-y-1/2
        after:blur-3xl
        after:bg-[radial-gradient(circle_at_30%_60%,rgba(105,255,151,0.35),transparent_40%),radial-gradient(circle_at_10%_40%,rgba(105,255,151,0.5),transparent_5%),radial-gradient(circle_at_50%_100%,rgba(105,255,151,0.5),transparent_30%)]
        after:animate-[liquid_22s_linear_infinite]
        after:[animation-delay:-6s]
      "
    ></div>
      <div className="h-[20vh]"></div>
      <h1 className="
        uppercase py-[min(10vh,50px)]
        text-[4.5vw]
        tracking-[30%]
        "
        >
        Trailwise
      </h1>

      <button
        className="
          relative overflow-hidden

          bg-white/5
          backdrop-blur-2xl
          max-w-[50vw]
          py-3 px-[8%]
          border border-white/15

          shadow-[0px_0px_1px_rgba(255,255,255,0.9)]
          text-white

          transition-all duration-300

          before:content-['']
          before:absolute
          before:inset-0
          before:w-[300%]
          before:left-[-100%]
          before:rounded-full
          before:blur-xl
          before:bg-[radial-gradient(circle_at_20%_50%,rgba(105,255,151,0.35),transparent_40%),radial-gradient(circle_at_80%_40%,rgba(105,255,151,0.5),transparent_35%),radial-gradient(circle_at_50%_80%,rgba(105,255,151,0.5),transparent_30%)]
          before:animate-[liquid_6s_linear_infinite]

          after:absolute after:inset-0
          after:bg-[radial-gradient(circle_at_center,_rgba(0,0,0,0)_0%,_rgba(191,255,236,0.5)_90%)]
          after:opacity-0
          after:transition-opacity
          after:duration-500
          after:z-[0]
          hover:after:opacity-100

          rounded-full
          "
          onClick={() => navigate("/workspace")}
        >
        <span className="relative z-[1]">
          Enter Workspace
        </span>
      </button>
    </div>
  );
}