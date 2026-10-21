"use client";

import Link from "next/link";
import { ArrowUpRight, ChevronRight, Menu } from "lucide-react";
import type { MenuNode } from "@/lib/menus";
import type { SiteIdentity } from "@/lib/settings";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ThemeToggle } from "@/components/ThemeToggle";
import { cn } from "@/lib/utils";

const DESKTOP_MENU_LIMIT = 4;

function href(item: MenuNode) {
  return item.href || "#";
}

function flatten(items: MenuNode[], depth = 0): { item: MenuNode; depth: number }[] {
  return items.flatMap((item) => [
    { item, depth },
    ...flatten(item.children ?? [], depth + 1),
  ]);
}

function DesktopLink({ item, className }: { item: MenuNode; className?: string }) {
  return (
    <NavigationMenuLink asChild>
      <Link
        href={href(item)}
        target={item.target}
        rel={item.target === "_blank" ? "noopener noreferrer" : undefined}
        className={cn(navigationMenuTriggerStyle(), className)}
      >
        {item.label}
      </Link>
    </NavigationMenuLink>
  );
}

function DesktopDropdown({ item }: { item: MenuNode }) {
  return (
    <NavigationMenuItem>
      <NavigationMenuTrigger className="h-10 px-3 text-sm">
        {item.label}
      </NavigationMenuTrigger>
      <NavigationMenuContent>
        <ul className="grid w-[min(22rem,calc(100vw-2rem))] gap-1 p-3">
          {item.href !== "#" && (
            <li>
              <DesktopLink
                item={{ ...item, children: undefined }}
                className="h-auto w-full justify-between px-3 py-2 font-semibold"
              />
            </li>
          )}
          {flatten(item.children ?? []).map(({ item: child, depth }) => (
            <li key={child.id}>
              <DesktopLink
                item={child}
                className={cn(
                  "h-auto w-full justify-between px-3 py-2 font-normal text-muted-foreground hover:text-foreground",
                  depth > 0 && "pl-7",
                )}
              />
            </li>
          ))}
        </ul>
      </NavigationMenuContent>
    </NavigationMenuItem>
  );
}

function DesktopItem({ item }: { item: MenuNode }) {
  if (item.children?.length) return <DesktopDropdown item={item} />;

  return (
    <NavigationMenuItem>
      <DesktopLink item={item} className="h-10 px-3 text-sm" />
    </NavigationMenuItem>
  );
}

function DesktopMore({ items }: { items: MenuNode[] }) {
  if (!items.length) return null;

  return (
    <NavigationMenuItem>
      <NavigationMenuTrigger className="h-10 px-3 text-sm">Lainnya</NavigationMenuTrigger>
      <NavigationMenuContent>
        <ul className="grid w-[min(22rem,calc(100vw-2rem))] gap-1 p-3">
          {items.map((item) => (
            <li key={item.id}>
              {item.href !== "#" ? (
                <DesktopLink
                  item={{ ...item, children: undefined }}
                  className="h-auto w-full justify-between px-3 py-2 font-semibold"
                />
              ) : (
                <p className="px-3 py-2 text-sm font-semibold">{item.label}</p>
              )}
              {flatten(item.children ?? []).map(({ item: child, depth }) => (
                <DesktopLink
                  key={child.id}
                  item={child}
                  className={cn(
                    "h-auto w-full justify-between px-3 py-2 font-normal text-muted-foreground hover:text-foreground",
                    depth > 0 && "pl-7",
                  )}
                />
              ))}
            </li>
          ))}
        </ul>
      </NavigationMenuContent>
    </NavigationMenuItem>
  );
}

