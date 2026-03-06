export type LoadingTab = "inspection" | "wagon-load" | "pending";

interface WagonTabBarProps {
  active: LoadingTab;
  onChange: (tab: LoadingTab) => void;
}

const TABS: { key: LoadingTab; label: string }[] = [
  { key: "inspection", label: "Inspection" },
  { key: "wagon-load", label: "Wagon Load" },
  { key: "pending", label: "Pending Units" },
];

export default function WagonTabBar({ active, onChange }: WagonTabBarProps) {
  return (
    <div className="px-4">
      <div
        className="flex gap-6 border-b border-semantic-global-border-light"
        role="tablist"
        aria-label="Wagon loading views"
      >
        {TABS.map((tab) => {
          const isActive = active === tab.key;
          return (
            <button
              key={tab.key}
              role="tab"
              aria-selected={isActive}
              onClick={() => onChange(tab.key)}
              className={`border-b-2 px-1 pb-3 pt-4 text-sm font-bold transition-colors ${
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
    </div>
  );
}
