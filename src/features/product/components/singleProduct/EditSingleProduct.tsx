"use client";

type EditSingleProduct = {
  id: string;
  productName: string;
};

function EditSingleProduct({ id, productName }: EditSingleProduct) {
  return (
    <button className="px-5 py-2.5 text-sm font-medium rounded-2xl bg-violet-600 text-white hover:bg-violet-700 active:scale-[0.985] transition-all">
      ویرایش محصول
    </button>
  );
}

export default EditSingleProduct;
