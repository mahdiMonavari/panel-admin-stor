"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type AdminRoute = {
  path: string;
  name: string;
};

export const adminRoutes: AdminRoute[] = [
  { path: "/panel-admin", name: "داشبرد" },
  { path: "/panel-admin/users", name: "یوزرز" },
  { path: "/panel-admin/products", name: "پروداکتس" },
  { path: "/panel-admin/tickets", name: "تیکت" },
  { path: "/panel-admin/categories", name: "کتگوری" },
  { path: "/panel-admin/orders", name: "سفارشات" },
  { path: "/panel-admin/payments", name: "پرداخت‌ها" },
  { path: "/panel-admin/comments", name: "کامنت‌ها" },
  { path: "/panel-admin/discounts", name: "تخفیف‌ها" },
  { path: "/panel-admin/promotions", name: "پروموشن" },
  { path: "/panel-admin/articles", name: "مقالات" },
  { path: "/panel-admin/articles/categories", name: "دسته‌بندی مقالات" },
];

function isActiveRoute(pathname: string, routePath: string) {
  const matched = adminRoutes
    .filter(
      (route) =>
        pathname === route.path || pathname.startsWith(`${route.path}/`),
    )
    .sort((a, b) => b.path.length - a.path.length)[0];

  return matched?.path === routePath;
}

function AdminLink() {
  const pathname = usePathname();

  return (
    <nav
      className=" overflow-auto max-h-130 flex flex-col gap-1.5 rounded-2xl border custom-scrollbar-panel
     border-neutral-200 bg-white p-3 shadow-sm dark:border-neutral-800 dark:bg-neutral-950"
    >
      {adminRoutes.map((route) => {
        const isActive = isActiveRoute(pathname, route.path);

        return (
          <Link
            key={route.path}
            href={route.path}
            className={`
              group relative flex items-center gap-3 rounded-xl px-4 py-3 text-sm
              transition-all duration-200 ease-out font-Dana-Medium
              ${
                isActive
                  ? "bg-linear-to-r from-neutral-300 to-neutral-800 text-white shadow-md dark:from-neutral-700 dark:to-neutral-200 dark:text-neutral-900"
                  : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-neutral-100"
              }
            `}
          >
            {isActive && (
              <div className="absolute -left-1 top-1/2 h-6 w-1 -translate-y-1/2 rounded-full bg-white dark:bg-neutral-900" />
            )}

            <span className="flex-1">{route.name}</span>

            {isActive && (
              <div className="h-1.5 w-1.5 rounded-full bg-white/80 dark:bg-neutral-900/80" />
            )}
          </Link>
        );
      })}
    </nav>
  );
}

export default AdminLink;
