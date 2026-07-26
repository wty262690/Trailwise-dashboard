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
  return (
    <div>
      <div className={`my-20 flex w-full ${cn("tabs animated-tabs", className)}`}>
      {items.map((item) => {
        const isActive = item.id === activeId;

        return (
          <button
            className={`grid h-[10vh] w-[100%] items-center ${isActive ? "active" : ""}`}
            disabled={item.disabled}
            key={item.id}
            onClick={() => onChange(item.id)}
            type="button"
          >
            {isActive && (
              <motion.span
                className="animated-tabs__indicator"
                layoutId="trailwise-active-tab"
                transition={{ duration: 0.22, ease: "easeOut" }}
              />
            )}
            <div className="flex mx-auto h-[30%]">{item.icon}</div>
            <span className="text-sm h-[50%] font-semibold uppercase">{item.label}</span>
            <div className="h-[50%]"></div>
            <motion.span
                className={`${isActive ? 'border-solid' : 'border-dashed'} border-white/100 border-[1px]`}
              />            
          </button>
          
        );
      })}
      </div>
    </div>
  );
}
