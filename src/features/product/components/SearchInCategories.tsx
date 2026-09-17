"use client";
import React from "react";
import { CategoryWithRelations } from "../../category/type/category.type";
import { FiLoader, FiSearch, FiX } from "react-icons/fi";
import { useEffect, useMemo, useState, useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { IoClose } from "react-icons/io5";

type SearchInCategoriesProp = {
  categories: CategoryWithRelations[];
};
const queryKey = "categories";
function SearchInCategories({ categories }: SearchInCategoriesProp) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathName = usePathname();
  const [isPending, startTransition] = useTransition();
  const [search, setSearch] = useState("");
  const handleClear = () => setSearch("");
  const params = new URLSearchParams(searchParams);
  const categoriesShow = useMemo(() => {
    return categories.filter((category) =>
      category.name.toLowerCase().includes(search.trim().toLowerCase()),
    );
  }, [categories, search]);
  const [selected, setSelected] = useState<Map<string, CategoryWithRelations>>(
    () => {
      const map = new Map<string, CategoryWithRelations>();
      const raw = searchParams.get(queryKey);
      if (!raw) return map;
      const ids = raw.split(",");
      ids.forEach((id) => {
        const cat = categories.find((c) => c.id === id);
        if (cat) map.set(id, cat);
      });
      return map;
    },
  );
  useEffect(() => {
    const timer = setTimeout(() => {
      startTransition(() => {
        if (selected.size > 0) {
          const values = Array.from(selected.values())
            .map((item) => (typeof item === "object" ? item.id : item))
            .join(",");
          params.set(queryKey, values);
        } else {
          params.delete(queryKey);
        }

        params.set("page", "1");

        router.replace(`${pathName}?${params.toString()}`, { scroll: false });
      });
    }, 500);
    return () => clearTimeout(timer);
  }, [selected]);
  const toggleSelect = (id: string) => {
    const category = categories.find((cate) => cate.id === id);
    if (category) {
      const isExist = selected.has(id);
      if (isExist) {
        setSelected((prev) => {
          const next = new Map(prev);
          next.delete(id);
          return next;
        });
      } else {
        setSelected((prev) => new Map(prev).set(id, category));
      }
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className="relative flex items-center h-11 w-full max-w-55">
        {/* آیکون ذره‌بین سمت راست (شروع اینپوت در زبان فارسی) */}
        <div className="pointer-events-none absolute right-3.5 flex items-center text-neutral-400 dark:text-neutral-500">
          <FiSearch className="h-4 w-4" />
        </div>
        {/* اینپوت اصلی */}
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="جستجو براثاث دسته بندی"
          className="h-full w-full rounded-xl border border-neutral-200 bg-white pr-10 peer
             pl-10 text-sm font-medium text-neutral-800 placeholder-neutral-400 shadow-sm outline-none transition-all duration-200 hover:border-neutral-300 focus:border-neutral-900 focus:ring-4 focus:ring-neutral-900/5 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-100 dark:placeholder-neutral-600 dark:hover:border-neutral-700 dark:focus:border-neutral-100 dark:focus:ring-white/5 placeholder:text-xs placeholder:font-shabnam-bold placeholder:tracking-[-0.15rem]"
        />

        <div
          className="absolute z-50 top-full peer-focus:opacity-100 peer-focus:visible opacity-0 invisible transition-all duration-300
        max-h-72 overflow-y-auto"
        >
          <div className="pt-2 bg-transparent w-2xs">
            <ul className="space-y-1 bg-white dark:bg-slate-900 p-2 rounded-2xl">
              {categoriesShow.length ? (
                categoriesShow.map((cate, index) => (
                  <React.Fragment key={cate.id}>
                    <li
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => toggleSelect(cate.id)}
                      className={`hover:bg-teal-400/20 transition-all duration-200 px-5 py-1.5 rounded-md text-slate-800 dark:text-slate-200 cursor-pointer relative                      
              ${selected.has(cate.id) ? "bg-teal-200/30 font-medium" : ""}`}
                    >
                      {cate.name}
                      {selected.has(cate.id) && (
                        <IoClose
                          className="size-3.5 text-zinc-400 group-hover:text-zinc-600
                  dark:group-hover:text-zinc-300 absolute top-1/2 left-2 -translate-y-1/2"
                        />
                      )}
                    </li>

                    {/* دیوایدر با تگ span - به جز آیتم آخر */}
                    {index < categoriesShow.length - 1 && (
                      <span className="block h-px w-full bg-zinc-100 dark:bg-slate-800 my-1" />
                    )}
                  </React.Fragment>
                ))
              ) : (
                <span className="block p-2 text-rose-300 text-center text-xs">
                  چیزی پیدا نشد
                </span>
              )}
            </ul>
          </div>
        </div>
        {/* وضعیت لودینگ یا دکمه پاک کردن در سمت چپ */}
        <div className="absolute left-3 flex items-center gap-x-1.5">
          {isPending ? (
            <FiLoader className="h-4 w-4 animate-spin text-neutral-500 dark:text-neutral-400" />
          ) : search ? (
            <button
              type="button"
              onClick={handleClear}
              className="flex h-5 w-5 items-center justify-center rounded-full bg-neutral-100 text-neutral-500 transition-colors hover:bg-neutral-200 hover:text-neutral-800 dark:bg-neutral-800 dark:text-neutral-400 dark:hover:bg-neutral-700 dark:hover:text-neutral-200"
              title="پاک کردن"
            >
              <FiX className="h-3 w-3" />
            </button>
          ) : null}
        </div>
      </div>
      {Array.from(selected.values()).map((item) => (
        <button
          type="button"
          onClick={() => toggleSelect(item.id)}
          key={item.id}
          className="group inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium
             rounded-md transition-all duration-150 select-none cursor-pointer border
             bg-zinc-50 text-zinc-600 border-zinc-200 hover:bg-zinc-100 hover:text-zinc-900
             dark:bg-zinc-900 dark:text-zinc-400 dark:border-zinc-800 dark:hover:bg-zinc-800"
        >
          <span>{item.name}</span>
          <IoClose className="size-3.5 opacity-0 -ml-1 transition-all duration-150 group-hover:opacity-100 group-hover:ml-0 text-zinc-400 group-hover:text-zinc-600 dark:group-hover:text-zinc-300" />
        </button>
      ))}
    </div>
  );
}

export default SearchInCategories;
