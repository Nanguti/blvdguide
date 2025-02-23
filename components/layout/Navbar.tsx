"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Heart, User, Menu } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetClose,
} from "@/components/ui/sheet";

const navigation = [
  { name: "Home", href: "/" },
  { name: "Properties", href: "/properties" },
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
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "text-md transition-colors hover:text-primary",
                  pathname === item.href
                    ? "text-primary font-medium"
                    : "text-muted-foreground"
                )}
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>

        {/* Desktop Actions */}
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2">
            <Button variant="ghost" size="icon">
              <Heart className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <User className="w-5 h-5" />
            </Button>
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
              <SheetClose asChild key={item.name}>
                <Link
                  href={item.href}
                  className={cn(
                    "py-3 text-base transition-colors hover:text-primary border-b",
                    pathname === item.href
                      ? "text-primary font-medium"
                      : "text-muted-foreground"
                  )}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              </SheetClose>
            ))}
            <div className="flex flex-col gap-4 mt-6">
              <div className="flex gap-4">
                <Button variant="ghost" size="icon" className="flex-1">
                  <Heart className="w-5 h-5 mr-2" />
                  Favorites
                </Button>
                <Button variant="ghost" size="icon" className="flex-1">
                  <User className="w-5 h-5 mr-2" />
                  Account
                </Button>
              </div>
              <Button className="w-full">List Property</Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </header>
  );
}
