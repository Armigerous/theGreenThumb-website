"use client";

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
import {
  FacebookIconBlack,
  InstagramIconBlack,
  YoutubeIconBlack,
} from "../Icons";
import { MaxWidthWrapper } from "../maxWidthWrapper";
import DropdownFeatures from "./DropdownFeatures";
import { navMenuItems } from "./nav";
import { usePathname } from "next/navigation";

const NavBar = () => {
  const pathname = usePathname(); // Get the current pathname

  return (
    <NextUINavbar
      shouldHideOnScroll
      isBordered
      maxWidth="full"
      className="bg-cream-100"
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
          <NavbarItem>
            <DropdownFeatures />
          </NavbarItem>
          <NavbarItem isActive={pathname === "/plants"}>
            <Link href="/plants" className="text-black text-lg">
              Plants
            </Link>
          </NavbarItem>
          <NavbarItem isActive={pathname === "/tips"}>
            <Link href="/tips" className="text-black text-lg">
              Tips
            </Link>
          </NavbarItem>
          <NavbarItem isActive={pathname === "/contact"}>
            <Link href="/contact" className="text-black text-lg">
              Contact
            </Link>
          </NavbarItem>
          <NavbarItem isActive={pathname === "/about"}>
            <Link href="/about" className="text-black text-lg">
              About
            </Link>
          </NavbarItem>
        </NavbarContent>

        {/* Icons on the Right */}
        <NavbarContent className="hidden lg:flex" justify="end">
          <NavbarItem>
            <Link isExternal aria-label="Facebook" href={siteMetaData.facebook}>
              <FacebookIconBlack />
            </Link>
          </NavbarItem>
          <NavbarItem>
            <Link
              isExternal
              aria-label="Instagram"
              href={siteMetaData.instagram}
            >
              <InstagramIconBlack />
            </Link>
          </NavbarItem>
          <NavbarItem>
            <Link isExternal aria-label="Youtube" href={siteMetaData.youtube}>
              <YoutubeIconBlack />
            </Link>
          </NavbarItem>
        </NavbarContent>
      </MaxWidthWrapper>

      {/* Mobile Menu Toggle */}
      <NavbarContent className="sm:hidden pl-4">
        <NavbarMenuToggle />
      </NavbarContent>

      <NavbarMenu className="items-center gap-12 h-full justify-center">
        {navMenuItems.map((item, index) => (
          <NavbarMenuItem key={`${item}-${index}`}>
            <Link className="w-full text-4xl" href={item.href} size="lg">
              {item.label}
            </Link>
          </NavbarMenuItem>
        ))}
      </NavbarMenu>
    </NextUINavbar>
  );
};

export default NavBar;
