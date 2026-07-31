import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ProjectCard from "./ProjectCard";

interface Session {
  session_id: string;
  status: string;
}

interface ProjectsBarProps {
  sessions: Session[];
  loadSessions: () => Promise<void> | void;
  onOpen: (session: Session) => void;
  currentSession: {
    session_id: string;
    status?: string;
  } | null;
}

export default function ProjectsBar({
  sessions,
  loadSessions,
  onOpen,
  currentSession,
}: ProjectsBarProps) {
  const [startIndex, setStartIndex] = useState(0);
  const [direction, setDirection] = useState<"left" | "right">("right");
  const [isAnimating, setIsAnimating] = useState(false);

  const visibleCount = Math.min(3, sessions.length);
  const maxStartIndex = Math.max(sessions.length - visibleCount, 0);

  useEffect(() => {
    void loadSessions();
  }, [loadSessions]);

  useEffect(() => {
    setStartIndex((current) => Math.min(current, maxStartIndex));
  }, [maxStartIndex]);

  const visibleSessions = sessions.slice(
    startIndex,
    startIndex + visibleCount,
  );

  const canGoPrevious = startIndex > 0;
  const canGoNext = startIndex < maxStartIndex;

  const getSelectedIndex = () => {
    if (visibleCount === 1) return 0;
    if (visibleCount === 2) return 0;
    return 1;
  };

  const showPrevious = () => {
    if (!canGoPrevious || isAnimating) return;

    const previousIndex = Math.max(startIndex - 1, 0);

    setDirection("left");
    setIsAnimating(true);
    setStartIndex(previousIndex);

    const selectedSession =
      sessions[previousIndex + getSelectedIndex()];

    if (selectedSession) {
      onOpen(selectedSession);
    }
  };

  const showNext = () => {
    if (!canGoNext || isAnimating) return;

    const nextIndex = Math.min(startIndex + 1, maxStartIndex);

    setDirection("right");
    setIsAnimating(true);
    setStartIndex(nextIndex);

    const selectedSession =
      sessions[nextIndex + getSelectedIndex()];

    if (selectedSession) {
      onOpen(selectedSession);
    }
  };

  const getRotation = (index: number) => {
    if (visibleCount === 1) return 0;

    if (visibleCount === 2) {
      return [-6, 6][index];
    }

    return [-10, 0, 10][index];
  };

  const getMarginLeft = (index: number) => {
    if (index === 0) return 0;

    return "-18%";
  };

  const getScale = (index: number) => {
    if (visibleCount === 1) return 1;

    if (visibleCount === 2) {
      return index === 0 ? 1 : 0.94;
    }

    return [0.9, 1, 0.9][index];
  };

  const getZIndex = (index: number) => {
    if (visibleCount === 1) return 30;

    if (visibleCount === 2) {
      return index === 0 ? 20 : 10;
    }

    return [10, 30, 20][index];
  };

  const handleCardClick = (session: Session, clickedIndex: number) => {
    const absoluteIndex = startIndex + clickedIndex;

    let newStartIndex: number;

    if (visibleCount === 1) {
      newStartIndex = 0;
    } else if (visibleCount === 2) {
      // 你目前兩張時 selected 是 index 0
      newStartIndex = absoluteIndex;
    } else {
      // 三張時中間是 index 1
      newStartIndex = absoluteIndex - 1;
    }

    newStartIndex = Math.max(
      0,
      Math.min(newStartIndex, maxStartIndex),
    );

    if (newStartIndex > startIndex) {
      setDirection("right");
    } else if (newStartIndex < startIndex) {
      setDirection("left");
    }

    if (newStartIndex !== startIndex) {
      setIsAnimating(true);
      setStartIndex(newStartIndex);
    }

    onOpen(session);
  };
  

  return (
    <section className="w-full">
      <div className="relative h-[18vh] min-h-[140px] w-[85vw] overflow-visible">
        <div className="flex h-[50vh] items-center justify-center overflow-visible">
          <AnimatePresence
            mode="popLayout"
            initial={false}
            onExitComplete={() => setIsAnimating(false)}
          >
            {visibleSessions.map((session, index) => {
              const rotation = getRotation(index);

              return (
                <motion.div
                  layout
                  key={session.session_id}
                  className="
                    relative
                    h-full
                    w-[36%]
                    shrink-0
                    origin-center
                  "
                  style={{
                    marginLeft: getMarginLeft(index),
                    zIndex: getZIndex(index),
                    
                  }}
                  initial={{
                    scaleX: 0,
                    scaleY: getScale(index),
                    rotate: 0,
                    opacity: 0,
                    x: direction === "right" ? 40 : -40,
                  }}
                  animate={{
                    scaleX: getScale(index),
                    scaleY: getScale(index),
                    rotate: rotation,
                    opacity: 1,
                    x: 0,
                  }}
                  exit={{
                    scaleX: 0,
                    scaleY: getScale(index),
                    rotate: 0,
                    opacity: 0,
                    x: direction === "right" ? -40 : 40,
                  }}
                  transition={{
                    duration: 0.55,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  whileHover={{
                    y: -12,
                    scaleX: getScale(index) + 0.04,
                    scaleY: getScale(index) + 0.04,
                    transition: {
                      duration: 0.2,
                    },
                  }}
                >
                  <ProjectCard
                    session={session}
                    selected={currentSession?.session_id === session.session_id}
                    onOpen={() => handleCardClick(session, index)}
                  />
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        <div
          className="
            pointer-events-none
            absolute
            left-1/2
            top-1/2
            z-20
            flex
            h-full
            w-[90%]
            -translate-x-1/2
            -translate-y-1/2
            items-center
            justify-between
          "
        >
          <button
            type="button"
            aria-label="Previous projects"
            onClick={showPrevious}
            disabled={!canGoPrevious || isAnimating}
            className="
              pointer-events-auto
              inline-flex
              h-9
              w-9
              items-center
              justify-center
              rounded-full
              bg-white/10
              text-white
              backdrop-blur-md
              transition
              duration-200
              hover:scale-105
              hover:bg-white/20
              active:scale-95
              disabled:cursor-not-allowed
              disabled:opacity-30
            "
          >
            <ChevronLeft size={18} aria-hidden="true" />
          </button>

          <button
            type="button"
            aria-label="Next projects"
            onClick={showNext}
            disabled={!canGoNext || isAnimating}
            className="
              pointer-events-auto
              inline-flex
              h-9
              w-9
              items-center
              justify-center
              rounded-full
              bg-white/10
              text-white
              backdrop-blur-md
              transition
              duration-200
              hover:scale-105
              hover:bg-white/20
              active:scale-95
              disabled:cursor-not-allowed
              disabled:opacity-30
            "
          >
            <ChevronRight size={18} aria-hidden="true" />
          </button>
        </div>
      </div>
    </section>
  );
}