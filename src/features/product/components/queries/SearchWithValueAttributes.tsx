"use client";
import { Prisma } from "@/generated/prisma/client";
import getAttributeValueWithCategoryIds, {
  AttributeValueFilterProdicts,
} from "@/src/features/attrebute/actions/attributeValue.getByCategories";
import { ChevronDown } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useEffect, useState, useTransition } from "react";

function SearchWithValueAttributes() {
  const queries = useSearchParams();
  const searchParams = queries.get("categories");
  const [values, setValues] = useState<AttributeValueFilterProdicts[]>([]);

  const [isPending, startTransition] = useTransition();
  const [expanded, setExpanded] = useState(false);
  useEffect(() => {
    startTransition(async () => {
      if (searchParams) {
        const res = await getAttributeValueWithCategoryIds(searchParams);
        console.log(res);
      }
    });
  }, [searchParams]);
  return (
    <div className="relative z-20 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-200/80 bg-white/60 p-4 shadow-sm backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/60">
      <div className="flex items-center gap-2.5">
        <button
          type="button"
          className="flex h-7 w-7 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition-all hover:border-teal-500 hover:text-teal-600 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-300 dark:hover:border-teal-400 dark:hover:text-teal-400"
          onClick={() => setExpanded((prev) => !prev)}
          aria-label={expanded ? "بستن زیرمجموعه" : "بازکردن زیرمجموعه"}
        >
          <ChevronDown
            className={`h-4 w-4 transition-transform duration-200 ${
              expanded ? "" : "-rotate-90 rtl:rotate-90"
            }`}
          />
        </button>
        فیلترهای پیشرفته
      </div>
    </div>
  );
}

export default SearchWithValueAttributes;
