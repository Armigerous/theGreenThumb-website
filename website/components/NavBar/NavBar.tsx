"use client";

import React from "react";
import {
  Navbar as NextUINavbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenu,
  NavbarMenuItem,
  Link,
  NavbarMenuToggle,
} from "@nextui-org/react";
import NextLink from "next/link";

import siteMetaData from "@/lib/siteMetaData";
import { nav } from "./nav";
import DropdownFeatures from "./DropdownFeatures";
import {
  FacebookIconBlack,
  InstagramIconBlack,
  YoutubeIconBlack,
} from "../Icons";
import { cn } from "@/lib/utils";
import { MaxWidthWrapper } from "../maxWidthHeader";

const NavBar = () => {
  return (
    <NextUINavbar shouldHideOnScroll isBordered maxWidth="full">
      <MaxWidthWrapper className="flex">
        {/* Logo */}
        <NavbarBrand>
          <NextLink href="/">
            <p className="font-bold text-3xl">The GreenThumb</p>
          </NextLink>
        </NavbarBrand>

        {/* Centered Navigation */}
        <NavbarContent className="hidden lg:flex" justify="center">
          <DropdownFeatures />
          <ul className="flex gap-4 ml-2">
            {nav.navItems.map((item) => (
              <NavbarItem key={item.href}>
                <NextLink
                  className={cn(
                    "data-[active=true]:text-secondary data-[active=true]:font-bold text-xl"
                  )}
                  href={item.href}
                >
                  {item.label}
                </NextLink>
              </NavbarItem>
            ))}
          </ul>
        </NavbarContent>

        {/* Icons on the Right */}
        <NavbarContent justify="end">
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

      <NavbarMenu>
        <div className="mx-4 mt-2 flex flex-col gap-5">
          {nav.navMenuItems.map((item) => (
            <NavbarMenuItem key={`${item}`}>
              <Link
                href={item.href}
                size="lg"
                className="text-black flex justify-center items-center text-3xl"
              >
                {item.label}
              </Link>
            </NavbarMenuItem>
          ))}
        </div>
      </NavbarMenu>
    </NextUINavbar>
  );
};

export default NavBar;
