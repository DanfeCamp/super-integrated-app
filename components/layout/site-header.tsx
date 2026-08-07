"use client";

import { Menu } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import * as React from "react";

import { CommandMenu } from "@/components/layout/command-menu";
import { Logo } from "@/components/layout/logo";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { getToolIcon } from "@/data/tool-icons";
import { featuredTools, getCategory, toolCategories } from "@/data/tools";
import { mainNav } from "@/lib/site";
import { cn } from "@/lib/utils";

export function SiteHeader() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = React.useState(false);

  // Close the sheet on navigation — the dialog itself has no route awareness.
  // eslint-disable-next-line react-hooks/set-state-in-effect -- closing the sheet is a reaction to navigation, not derivable state.
  React.useEffect(() => setMobileOpen(false), [pathname]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className="surface-glass border-border/60 sticky top-0 z-40 w-full border-b">
      <div className="container-page flex h-16 items-center gap-3">
        <Logo />

        <nav
          aria-label="Main"
          className="ml-4 hidden items-center gap-1 lg:flex"
        >
          {mainNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive(item.href) ? "page" : undefined}
              className={cn(
                "relative rounded-md px-3 py-2 text-sm font-medium transition-colors",
                "hover:text-foreground focus-visible:ring-ring/40 focus-visible:ring-[3px] focus-visible:outline-none",
                isActive(item.href)
                  ? "text-foreground"
                  : "text-muted-foreground"
              )}
            >
              {item.title}
              {isActive(item.href) ? (
                <span
                  aria-hidden
                  className="bg-primary absolute inset-x-3 -bottom-[13px] h-0.5 rounded-full"
                />
              ) : null}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-1.5">
          <div className="hidden sm:block">
            <CommandMenu />
          </div>
          <ThemeToggle />

          <Dialog open={mobileOpen} onOpenChange={setMobileOpen}>
            <DialogTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden"
                aria-label="Open menu"
              >
                <Menu className="size-5" />
              </Button>
            </DialogTrigger>
            <DialogContent className="top-0 left-0 max-h-dvh max-w-none translate-x-0 translate-y-0 gap-0 overflow-y-auto rounded-none border-0 p-0 sm:top-1/2 sm:left-1/2 sm:max-h-[85vh] sm:max-w-md sm:-translate-x-1/2 sm:-translate-y-1/2 sm:rounded-xl sm:border">
              <DialogTitle className="sr-only">Site navigation</DialogTitle>
              <DialogDescription className="sr-only">
                Browse every page and tool category
              </DialogDescription>

              <div className="flex h-16 items-center border-b px-5">
                <Logo />
              </div>

              <div className="flex flex-col gap-7 px-5 py-6">
                <div className="sm:hidden">
                  <CommandMenu className="w-full" />
                </div>

                <MobileSection title="Browse">
                  {mainNav.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "hover:bg-accent rounded-md px-3 py-2.5 text-sm font-medium transition-colors",
                        isActive(item.href) &&
                          "bg-accent text-accent-foreground"
                      )}
                    >
                      {item.title}
                    </Link>
                  ))}
                </MobileSection>

                <MobileSection title="Categories">
                  {toolCategories.map((category) => (
                    <Link
                      key={category.id}
                      href={`/categories/${category.id}`}
                      className="hover:bg-accent rounded-md px-3 py-2.5 text-sm font-medium transition-colors"
                    >
                      {category.name}
                    </Link>
                  ))}
                </MobileSection>

                <MobileSection title="Popular tools">
                  {featuredTools.slice(0, 6).map((tool) => {
                    const Icon = getToolIcon(tool.slug);
                    return (
                      <Link
                        key={tool.slug}
                        href={`/apps/${tool.slug}`}
                        className="hover:bg-accent flex items-center gap-2.5 rounded-md px-3 py-2.5 text-sm font-medium transition-colors"
                      >
                        <Icon
                          className={cn(
                            "size-4",
                            getCategory(tool.category).foreground
                          )}
                          aria-hidden
                        />
                        {tool.name}
                      </Link>
                    );
                  })}
                </MobileSection>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </header>
  );
}

function MobileSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="flex flex-col gap-1">
      <h2 className="text-muted-foreground mb-1 px-3 text-xs font-semibold tracking-wider uppercase">
        {title}
      </h2>
      {children}
    </section>
  );
}
