import getProducts from "../query/get.action";
import { ProductFilterType } from "../shema/productFilter";

type ProductsProps = {
  filterParams: ProductFilterType;
};
async function Products({ filterParams }: ProductsProps) {
  const products = await getProducts(filterParams);
  console.log(products);

  return <div className="p-5 min-h-50">محصولی برای نمایش وجود ندارد</div>;
}

export default Products;
