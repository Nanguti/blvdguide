"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Heart, User, Menu, ChevronDown } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetClose,
} from "@/components/ui/sheet";

const navigation = [
  { name: "Home", href: "/" },
  {
    name: "Properties",
    href: "/properties",
    submenu: [
      { name: "For Sale", href: "/properties/for-sale" },
      { name: "For Rent", href: "/properties/for-rent" },
      { name: "New Development", href: "/properties/new-development" },
      { name: "Recently Sold", href: "/properties/recently-sold" },
    ],
  },
  { name: "Agents", href: "/agents" },
  { name: "About", href: "/about" },
  { name: "Contact", href: "/contact" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="container mx-auto px-4 h-16 flex items-center justify-between max-w-[1400px]">
        {/* Logo and Desktop Navigation */}
        <div className="flex items-center gap-8">
          <Link href="/" className="font-bold text-xl text-primary">
            BLVD GUIDE
          </Link>
          <div className="hidden md:flex items-center gap-6">
            {navigation.map((item) => (
              <div key={item.name} className="relative group">
                <Link
                  href={item.href}
                  className={cn(
                    "text-md transition-colors hover:text-primary py-2 flex items-center gap-1",
                    pathname === item.href
                      ? "text-primary font-medium"
                      : "text-muted-foreground"
                  )}
                >
                  {item.name}
                  {item.submenu && (
                    <ChevronDown className="w-4 h-4 transition-transform group-hover:rotate-180" />
                  )}
                </Link>
                {item.submenu && (
                  <div className="absolute left-0 top-full hidden group-hover:block bg-background border rounded-md shadow-lg py-2 min-w-[200px]">
                    {item.submenu.map((subItem) => (
                      <Link
                        key={subItem.name}
                        href={subItem.href}
                        className={cn(
                          "block px-4 py-2 text-sm hover:bg-muted transition-colors",
                          pathname === subItem.href
                            ? "text-primary font-medium"
                            : "text-muted-foreground"
                        )}
                      >
                        {subItem.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Desktop Actions */}
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2">
            <Link href="/my/favorites">
              <Button variant="ghost" size="icon">
                <Heart className="w-5 h-5" />
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button variant="ghost" size="icon">
                <User className="w-5 h-5" />
              </Button>
            </Link>
          </div>
          <Button className="hidden sm:flex">List Property</Button>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(true)}
          >
            <Menu className="w-5 h-5" />
          </Button>
        </div>
      </nav>

      {/* Mobile Menu Sheet */}
      <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
        <SheetContent side="right" className="w-[300px] sm:w-[350px] px-0">
          <SheetHeader className="px-4">
            <SheetTitle>Menu</SheetTitle>
          </SheetHeader>
          <div className="flex flex-col px-4 py-6">
            {navigation.map((item) => (
              <div key={item.name}>
                <SheetClose asChild>
                  <Link
                    href={item.href}
                    className={cn(
                      "py-3 text-base transition-colors hover:text-primary border-b block flex items-center gap-1",
                      pathname === item.href
                        ? "text-primary font-medium"
                        : "text-muted-foreground"
                    )}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.name}
                    {item.submenu && <ChevronDown className="w-4 h-4" />}
                  </Link>
                </SheetClose>
                {item.submenu && (
                  <div className="ml-4">
                    {item.submenu.map((subItem) => (
                      <SheetClose asChild key={subItem.name}>
                        <Link
                          href={subItem.href}
                          className={cn(
                            "py-2 text-sm transition-colors hover:text-primary border-b block",
                            pathname === subItem.href
                              ? "text-primary font-medium"
                              : "text-muted-foreground"
                          )}
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          {subItem.name}
                        </Link>
                      </SheetClose>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <div className="flex flex-col gap-4 mt-6">
              <div className="flex gap-4">
                <Button variant="ghost" size="icon" className="flex-1">
                  <Heart className="w-5 h-5 mr-2" />
                  Favorites
                </Button>
                <Link href="/dashboard">
                  <Button variant="ghost" size="icon" className="flex-1">
                    <User className="w-5 h-5 mr-2" />
                    Account
                  </Button>
                </Link>
              </div>
              <Button className="w-full">List Property</Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </header>
  );
}
