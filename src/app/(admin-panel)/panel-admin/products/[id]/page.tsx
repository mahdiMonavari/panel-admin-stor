import { getSingleProduct } from "@/src/features/product/action/getSingleProduct.action";
type pageType = {
  params: Promise<{ id: string }>;
};

async function page({ params }: pageType) {
  const { id } = await params;
  const res = await getSingleProduct(id);
  if (!res.success) {
    return;
  }
  return <div className="p-8 pr-10">page</div>;
}

export default page;
