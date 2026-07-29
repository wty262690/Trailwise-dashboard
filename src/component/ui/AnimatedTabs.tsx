import type { ReactNode } from "react";
import { motion } from "motion/react";
import { cn } from "../../lib/utils";

export type AnimatedTabItem = {
  id: string;
  label: string;
  icon?: ReactNode;
  disabled?: boolean;
};

type AnimatedTabsProps = {
  activeId: string;
  items: AnimatedTabItem[];
  onChange: (id: string) => void;
  className?: string;
};

export function AnimatedTabs({ activeId, items, onChange, className }: AnimatedTabsProps) {
  const activeIndex = items.findIndex((item) => item.id === activeId);
  
  return (
    <div>
      <div className={`my-5 flex w-full ${cn("tabs animated-tabs", className)}`}>
      {items.map((item, index) => {
          const isActive = item.id === activeId;
          const isLastActive = index === activeIndex;

        return (
          <button
            className={`relative grid h-[10vh] w-full grid-rows-[40%_60%] ${
              isActive ? "active" : ""
            }`}
            disabled={item.disabled}
            key={item.id}
            onClick={() => onChange(item.id)}
            type="button"
          >
            <div className="flex text-white items-end justify-center pb-2">
              {item.icon}
            </div>

            <span className="flex text-white items-start justify-center px-2 pt-1 text-center text-[min(2vw,15px)] font-semibold uppercase leading-tight">
              {item.label}
            </span>

            <div
              className="absolute bottom-0 left-0 right-0 h-px"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(to right, rgba(255,255,255,.5) 0 4px, transparent 4px 8px)",
              }}
            />

            <motion.div
              className="absolute bottom-0 left-0 h-px bg-white"
              initial={false}
              animate={{ width: isActive ? "100%" : "0%" }}
              transition={{ duration: 0.3 }}
            >
              {isLastActive && (
                <div
                  className="
                    absolute
                    right-0
                    top-1/2
                    h-2
                    w-2
                    -translate-y-1/2
                    translate-x-1/2
                    rotate-45
                    bg-white
                  "
                />
              )}
            </motion.div>
          </button>
        );
      })}
      </div>
    </div>
  );
}
