export type NavItem = {
  title: string;
  href: string;
  icon?: React.ReactNode;
  disabled?: boolean;
  external?: boolean;
  label?: string;
  description?: string;
};

export type SidebarNavItem = NavItem & {
  items?: NavItem[];
};

export type SiteConfig = {
  name: string;
  description: string;
  url: string;
  ogImage: string;
  mainNav: NavItem[];
  sidebarNav: SidebarNavItem[];
};

import { LayoutDashboard, CalendarDays, FileText, UserCog, Settings, BarChart3 } from "lucide-react";

export const siteConfig: SiteConfig = {
  name: "EMS Competency Tracker",
  description: "South African EMS Student Training Platform.",
  url: "http://localhost:9002", // Update with actual URL
  ogImage: "http://localhost:9002/og.jpg", // Update with actual OG image
  mainNav: [
    // Could be used for top-level public navigation if any
  ],
  sidebarNav: [
    {
      title: "Dashboard",
      href: "/dashboard",
      icon: <LayoutDashboard className="h-4 w-4" />,
      description: "Overview of your progress and activities.",
    },
    {
      title: "Shifts",
      href: "/shifts",
      icon: <CalendarDays className="h-4 w-4" />,
      description: "Manage and book your shifts.",
    },
    {
      title: "Patient Care Form",
      href: "/patient-care-form",
      icon: <FileText className="h-4 w-4" />,
      description: "Log new patient encounters.",
    },
    {
      title: "Skills Log",
      href: "/skills",
      icon: <BarChart3 className="h-4 w-4" />,
      description: "View your logged skills.",
    },
    {
      title: "Profile",
      href: "/profile",
      icon: <UserCog className="h-4 w-4" />,
      description: "Manage your account settings.",
    },
    {
      title: "Settings",
      href: "/settings",
      icon: <Settings className="h-4 w-4" />,
      description: "System settings and configurations.",
    },
  ],
};
