"use client";

/**
 * External dependencies.
 */
import { useState, useEffect } from "react";
import {
  Navbar,
  Collapse,
  Typography,
  IconButton,
  List,
  ListItem,
} from "@material-tailwind/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";

/**
 * Internal dependencies.
 */
import AppSearch from "./AppSearch";

const NavList = () => {
  return (
    <List className="mt-4 mb-6 p-0 lg:mt-0 lg:mb-0 lg:flex-row lg:p-1">
      <Typography
        as="a"
        href="/apps"
        variant="small"
        color="blue-gray"
        className="font-medium text-base"
      >
        <ListItem className="flex items-center gap-2 py-2 pr-4">Apps</ListItem>
      </Typography>
      <Typography
        as="a"
        href="/categories"
        variant="small"
        color="blue-gray"
        className="font-medium text-base"
      >
        <ListItem className="flex items-center gap-2 py-2 pr-4">
          Categories
        </ListItem>
      </Typography>
      <Typography
        as="a"
        href="/about-us"
        variant="small"
        color="blue-gray"
        className="font-medium text-base"
      >
        <ListItem className="flex items-center gap-2 py-2 pr-4">
          About Us
        </ListItem>
      </Typography>
      <Typography
        as="a"
        href="/contact-us"
        variant="small"
        color="blue-gray"
        className="font-medium text-base"
      >
        <ListItem className="flex items-center gap-2 py-2 pr-4">
          Contact Us
        </ListItem>
      </Typography>
    </List>
  );
};

const NavbarWithMegaMenu = () => {
  const [openNav, setOpenNav] = useState(false);

  useEffect(() => {
    const handleResize = () => window.innerWidth >= 960 && setOpenNav(false);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="px-4">
      <Navbar className="w-full px-4 py-2 sm:py-3">
        <div className="flex items-center justify-between text-blue-gray-900">
          {/* Start */}
          <Typography
            as="a"
            href="/"
            variant="h6"
            className="mr-4 cursor-pointer py-1.5 lg:ml-2"
          >
            Super Integrated App
          </Typography>

          {/* Center */}
          <div className="hidden lg:block">
            <NavList />
          </div>

          {/* End */}
          <div className="hidden gap-2 lg:flex">
            {/* <Button variant="text" size="sm" color="blue-gray">
            Log In
          </Button>
          <Button variant="gradient" size="sm">
            Sign In
          </Button> */}
            <AppSearch />
          </div>

          <IconButton
            variant="text"
            color="blue-gray"
            className="lg:hidden"
            onClick={() => setOpenNav(!openNav)}
          >
            {openNav ? (
              <XMarkIcon className="h-6 w-6" strokeWidth={2} />
            ) : (
              <Bars3Icon className="h-6 w-6" strokeWidth={2} />
            )}
          </IconButton>
        </div>
        <Collapse open={openNav}>
          <NavList />
          <div className="flex w-full flex-nowrap items-center gap-2 lg:hidden">
            {/* <Button variant="outlined" size="sm" color="blue-gray" fullWidth>
            Log In
          </Button>
          <Button variant="gradient" size="sm" fullWidth>
            Sign In
          </Button> */}
            <AppSearch />
          </div>
        </Collapse>
      </Navbar>
    </div>
  );
};

export default NavbarWithMegaMenu;
