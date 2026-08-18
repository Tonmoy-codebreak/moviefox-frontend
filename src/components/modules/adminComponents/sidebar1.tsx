"use client";

import {
  Film,
  FilmIcon,
  FolderPlus,
  LayoutDashboard,
  LogOut,
  ShieldCheck,
  Tags,
  Trash2,
  Users,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";

type NavItem = {
  label: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  href: string;
  isActive?: boolean;
};

type NavGroup = {
  title: string;
  items: NavItem[];
};

type SidebarData = {
  logo: {
    src: string;
    alt: string;
    title: string;
    description: string;
  };
  topItem: NavItem;
  navGroups: NavGroup[];
  footerItems: NavItem[];
};

const sidebarData: SidebarData = {
  logo: {
    src: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/shadcnblocks-logo.svg",
    alt: "Shadcnblocks",
    title: "Admin",
    description: "Dashboard",
  },
  topItem: {
    label: "Overview",
    icon: LayoutDashboard,
    href: "/overview",
    isActive: true,
  },
  navGroups: [
    {
      title: "Manage Media",
      items: [
        { label: "All Media", icon: Film, href: "/allmedia" },
        { label: "Add Media", icon: FolderPlus, href: "/addnewmedia" },
        { label: "Genres", icon: Tags, href: "/genres" },
      ],
    },
    {
      title: "Manage Users",
      items: [
        { label: "Users", icon: Users, href: "/allusers" },
        {
          label: "Pending Reviews",
          icon: FilmIcon,
          href: "/pendingreviews",
        },
      ],
    },
    {
      title: "Manage Trash",
      items: [{ label: "Recycle Bin", icon: Trash2, href: "/recyclebin" }],
    },
  ],
  footerItems: [
    { label: "Admin Profile", icon: ShieldCheck, href: "/adminprofile" },
    { label: "Log out", icon: LogOut, href: "/logout" },
  ],
};

const SidebarLogo = ({ logo }: { logo: SidebarData["logo"] }) => {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton size="lg" className="hover:bg-transparent">
          <div className="flex aspect-square size-9 items-center justify-center rounded-xl bg-yellow-400 shadow-sm">
            <img
              src={logo.src}
              alt={logo.alt}
              className="size-5 text-gray-900"
            />
          </div>
          <div className="flex flex-col gap-0.5 leading-none">
            <span className="font-bold text-gray-800 dark:text-white">
              {logo.title}
            </span>
            <span className="text-xs text-gray-400">{logo.description}</span>
          </div>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
};

const AppSidebar = ({ ...props }: React.ComponentProps<typeof Sidebar>) => {
  const TopIcon = sidebarData.topItem.icon;
  const { logout } = useAuth();

  return (
    <Sidebar
      {...props}
      className="border-r border-gray-200 dark:border-gray-800"
    >
      <SidebarHeader className="border-b border-gray-100 dark:border-gray-800 pb-3">
        <SidebarLogo logo={sidebarData.logo} />
      </SidebarHeader>

      <SidebarContent className="px-1">
        {/* Top-level Overview item, outside any group */}
        <SidebarGroup className="pb-1">
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={sidebarData.topItem.isActive}
                  className={cn(
                    "rounded-xl font-medium transition-all",
                    sidebarData.topItem.isActive
                      ? "bg-yellow-400 text-gray-900 hover:bg-yellow-400 hover:text-gray-900 shadow-sm"
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800",
                  )}
                >
                  <Link href={sidebarData.topItem.href}>
                    <TopIcon
                      className={cn(
                        sidebarData.topItem.isActive
                          ? "text-gray-900"
                          : "text-gray-400",
                      )}
                    />
                    <span>{sidebarData.topItem.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {sidebarData.navGroups.map((group) => (
          <SidebarGroup key={group.title} className="pt-2">
            <SidebarGroupLabel className="text-[10px] font-bold uppercase tracking-wider text-gray-400 px-2">
              {group.title}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className="gap-0.5">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  return (
                    <SidebarMenuItem key={item.label}>
                      <SidebarMenuButton
                        asChild
                        isActive={item.isActive}
                        className={cn(
                          "group rounded-xl font-medium transition-all",
                          item.isActive
                            ? "bg-yellow-400 text-gray-900 hover:bg-yellow-400 hover:text-gray-900 shadow-sm"
                            : "text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800",
                        )}
                      >
                        <Link
                          href={item.href}
                          className="flex items-center justify-between w-full"
                        >
                          <span className="flex items-center gap-2">
                            <Icon
                              className={cn(
                                "size-4",
                                item.isActive
                                  ? "text-gray-900"
                                  : "text-gray-400 group-hover:text-gray-600",
                              )}
                            />
                            <span>{item.label}</span>
                          </span>
                          <ChevronRight className="size-3.5 text-gray-300 opacity-0 -translate-x-1 transition-all group-hover:opacity-100 group-hover:translate-x-0" />
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter className="border-t border-gray-100 dark:border-gray-800 pt-3">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="gap-0.5">
              {sidebarData.footerItems.map((item) => {
                const Icon = item.icon;

                // যদি আইটেমটি "Log out" হয়, তবে লিঙ্কের বদলে বাটন দিয়ে হ্যান্ডেল করব
                if (item.label === "Log out") {
                  return (
                    <SidebarMenuItem key={item.label}>
                      <SidebarMenuButton
                        onClick={() => {
                          logout();
                          window.location.href = "/login";
                        }}
                        className="cursor-pointer rounded-xl font-medium text-red-500 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/30"
                      >
                        <Icon className="size-4" />
                        <span>{item.label}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                }

                return (
                  <SidebarMenuItem key={item.label}>
                    <SidebarMenuButton
                      asChild
                      className="rounded-xl font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800"
                    >
                      <Link href={item.href}>
                        <Icon className="size-4 text-gray-400" />
                        <span>{item.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
};

interface Sidebar1Props {
  className?: string;
  children?: React.ReactNode;
}

const Sidebar1 = ({ className, children }: Sidebar1Props) => {
  return (
    <TooltipProvider>
      <SidebarProvider className={cn(className)}>
        <AppSidebar />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 border-b border-gray-200 dark:border-gray-800 px-4 bg-white/80 dark:bg-gray-950/80 backdrop-blur-sm sticky top-0 z-10">
            <SidebarTrigger className="-ml-1 rounded-lg hover:bg-yellow-100 hover:text-gray-900 dark:hover:bg-gray-800" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink
                    href="#"
                    className="text-gray-400 hover:text-gray-800 transition-colors"
                  >
                    Overview
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block text-gray-300" />
                <BreadcrumbItem>
                  <BreadcrumbPage className="font-semibold text-gray-800 dark:text-white">
                    lolboard
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>

            <div className="ml-auto flex items-center gap-2">
              <span className="hidden sm:inline-flex items-center gap-1.5 rounded-full bg-yellow-50 dark:bg-yellow-400/10 border border-yellow-200 dark:border-yellow-400/30 px-3 py-1 text-xs font-semibold text-yellow-700 dark:text-yellow-400">
                <ShieldCheck className="size-3.5" />
                Admin
              </span>
            </div>
          </header>
          <div className="flex flex-1 flex-col gap-4 p-4 bg-gray-50/50 dark:bg-gray-950">
            {children}
          </div>
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  );
};

export { Sidebar1 };
