import CategoryLayout, {
  categories,
} from "@/src/features/category/components/CategoryLayout";
import getCategories from "@/src/features/category/query/categories.get";

async function page() {
  const res = await getCategories();
  if (!res.success) {
    return (
      <div className="px-6 py-3 bg-rose-500/50 text-rose-600">
        {res.message}
      </div>
    );
  }
  return (
    <div className="p-8 dark:bg-neutral-900 min-h-screen bg-gray-50">
      <CategoryLayout categories={res.data} />
    </div>
  );
}

export default page;
