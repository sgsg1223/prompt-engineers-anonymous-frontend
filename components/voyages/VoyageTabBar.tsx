import type { PlanningList } from "@/lib/domain/types";

interface VoyageTabBarProps {
  active: PlanningList;
  onChange: (tab: PlanningList) => void;
}

const TABS: { key: PlanningList; label: string }[] = [
  { key: "Main", label: "Main List" },
  { key: "Spare", label: "Spare List" },
];

export default function VoyageTabBar({ active, onChange }: VoyageTabBarProps) {
  return (
    <div className="flex gap-8 px-4" role="tablist" aria-label="Voyage lists">
      {TABS.map((tab) => {
        const isActive = active === tab.key;
        return (
          <button
            key={tab.key}
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(tab.key)}
            className={`border-b-[3px] pb-3 pt-2 text-sm font-bold transition-colors ${
              isActive
                ? "border-semantic-global-primary-default text-semantic-global-primary-default"
                : "border-transparent text-semantic-global-text-light hover:text-semantic-global-text-default"
            }`}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
