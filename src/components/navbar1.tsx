"use client";

import { useEffect, useState } from "react";
import {
  Menu,
  X,
  User,
  LogOut,
  LogIn,
  UserPlus,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";

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

  return (
    <section
      className={cn(
        "sticky top-0 z-50 px-4 transition-shadow duration-300 bg-white/95 backdrop-blur-md border-b border-gray-200",
        scrolled ? "shadow-sm" : "shadow-none",
        className,
      )}
    >
      <div className="container px-4 mx-auto">
        {/* Desktop Menu */}
        <nav className="hidden items-center justify-between lg:flex h-16">
          <div className="flex items-center gap-10">
            {/* Logo */}
            <Link href={logo.url} className="flex items-center gap-2.5">
              <img src={logo.src} className="max-h-7" alt={logo.alt} />
              <span className="text-lg font-bold tracking-tight text-black">
                {logo.title}
              </span>
              <span className="h-1.5 w-1.5 rounded-full bg-[#E23636]" />
            </Link>
            <div className="flex items-center">
              <NavigationMenu>
                <NavigationMenuList className="gap-1">
                  {filteredMenu.map((item) => renderMenuItem(item))}
                </NavigationMenuList>
              </NavigationMenu>
            </div>
          </div>

          {/* Desktop Auth Buttons */}
          <div className="flex gap-3 items-center">
            {loading ? (
              <span className="text-sm text-gray-400">Loading...</span>
            ) : user ? (
              <>
                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className="border-black text-black hover:bg-black hover:text-white gap-1.5"
                >
                  <Link href="/userprofile">
                    <User className="size-4" />
                    {user.name}
                  </Link>
                </Button>
                <Button
                  size="sm"
                  className="bg-black text-white hover:bg-[#E23636] gap-1.5"
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
                  variant="outline"
                  size="sm"
                  className="border-black text-black hover:bg-black hover:text-white gap-1.5"
                >
                  <Link href={auth.login.url}>
                    <LogIn className="size-4" />
                    {auth.login.title}
                  </Link>
                </Button>
                <Button
                  asChild
                  size="sm"
                  className="bg-black text-white hover:bg-[#E23636] gap-1.5"
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
            <Link href={logo.url} className="flex items-center gap-2">
              <img src={logo.src} className="max-h-7" alt={logo.alt} />
              <span className="text-base font-bold tracking-tight text-black">
                {logo.title}
              </span>
            </Link>
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="border-black text-black hover:bg-black hover:text-white"
                >
                  <Menu className="size-4" />
                </Button>
              </SheetTrigger>
              <SheetContent className="overflow-y-auto bg-white">
                <SheetHeader>
                  <SheetTitle>
                    <Link href={logo.url} className="flex items-center gap-2">
                      <img src={logo.src} className="max-h-7" alt={logo.alt} />
                      <span className="text-base font-bold tracking-tight text-black">
                        {logo.title}
                      </span>
                    </Link>
                  </SheetTitle>
                </SheetHeader>
                <div className="flex flex-col gap-6 p-4">
                  <Accordion
                    type="single"
                    collapsible
                    className="flex w-full flex-col gap-4"
                  >
                    {filteredMenu.map((item) => renderMobileMenuItem(item))}
                  </Accordion>

                  {/* Mobile Auth Buttons */}
                  <div className="flex flex-col gap-3">
                    {loading ? (
                      <span className="text-sm text-gray-400 text-center">
                        Loading...
                      </span>
                    ) : user ? (
                      <>
                        <Button
                          asChild
                          variant="outline"
                          className="border-black text-black hover:bg-black hover:text-white gap-1.5"
                        >
                          <Link href="/userprofile">
                            <User className="size-4" />
                            {user.name}
                          </Link>
                        </Button>
                        <Button
                          className="bg-black text-white hover:bg-[#E23636] gap-1.5"
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
                          className="border-black text-black hover:bg-black hover:text-white gap-1.5"
                        >
                          <Link href={auth.login.url}>
                            <LogIn className="size-4" />
                            {auth.login.title}
                          </Link>
                        </Button>
                        <Button
                          asChild
                          className="bg-black text-white hover:bg-[#E23636] gap-1.5"
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

const renderMenuItem = (item: MenuItem) => {
  if (item.items) {
    return (
      <NavigationMenuItem key={item.title}>
        <NavigationMenuTrigger className="bg-transparent text-gray-700 hover:text-black data-[state=open]:text-black text-sm font-medium">
          {item.title}
        </NavigationMenuTrigger>
        <NavigationMenuContent className="bg-white text-black border border-gray-200">
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
          className="group relative inline-flex h-10 w-max items-center justify-center rounded-md bg-transparent px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:text-black"
        >
          {item.title}
          <span className="pointer-events-none absolute left-4 right-4 -bottom-0.5 h-[2px] origin-left scale-x-0 bg-[#E23636] transition-transform duration-200 group-hover:scale-x-100" />
        </Link>
      </NavigationMenuLink>
    </NavigationMenuItem>
  );
};

const renderMobileMenuItem = (item: MenuItem) => {
  if (item.items) {
    return (
      <AccordionItem key={item.title} value={item.title} className="border-b-0">
        <AccordionTrigger className="text-md py-0 font-semibold text-black hover:no-underline hover:text-[#E23636]">
          {item.title}
        </AccordionTrigger>
        <AccordionContent className="mt-2">
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
      className="group flex items-center justify-between text-md font-semibold text-black hover:text-[#E23636] transition-colors"
    >
      {item.title}
      <ChevronRight className="size-4 text-gray-300 transition-transform group-hover:translate-x-0.5 group-hover:text-[#E23636]" />
    </Link>
  );
};

const SubMenuLink = ({ item }: { item: MenuItem }) => {
  return (
    <Link
      className="flex min-w-80 flex-row gap-4 rounded-md p-3 leading-none no-underline transition-colors outline-none select-none hover:bg-gray-50"
      href={item.url}
    >
      <div className="text-[#E23636]">{item.icon}</div>
      <div>
        <div className="text-sm font-semibold text-black">{item.title}</div>
        {item.description && (
          <p className="text-sm leading-snug text-gray-500">
            {item.description}
          </p>
        )}
      </div>
    </Link>
  );
};

export { Navbar1 };
