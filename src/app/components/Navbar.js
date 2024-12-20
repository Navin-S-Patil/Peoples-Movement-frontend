"use client";
import React, { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu, X, User, Newspaper } from "lucide-react";
import Link from "next/link";
import dynamic from "next/dynamic";

const Timeclock = dynamic(() => import("./Timeclock"), { ssr: false });

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navigation = [
    { name: "Home", href: "/" },
    { name: "About Us", href: "/about-us" },
    { name: "News", href: "/news" },
    { name: "Download Paper", href: "/paper" },
    { name: "Contact", href: "/contact" },
  ];

  const button_navigation = [
    { name: "Employee Login", href: "/login" },
    { name: "E-Paper", href: "/e-paper" },
  ];

  const logo_src = "/images/logo.png";

  const handleLinkClick = () => {
    setIsOpen(false);
  };

  return (
    <nav className="bg-white border-b">
      <div className="max-w-7xl min-h-24 mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-24 space-x-4">
          {/* Mobile Menu Trigger */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(true)}
              >
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] sm:w-[400px]">
              {/* Name */}
              <SheetHeader>
                <SheetTitle className="text-left">
                  <Link
                    href="/"
                    className="flex items-center space-x-2"
                    onClick={handleLinkClick}
                  >
                    <span className="text-2xl font-bold text-red-600">
                      पिपल्स
                    </span>
                    <span className="text-2xl font-bold text-blue-500">
                      मुव्हमेंट
                    </span>
                  </Link>
                </SheetTitle>
              </SheetHeader>
              <div className="flex flex-col space-y-4 mt-6">
                {/* Time Clock */}
                <div className="lg:hidden text-lg font-semibold text-center p-4">
                  <Timeclock />
                </div>

                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="text-gray-700 hover:text-gray-900 px-3 py-2 text-lg font-medium"
                    onClick={handleLinkClick}
                  >
                    {item.name}
                  </Link>
                ))}

                {/* Action Buttons */}
                <div className="pt-4 space-y-4 md:hidden">
                  {button_navigation.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className="text-gray-700 hover:text-gray-900 px-3 py-2 text-lg font-medium"
                      onClick={handleLinkClick}
                    >
                      <Button
                        name={item.name}
                        variant="outline"
                        className="w-full flex items-center space-x-2 justify-center"
                        onClick={handleLinkClick}
                      >
                        {item.name === "Employee Login" ? (
                          <User className="h-4 w-4" />
                        ) : (
                          <Newspaper className="h-4 w-4" />
                        )}
                        <span>{item.name}</span>
                      </Button>
                    </Link>
                  ))}
                </div>
              </div>
            </SheetContent>
          </Sheet>

          {/* Time Clock (for larger screens) */}
          <div className="hidden lg:block text-lg font-semibold text-center p-4">
            <Timeclock />
          </div>

          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <img
                src={logo_src}
                alt="logo"
                className="h-auto max-h-24 w-auto max-w-full object-contain"
              />
            </Link>
          </div>

          {/* Action Buttons */}
          <div className="hidden md:flex md:flex-row md:items-center md:space-x-2 md:py-3">
            {button_navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-gray-700 hover:text-gray-900 px-3 py-2 text-lg font-medium"
                onClick={handleLinkClick}
              >
                <Button
                  name={item.name}
                  variant="outline"
                  className="w-full flex items-center space-x-2 justify-center"
                  onClick={handleLinkClick}
                >
                  {item.name === "Employee Login" ? (
                    <User className="h-4 w-4" />
                  ) : (
                    <Newspaper className="h-4 w-4" />
                  )}
                  <span>{item.name}</span>
                </Button>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
