import { getSingleProduct } from "@/src/features/product/action/getSingleProduct.action";
import SingleProduct from "@/src/features/product/components/singleProduct/SingleProduct";
import { notFound } from "next/navigation"; // اضافه کردن این

type pageType = {
  params: Promise<{ id: string }>;
};

async function page({ params }: pageType) {
  const { id } = await params;
  const res = await getSingleProduct(id);

  if (!res.success) {
    if (res.message === "محصولی با این آیدی یافت نشد") {
      notFound();
    }

    return (
      <div className="flex items-center justify-center min-h-screen text-red-500">
        <p>{res.message}</p>
      </div>
    );
  }
  const product = res.data;
  const serializedProduct = {
    ...product,
    variants: product.variants.map((variant) => ({
      ...variant,
      price: variant.price ? Number(variant.price) : 0,
      discountPercent: variant.discountPercent
        ? Number(variant.discountPercent)
        : 0,
    })),
  };
  return (
    <div className="p-8 pr-10 min-h-screen bg-gray-50 dark:bg-neutral-900">
      <SingleProduct product={serializedProduct} id={id} />
    </div>
  );
}

export default page;
