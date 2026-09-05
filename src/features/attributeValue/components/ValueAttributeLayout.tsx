import getAttributeValue from "../query/getAttributeValue";
import { FilterAttributeValueType } from "../type/attributeValueFilters.type";
import AddNewValue from "./AddNewValue";

async function ValueAttributeLayout({
  queries,
}: {
  queries: Partial<FilterAttributeValueType>;
}) {
  const attributeValue = await getAttributeValue(queries);
  console.log(attributeValue);

  return (
    <div>
      <AddNewValue />
    </div>
  );
}

export default ValueAttributeLayout;
