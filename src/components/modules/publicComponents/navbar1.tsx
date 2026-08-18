"use client";

import { useEffect, useState } from "react";
import {
  Menu,
  User,
  LogOut,
  LogIn,
  UserPlus,
  Home,
  Film,
  Bookmark,
  CheckCircle2,
  Circle,
  ChevronRight,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";

// Maps a menu title to a Lucide icon. Falls back to a plain dot for
// any custom item that isn't one of the known routes.
const ICONS: Record<string, LucideIcon> = {
  Home: Home,
  Media: Film,
  Watchlist: Bookmark,
  Completed: CheckCircle2,
};

const iconFor = (title: string) => ICONS[title] ?? Circle;

interface MenuItem {
  title: string;
  url: string;
  description?: string;
  icon?: React.ReactNode;
  items?: MenuItem[];
}

interface Navbar1Props {
  className?: string;
  logo?: {
    url: string;
    src: string;
    alt: string;
    title: string;
    className?: string;
  };
  menu?: MenuItem[];
  auth?: {
    login: {
      title: string;
      url: string;
    };
    signup: {
      title: string;
      url: string;
    };
  };
}

const Navbar1 = ({
  logo = {
    url: "/",
    src: "https://www.svgrepo.com/show/418955/cinema-film-movie.svg",
    alt: "logo",
    title: "Moviefox",
  },
  menu = [
    { title: "Home", url: "/" },
    {
      title: "Media",
      url: "/media",
    },
    {
      title: "Watchlist",
      url: "/watchlist",
    },
    {
      title: "Completed",
      url: "/completed",
    },
  ],
  auth = {
    login: { title: "Login", url: "/login" },
    signup: { title: "Register", url: "/register" },
  },
  className,
}: Navbar1Props) => {
  const { user, loading, logout } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const filteredMenu = menu.filter((item) => {
    if (!user && (item.title === "Watchlist" || item.title === "Completed")) {
      return false;
    }
    return true;
  });

  const isActive = (url: string) =>
    url === "/"
      ? pathname === "/"
      : pathname === url || pathname?.startsWith(`${url}/`);

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "";

  return (
    <section
      className={cn(
        "sticky top-0 z-50 px-4 transition-all duration-300 border-b",
        scrolled
          ? "bg-black/80 backdrop-blur-xl border-white/10 shadow-[0_8px_30px_-12px_rgba(0,0,0,0.8)]"
          : "bg-black border-transparent",
        className,
      )}
    >
      <div className="container px-4 mx-auto">
        {/* Desktop Menu */}
        <nav className="hidden items-center justify-between lg:flex h-16">
          <div className="flex items-center gap-8">
            {/* Logo */}
            <Link
              href={logo.url}
              className="flex items-center gap-2.5 group shrink-0"
            >
              <div className="relative flex items-center justify-center w-9 h-9 rounded-xl bg-yellow-400 shadow-[0_0_0_1px_rgba(255,255,255,0.1)] transition-transform duration-200 group-hover:scale-105">
                <img
                  src={logo.src}
                  className="max-h-4.5 w-4.5"
                  alt={logo.alt}
                />
              </div>
              <span className="text-lg font-bold tracking-tight text-white">
                {logo.title}
              </span>
            </Link>

            {/* Nav pills */}
            <div className="flex items-center rounded-full border border-white/10 bg-white/[0.03] p-1">
              <NavigationMenu>
                <NavigationMenuList className="gap-0.5">
                  {filteredMenu.map((item) =>
                    renderMenuItem(item, isActive(item.url)),
                  )}
                </NavigationMenuList>
              </NavigationMenu>
            </div>
          </div>

          {/* Desktop Auth Buttons */}
          <div className="flex gap-3 items-center">
            {loading ? (
              <div className="flex items-center gap-2 text-sm text-white/40">
                <span className="h-3.5 w-3.5 rounded-full border-2 border-white/20 border-t-yellow-400 animate-spin" />
                Loading...
              </div>
            ) : user ? (
              <>
                <Link
                  href="/userprofile"
                  className="flex items-center gap-2.5 rounded-full border border-white/10 bg-white/[0.03] pl-1.5 pr-4 py-1.5 text-sm font-medium text-white/90 transition-colors hover:border-yellow-400/40 hover:bg-white/[0.06]"
                >
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-yellow-400 text-[11px] font-bold text-gray-900">
                    {initials || <User className="size-3.5" />}
                  </span>
                  {user.name}
                </Link>
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-white/70 hover:text-white hover:bg-white/[0.06] gap-1.5"
                  onClick={() => {
                    logout();
                    window.location.href = "/";
                  }}
                >
                  <LogOut className="size-4" />
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button
                  asChild
                  variant="ghost"
                  size="sm"
                  className="text-white/70 hover:text-white hover:bg-white/[0.06] gap-1.5"
                >
                  <Link href={auth.login.url}>
                    <LogIn className="size-4" />
                    {auth.login.title}
                  </Link>
                </Button>
                <Button
                  asChild
                  size="sm"
                  className="bg-yellow-400 text-gray-900 hover:bg-yellow-300 gap-1.5 font-semibold shadow-[0_0_0_1px_rgba(0,0,0,0.05)] transition-transform hover:scale-[1.02]"
                >
                  <Link href={auth.signup.url}>
                    <UserPlus className="size-4" />
                    {auth.signup.title}
                  </Link>
                </Button>
              </>
            )}
          </div>
        </nav>

        {/* Mobile Menu */}
        <div className="block lg:hidden">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href={logo.url} className="flex items-center gap-2.5">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-yellow-400">
                <img src={logo.src} className="max-h-4 w-4" alt={logo.alt} />
              </div>
              <span className="text-base font-bold tracking-tight text-white">
                {logo.title}
              </span>
            </Link>
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="border-white/15 bg-white/[0.03] text-white hover:bg-white/10"
                >
                  <Menu className="size-4" />
                </Button>
              </SheetTrigger>
              <SheetContent className="overflow-y-auto bg-black border-l border-white/10 text-white w-[85vw] sm:w-80">
                <SheetHeader>
                  <SheetTitle>
                    <Link href={logo.url} className="flex items-center gap-2.5">
                      <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-yellow-400">
                        <img
                          src={logo.src}
                          className="max-h-4 w-4"
                          alt={logo.alt}
                        />
                      </div>
                      <span className="text-base font-bold tracking-tight text-white">
                        {logo.title}
                      </span>
                    </Link>
                  </SheetTitle>
                </SheetHeader>

                {/* User summary card (mobile) */}
                {!loading && user && (
                  <div className="mx-4 mt-2 flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-yellow-400 text-sm font-bold text-gray-900">
                      {initials || <User className="size-4" />}
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-white">
                        {user.name}
                      </p>
                      <p className="text-xs text-white/50">Signed in</p>
                    </div>
                  </div>
                )}

                <div className="flex flex-col gap-6 p-4">
                  <Accordion
                    type="single"
                    collapsible
                    className="flex w-full flex-col gap-1"
                  >
                    {filteredMenu.map((item) =>
                      renderMobileMenuItem(item, isActive(item.url)),
                    )}
                  </Accordion>

                  {/* Mobile Auth Buttons */}
                  <div className="flex flex-col gap-2.5 border-t border-white/10 pt-5">
                    {loading ? (
                      <span className="text-sm text-white/40 text-center">
                        Loading...
                      </span>
                    ) : user ? (
                      <>
                        <Button
                          asChild
                          variant="outline"
                          className="border-white/15 bg-white/[0.03] text-white hover:bg-white/10 gap-1.5 justify-start"
                        >
                          <Link href="/userprofile">
                            <User className="size-4" />
                            My Profile
                          </Link>
                        </Button>
                        <Button
                          variant="ghost"
                          className="text-red-400 hover:text-red-300 hover:bg-red-500/10 gap-1.5 justify-start"
                          onClick={logout}
                        >
                          <LogOut className="size-4" />
                          Logout
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button
                          asChild
                          variant="outline"
                          className="border-white/15 bg-white/[0.03] text-white hover:bg-white/10 gap-1.5 justify-start"
                        >
                          <Link href={auth.login.url}>
                            <LogIn className="size-4" />
                            {auth.login.title}
                          </Link>
                        </Button>
                        <Button
                          asChild
                          className="bg-yellow-400 text-gray-900 hover:bg-yellow-300 gap-1.5 font-semibold justify-start"
                        >
                          <Link href={auth.signup.url}>
                            <UserPlus className="size-4" />
                            {auth.signup.title}
                          </Link>
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </section>
  );
};

const renderMenuItem = (item: MenuItem, active: boolean) => {
  const Icon = iconFor(item.title);

  if (item.items) {
    return (
      <NavigationMenuItem key={item.title}>
        <NavigationMenuTrigger className="rounded-full bg-transparent text-white/70 hover:text-yellow-400 hover:bg-white/[0.06] data-[state=open]:text-yellow-400 data-[state=open]:bg-white/[0.06] text-sm font-medium gap-1.5 px-4 h-8">
          <Icon className="size-4" />
          {item.title}
        </NavigationMenuTrigger>
        <NavigationMenuContent className="bg-black text-white border border-white/10 rounded-xl overflow-hidden">
          {item.items.map((subItem) => (
            <NavigationMenuLink asChild key={subItem.title} className="w-80">
              <SubMenuLink item={subItem} />
            </NavigationMenuLink>
          ))}
        </NavigationMenuContent>
      </NavigationMenuItem>
    );
  }

  return (
    <NavigationMenuItem key={item.title}>
      <NavigationMenuLink asChild>
        <Link
          href={item.url}
          className={cn(
            "relative inline-flex h-8 w-max items-center justify-center gap-1.5 rounded-full px-4 text-sm font-medium transition-all duration-200",
            active
              ? "bg-yellow-400 text-gray-900 shadow-sm"
              : "text-white/70 hover:text-white hover:bg-white/[0.06]",
          )}
        >
          <Icon className="size-4" />
          {item.title}
        </Link>
      </NavigationMenuLink>
    </NavigationMenuItem>
  );
};

const renderMobileMenuItem = (item: MenuItem, active: boolean) => {
  const Icon = iconFor(item.title);

  if (item.items) {
    return (
      <AccordionItem
        key={item.title}
        value={item.title}
        className="border-b-0 rounded-xl px-3 hover:bg-white/[0.03]"
      >
        <AccordionTrigger className="text-sm py-3 font-semibold text-white hover:no-underline hover:text-yellow-400 gap-2.5">
          <span className="flex items-center gap-2.5">
            <Icon className="size-4" />
            {item.title}
          </span>
        </AccordionTrigger>
        <AccordionContent className="mt-1 pb-2">
          {item.items.map((subItem) => (
            <SubMenuLink key={subItem.title} item={subItem} />
          ))}
        </AccordionContent>
      </AccordionItem>
    );
  }

  return (
    <Link
      key={item.title}
      href={item.url}
      className={cn(
        "flex items-center justify-between gap-2.5 rounded-xl px-3 py-3 text-sm font-semibold transition-colors",
        active
          ? "bg-yellow-400/10 text-yellow-400"
          : "text-white/70 hover:bg-white/[0.03] hover:text-white",
      )}
    >
      <span className="flex items-center gap-2.5">
        <Icon className="size-4" />
        {item.title}
      </span>
      <ChevronRight className="size-3.5 opacity-40" />
    </Link>
  );
};

const SubMenuLink = ({ item }: { item: MenuItem }) => {
  return (
    <Link
      className="flex min-w-80 flex-row gap-4 rounded-lg p-3 leading-none no-underline transition-colors outline-none select-none hover:bg-white/[0.06]"
      href={item.url}
    >
      <div className="text-yellow-400">{item.icon}</div>
      <div>
        <div className="text-sm font-semibold text-white">{item.title}</div>
        {item.description && (
          <p className="text-sm leading-snug text-white/50">
            {item.description}
          </p>
        )}
      </div>
    </Link>
  );
};

export { Navbar1 };
