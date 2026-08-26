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
import { usePathname } from "next/navigation";

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
          <div className="flex aspect-square size-9 items-center justify-center rounded-xl bg-[#F5C518] shadow-sm">
            <img src={logo.src} alt={logo.alt} className="size-5" />
          </div>
          <div className="flex flex-col gap-0.5 leading-none">
            <span className="font-bold text-white">{logo.title}</span>
            <span className="text-xs text-white/40">{logo.description}</span>
          </div>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
};

const AppSidebar = ({ ...props }: React.ComponentProps<typeof Sidebar>) => {
  const pathname = usePathname();
  const TopIcon = sidebarData.topItem.icon;
  const { logout } = useAuth();

  return (
    <Sidebar {...props} className="border-r border-white/10 bg-black">
      <SidebarHeader className="border-b border-white/10 pb-3 bg-black">
        <SidebarLogo logo={sidebarData.logo} />
      </SidebarHeader>

      <SidebarContent className="px-1 bg-black">
        {/* Top-level Overview item, outside any group */}
        <SidebarGroup className="pb-1">
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === sidebarData.topItem.href}
                  className={cn(
                    "rounded-xl font-medium transition-all",
                    pathname === sidebarData.topItem.href
                      ? "bg-[#F5C518] text-black hover:bg-[#F5C518] hover:text-black shadow-sm"
                      : "text-white/60 hover:bg-white/5 hover:text-white",
                  )}
                >
                  <Link href={sidebarData.topItem.href} prefetch={false}>
                    <TopIcon
                      className={cn(
                        pathname === sidebarData.topItem.href
                          ? "text-black"
                          : "text-white/30",
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
            <SidebarGroupLabel className="text-[10px] font-bold uppercase tracking-wider text-white/30 px-2">
              {group.title}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className="gap-0.5">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const isItemActive = pathname === item.href;
                  return (
                    <SidebarMenuItem key={item.label}>
                      <SidebarMenuButton
                        asChild
                        isActive={isItemActive}
                        className={cn(
                          "group rounded-xl font-medium transition-all",
                          isItemActive
                            ? "bg-[#F5C518] text-black hover:bg-[#F5C518] hover:text-black shadow-sm"
                            : "text-white/60 hover:bg-white/5 hover:text-white",
                        )}
                      >
                        <Link
                          href={item.href}
                          prefetch={false}
                          className="flex items-center justify-between w-full"
                        >
                          <span className="flex items-center gap-2">
                            <Icon
                              className={cn(
                                "size-4",
                                isItemActive
                                  ? "text-black"
                                  : "text-white/30 group-hover:text-white/70",
                              )}
                            />
                            <span>{item.label}</span>
                          </span>
                          <ChevronRight
                            className={cn(
                              "size-3.5 opacity-0 -translate-x-1 transition-all group-hover:opacity-100 group-hover:translate-x-0",
                              isItemActive ? "text-black/40" : "text-white/20",
                            )}
                          />
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

      <SidebarFooter className="border-t border-white/10 pt-3 bg-black">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="gap-0.5">
              {sidebarData.footerItems.map((item) => {
                const Icon = item.icon;

                if (item.label === "Log out") {
                  return (
                    <SidebarMenuItem key={item.label}>
                      <SidebarMenuButton
                        onClick={() => {
                          logout();
                          window.location.href = "/login";
                        }}
                        className="cursor-pointer rounded-xl font-medium text-[#E23636] hover:bg-[#E23636]/10 hover:text-[#ff5252]"
                      >
                        <Icon className="size-4" />
                        <span>{item.label}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                }

                const isFooterActive = pathname === item.href;

                return (
                  <SidebarMenuItem key={item.label}>
                    <SidebarMenuButton
                      asChild
                      isActive={isFooterActive}
                      className={cn(
                        "rounded-xl font-medium text-white/60 hover:bg-white/5 hover:text-white",
                        isFooterActive && "bg-white/10 text-white",
                      )}
                    >
                      <Link href={item.href} prefetch={false}>
                        <Icon className="size-4 text-white/30" />
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
          {/* Minimal trigger only — no breadcrumb bar */}
          <div className="sticky top-0 z-10 flex items-center px-4 py-3 bg-black">
            <SidebarTrigger className="rounded-lg text-white/50 hover:bg-[#F5C518]/10 hover:text-[#F5C518]" />
          </div>
          <div className="flex flex-1 flex-col gap-4 px-4 pb-4 bg-black min-h-screen">
            {children}
          </div>
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  );
};

export { Sidebar1 };
