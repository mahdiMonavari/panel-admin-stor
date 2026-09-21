import getCategories from "@/src/features/category/query/categories.get";
import ProductLayout from "@/src/features/product/components/ProductLayout";
import { ProductFilterType } from "@/src/features/product/shema/productFilter";

async function page({
  searchParams,
}: {
  searchParams: Promise<ProductFilterType>;
}) {
  const categories = await getCategories();
  const params = await searchParams;

  if (!categories.success) {
    return (
      <div className="h-10 text-center font-Dana-Medium text-gray-200 bg-red-500/50 border-red-600/80">
        {categories.message}
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-gray-50 pr-10 dark:bg-neutral-900 p-8">
      <ProductLayout categories={categories.data} filterParams={params} />
    </div>
  );
}

export default page;
