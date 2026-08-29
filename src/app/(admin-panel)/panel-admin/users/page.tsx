import { getUsers } from "@/src/features/user/query/getUser";
import { UserFilterType } from "@/src/features/user/types/userFilter.type";

async function page({
  searchParams,
}: {
  searchParams: Promise<Partial<UserFilterType>>;
}) {
  const params = await searchParams;
  const users = await getUsers(params);
  console.log(users);

  return <div>user</div>;
}

export default page;
