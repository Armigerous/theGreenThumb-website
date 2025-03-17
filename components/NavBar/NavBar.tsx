"use client";

import { Button } from "@/components/ui/button";
import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
import {
  Link,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenu,
  NavbarMenuItem,
  NavbarMenuToggle,
  Navbar as NextUINavbar,
} from "@nextui-org/react";
import NextLink from "next/link";

import siteMetaData from "@/lib/siteMetaData";
import { usePathname } from "next/navigation";
import {
  FacebookIconBlack,
  InstagramIconBlack,
  YoutubeIconBlack,
} from "../Icons";
import { MaxWidthWrapper } from "../maxWidthWrapper";
import DropdownFeatures from "./DropdownFeatures";
import { navMenuItems } from "./nav";
import { Leaf } from "lucide-react";

const NavBar = () => {
  const pathname = usePathname(); // Get the current pathname

  return (
    <NextUINavbar
      shouldHideOnScroll
      isBordered
      maxWidth="full"
      className="bg-white"
      classNames={{
        item: [
          "flex",
          "relative",
          "h-full",
          "items-center",
          "data-[active=true]:after:content-['']",
          "data-[active=true]:after:absolute",
          "data-[active=true]:after:bottom-0",
          "data-[active=true]:after:left-0",
          "data-[active=true]:after:right-0",
          "data-[active=true]:after:h-[2px]",
          "data-[active=true]:after:rounded-[2px]",
          "data-[active=true]:after:bg-primary",
        ],
      }}
    >
      <MaxWidthWrapper className="flex">
        {/* Logo */}
        <NavbarBrand>
          <NextLink href="/">
            <p className="font-bold text-3xl">The GreenThumb</p>
          </NextLink>
        </NavbarBrand>

        {/* Centered Navigation */}
        <NavbarContent className="hidden lg:flex" justify="center">
          <NavbarItem className="transition hover:text-primary">
            <DropdownFeatures />
          </NavbarItem>
          <NavbarItem isActive={pathname === "/plants"}>
            <Link
              href="/plants"
              className="text-black text-lg transition hover:text-primary"
            >
              Plants
            </Link>
          </NavbarItem>
          <NavbarItem isActive={pathname === "/tips"}>
            <Link
              href="/tips"
              className="text-black text-lg transition hover:text-primary"
            >
              Tips
            </Link>
          </NavbarItem>
          <NavbarItem isActive={pathname === "/contact"}>
            <Link
              href="/contact"
              className="text-black text-lg transition hover:text-primary"
            >
              Contact
            </Link>
          </NavbarItem>
          <NavbarItem isActive={pathname === "/about"}>
            <Link
              href="/about"
              className="text-black text-lg transition hover:text-primary"
            >
              About
            </Link>
          </NavbarItem>
        </NavbarContent>

        {/* Icons and Auth on the Right */}
        <NavbarContent className="hidden lg:flex" justify="end">
          <NavbarItem>
            <Link
              isExternal
              aria-label="Facebook"
              href={siteMetaData.facebook}
              className="hover:scale-125 transition-all ease-in"
            >
              <FacebookIconBlack />
            </Link>
          </NavbarItem>
          <NavbarItem>
            <Link
              isExternal
              aria-label="Instagram"
              href={siteMetaData.instagram}
              className="hover:scale-125 transition-all ease-in"
            >
              <InstagramIconBlack />
            </Link>
          </NavbarItem>
          <NavbarItem>
            <Link
              isExternal
              aria-label="Youtube"
              href={siteMetaData.youtube}
              className="hover:scale-125 transition-all ease-in"
            >
              <YoutubeIconBlack />
            </Link>
          </NavbarItem>

          <NavbarItem className="ml-4">
            <SignedOut>
              <div className="flex gap-2">
                <SignInButton mode="modal">
                  <Button
                    variant="ghost"
                    className="text-black hover:text-primary transition"
                  >
                    Sign In
                  </Button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <Button
                    variant="default"
                    className="bg-primary text-cream-50 hover:bg-primary/90 transition"
                  >
                    Sign Up
                  </Button>
                </SignUpButton>
              </div>
            </SignedOut>
            <SignedIn>
              <UserButton
                appearance={{
                  elements: {
                    userButtonAvatarBox: "",
                    userButtonTrigger: "w-10 h-10",
                  },
                }}
              >
                <UserButton.MenuItems>
                  <UserButton.Link
                    label="My Garden"
                    labelIcon={<Leaf className="w-4 h-4" />}
                    href="/my-garden"
                  />
                  <UserButton.Action label="manageAccount" />
                  <UserButton.Action label="signOut" />
                </UserButton.MenuItems>
              </UserButton>
            </SignedIn>
          </NavbarItem>
        </NavbarContent>
      </MaxWidthWrapper>

      {/* Mobile Menu Toggle */}
      <NavbarContent className="lg:hidden pl-4">
        <NavbarMenuToggle />
      </NavbarContent>

      <NavbarMenu className="items-center gap-6 h-full justify-center">
        {navMenuItems.map((item, index) => (
          <NavbarMenuItem key={`${item}-${index}`}>
            <Link
              className="w-full text-4xl font-semibold transition hover:text-primary"
              href={item.href}
              size="lg"
            >
              {item.label}
            </Link>
          </NavbarMenuItem>
        ))}

        {/* Mobile Auth - Updated */}
        <NavbarMenuItem className="flex justify-center mt-4">
          <SignedOut>
            <div className="flex gap-4">
              <SignInButton mode="modal">
                <Button
                  variant="ghost"
                  className="text-black hover:text-primary transition"
                >
                  Sign In
                </Button>
              </SignInButton>
              <SignUpButton mode="modal">
                <Button
                  variant="default"
                  className="bg-primary text-cream-50 hover:bg-primary/90 transition"
                >
                  Sign Up
                </Button>
              </SignUpButton>
            </div>
          </SignedOut>
          <SignedIn>
            <UserButton
              appearance={{
                elements: {
                  userButtonAvatarBox: "",
                  userButtonTrigger: "w-10 h-10",
                },
              }}
            >
              <UserButton.MenuItems>
                <UserButton.Link
                  label="My Garden"
                  labelIcon={<Leaf className="w-4 h-4" />}
                  href="/my-garden"
                />
                <UserButton.Action label="manageAccount" />
                <UserButton.Action label="signOut" />
              </UserButton.MenuItems>
            </UserButton>
          </SignedIn>
        </NavbarMenuItem>
      </NavbarMenu>
    </NextUINavbar>
  );
};

export default NavBar;