function MobileEntries({ items, level = 0 }: { items: MenuNode[]; level?: number }) {
  return (
    <ul className={cn("flex flex-col gap-1", level > 0 && "ml-3 border-l pl-3")}>
      {items.map((item) => (
        <li key={item.id}>
          {item.children?.length ? (
            <details className="group rounded-md">
              <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between rounded-md px-3 py-2 text-sm font-medium hover:bg-accent [&::-webkit-details-marker]:hidden">
                {item.label}
                <ChevronRight aria-hidden="true" className="size-4 transition-transform group-open:rotate-90" />
              </summary>
              <div className="flex flex-col gap-1 py-1">
                {item.href !== "#" && (
                  <SheetClose asChild>
                    <Link href={href(item)} className="rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-accent hover:text-foreground">
                      Semua {item.label}
                    </Link>
                  </SheetClose>
                )}
                <MobileEntries items={item.children} level={level + 1} />
              </div>
            </details>
          ) : (
            <SheetClose asChild>
              <Link
                href={href(item)}
                target={item.target}
                rel={item.target === "_blank" ? "noopener noreferrer" : undefined}
                className="flex min-h-11 items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent"
              >
                {item.label}
              </Link>
            </SheetClose>
          )}
        </li>
      ))}
    </ul>
  );
}

export function NavbarClient({
  items,
  title,
  logo,
  identity,
}: {
  items: MenuNode[];
  title: string;
  logo: string;
  identity: SiteIdentity;
}) {
  const socials = [
    ["Facebook", identity.facebook],
    ["Instagram", identity.instagram],
    ["YouTube", identity.youtube],
  ].filter((item) => item[1]);
  const hasContact = identity.phone || identity.email || socials.length > 0;
  const desktopItems = items.slice(0, DESKTOP_MENU_LIMIT);
  const overflowItems = items.slice(DESKTOP_MENU_LIMIT);

  return (
    <>
      <a href="#konten-utama" className="skip-link">Lewati ke konten utama</a>
      <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur">
        {hasContact && (
          <div className="bg-[var(--echo-text)] text-[var(--echo-surface)]">
            <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-2 px-4 py-2 text-xs sm:px-6">
              <address className="flex flex-wrap gap-x-5 gap-y-1 not-italic">
                {identity.phone && <a href={`tel:${identity.phone}`}>{identity.phone}</a>}
                {identity.email && <a href={`mailto:${identity.email}`}>{identity.email}</a>}
              </address>
              <nav aria-label="Media sosial" className="flex gap-4">
                {socials.map(([name, url]) => (
                  <a key={name} href={url!} target="_blank" rel="noopener noreferrer">{name}</a>
                ))}
              </nav>
            </div>
          </div>
        )}
        <div className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4 sm:px-6">
          <Link href="/" className="flex min-w-0 shrink-0 items-center gap-2 text-foreground">
            {logo && <img src={logo} alt="" width={36} height={36} className="size-9 shrink-0 object-contain" />}
            <span className="max-w-[8rem] truncate text-base font-bold tracking-tight sm:max-w-[12rem]">{title}</span>
          </Link>

          <NavigationMenu className="hidden min-w-0 flex-1 xl:flex">
            <NavigationMenuList className="flex-nowrap gap-0">
              {desktopItems.map((item) => <DesktopItem key={item.id} item={item} />)}
              <DesktopMore items={overflowItems} />
            </NavigationMenuList>
          </NavigationMenu>

          <div className="ml-auto flex shrink-0 items-center gap-2">
            <div className="hidden xl:block"><ThemeToggle /></div>
            <Button asChild size="sm" className="hidden xl:inline-flex">
              <Link href="/spmb">
                SPMB Online
                <ArrowUpRight aria-hidden="true" data-icon="inline-end" />
              </Link>
            </Button>
            <div className="xl:hidden"><ThemeToggle /></div>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="xl:hidden" aria-label="Buka menu navigasi">
                  <Menu aria-hidden="true" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="flex w-[calc(100vw-1rem)] max-w-sm flex-col gap-5 overflow-y-auto p-5">
                <SheetHeader className="pr-8 text-left">
                  <SheetTitle>Menu utama</SheetTitle>
                  <SheetDescription>Pilih halaman yang ingin dibuka.</SheetDescription>
                </SheetHeader>
                <nav aria-label="Menu navigasi mobile">
                  <MobileEntries items={items} />
                </nav>
                <SheetClose asChild>
                  <Link href="/spmb" className={cn(buttonVariants({ size: "lg" }), "mt-auto w-full")}>
                    SPMB Online
                    <ArrowUpRight aria-hidden="true" className="ml-2 size-4" />
                  </Link>
                </SheetClose>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>
    </>
  );
}
