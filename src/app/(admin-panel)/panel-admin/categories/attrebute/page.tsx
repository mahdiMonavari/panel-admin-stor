import AttrebuteLayout from "@/src/features/attrebute/components/AttrebuteLayout";
import { getAttributes } from "@/src/features/attrebute/query/getAttribut.query";
import { AttributeFilter } from "@/src/features/attrebute/type/attributeFilter.type";

async function page({
  searchParams,
}: {
  searchParams: Promise<Partial<AttributeFilter>>;
}) {
  const params = await searchParams;

  const res = await getAttributes(params);
  if (!res.success) {
    return (
      <div className="bg-rose-600/30 mt-5 px-3 py-1 text-rose-900 rounded-md block text-center">
        {res.errorMessage}
      </div>
    );
  }

  return (
    <div className="p-8 pr-10 dark:bg-neutral-900 min-h-screen bg-gray-50 overflow-x-hidden">
      <AttrebuteLayout attrebutes={res.data} totla={res.meta.totla} />
    </div>
  );
}

export default page;
