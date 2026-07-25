import type { ReactNode } from "react";

interface WorkflowLayoutProps {
  children: ReactNode;
  sidebarOpen: boolean;
  sidebar: ReactNode;
  header: ReactNode;
  content: ReactNode;
}

export default function WorkflowLayout(props: WorkflowLayoutProps) {
  const { children, sidebarOpen, sidebar, header, content } = props;

  return (
    <main className="min-h-screen overflow-x-hidden overflow-y-auto bg-slate-50/70" aria-label="Trailwise 09 console preview">
      <section className={`relative min-h-screen w-full overflow-hidden bg-white ${sidebarOpen ? "sidebar-open" : ""}`}>
        {children}
        {sidebar}
        <section className="
          hide-scrollbar absolute inset-x-0 top-[20%] h-[80%] overflow-hidden overflow-y-auto rounded-[50px_50px_0_0] 
          bg-green-10/50
          backdrop-blur-2xl
          px-8 py-10 sm:px-8 lg:px-14
          border border-white/15
          shadow-[0px_0px_1px_rgba(255,255,255,0.9)]
          
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
        ">
          {header}
          {content}
        </section>
      </section>
    </main>
  );
}
