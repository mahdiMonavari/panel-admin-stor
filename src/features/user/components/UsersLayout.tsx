import { FaTableCells } from "react-icons/fa6";
import { UserType } from "../types/user.type";
import { FaAddressCard } from "react-icons/fa";

function UsersLayout({ users }: { users: UserType[] }) {
  return (
    <div className="p-5 bg-gray-50 min-h-screen">
      نمایش به شکل
      <FaTableCells />
      <FaAddressCard />
    </div>
  );
}

export default UsersLayout;
