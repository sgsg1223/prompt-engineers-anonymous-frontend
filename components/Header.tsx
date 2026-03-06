"use client";

import { usePathname } from "next/navigation";
import type { NavigationMenuProps } from "@dfds-frontend/compass-ui";
import { NavigationMenu } from "@dfds-frontend/compass-ui";

type TabKey = "HOME" | "BOOKINGS" | "VOYAGES" | "LOADING";

const TABS: NavigationMenuProps<TabKey, never>["menuConfig"] = {
  HOME: {
    label: "Home",
    link: "/",
    megaMenu: [],
    asideMenu: [],
  },
  BOOKINGS: {
    label: "Bookings",
    link: "/bookings",
    megaMenu: [],
    asideMenu: [],
  },
  VOYAGES: {
    label: "Voyages",
    link: "/voyages",
    megaMenu: [],
    asideMenu: [],
  },
  LOADING: {
    label: "Loading",
    link: "/loading-plan",
    megaMenu: [],
    asideMenu: [],
  },
};

const TAB_KEYS = Object.keys(TABS) as TabKey[];

function resolveActiveTab(pathname: string): TabKey {
  const match = TAB_KEYS.find(
    (k) => k !== "HOME" && pathname.startsWith(TABS[k].link),
  );
  return match ?? "HOME";
}

export default function Header() {
  const pathname = usePathname();
  const activeTab = resolveActiveTab(pathname);

  return (
    <NavigationMenu
      logoType="regular"
      logoHref="/"
      defaultActiveTab={activeTab}
      menuConfig={TABS}
      actionDispatch={{}}
    />
  );
}
