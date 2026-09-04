import UsersLayout from "@/src/features/user/components/UsersLayout";
import { getUsers } from "@/src/features/user/query/getUser";
import { UserFilterType } from "@/src/features/user/types/userFilter.type";

async function page({
  searchParams,
}: {
  searchParams: Promise<Partial<UserFilterType>>;
}) {
  const params = await searchParams;
  const users = await getUsers(params);
  if (!users.success) {
    return (
      <div className="h-10 text-center font-Dana-Medium text-gray-200 bg-red-500/50 border-red-600/80">
        {users.errorMessage}
      </div>
    );
  }

  return (
    <div>
      <UsersLayout users={users.data} />
    </div>
  );
}

export default page;
