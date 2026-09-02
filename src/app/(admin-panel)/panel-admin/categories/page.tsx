import Link from "next/link";

function page() {
  return (
    <div className="p-8 dark:bg-neutral-900 min-h-screen bg-gray-50">
      <div className="flex items-center justify-center gap-5 flex-wrap">
        <Link
          href="/panel-admin/categories/category"
          className="px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200
               bg-gray-50 hover:bg-pink-200 border border-pink-200
               dark:bg-gray-950/30 dark:border-purple-800/40 dark:hover:bg-pink-950/50"
        >
          <span className="bg-linear-to-r from-pink-700 via-rose-500 text-3xl to-pink-700 bg-clip-text text-transparent">
            دسته‌بندی‌ها
          </span>
        </Link>

        {/* لینک مقادیر و ویژگی‌ها: تناژ فیروزه‌ای و لاجوردی (یا کهربایی/رز) */}
        <Link
          href="/panel-admin/categories/attrebute"
          className="px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200
               bg-teal-50 hover:bg-teal-100/80 border border-teal-200/60
               dark:bg-teal-950/30 dark:border-teal-800/40 dark:hover:bg-teal-950/50"
        >
          <span className="bg-linear-to-r from-cyan-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent text-3xl">
            مقادیر و ویژگی‌ها
          </span>
        </Link>
      </div>
    </div>
  );
}

export default page;
