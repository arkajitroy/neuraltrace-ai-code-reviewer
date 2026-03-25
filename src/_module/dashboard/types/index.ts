type User = {
  name: string;
  email: string;
  avatar: string;
};

type Team = {
  name: string;
  logo: React.ElementType;
  plan: string;
};

type BaseNavItem = {
  title: string;
  badge?: string;
  icon?: React.ElementType;
};

type Href = string;

type NavLink = BaseNavItem & {
  href: Href;
  items?: never;
};

type NavCollapsible = BaseNavItem & {
  items: (BaseNavItem & { href: Href })[];
  href?: never;
};

type NavItem = NavLink | NavCollapsible;

type NavGroup = {
  title: string;
  items: NavItem[];
};

type SidebarData = {
  user: User;
  teams: Team[];
  navGroups: NavGroup[];
};

export type { SidebarData, NavGroup, NavItem, NavCollapsible, NavLink };
