"use client";
import { useState } from "react";
import { UserType } from "../types/user.type";
import ChoiesShowButton from "@/src/components/choiseShowButton/ChoiesShowButton";
import { ORDER_CONFIG, SORT_CONFIG } from "../types/userFilter.type";
import SearchInput from "@/src/components/searchInput/SearchInput";
import DataTabel, { columns } from "@/src/components/dataTabel/DataTabel";
import SortSelect from "@/src/components/sortSelect/SortSelect";
import DeleteUser from "./DeleteUser";

type FormattedUser = Omit<UserType, "createdAt" | "isBan"> & {
  createdAt: string;
  isBan: string;
};

function UsersLayout({ users }: { users: UserType[] }) {
  const [isCardView, setIsCardView] = useState(false);

  const showOption = Object.entries(SORT_CONFIG).map(([value, label]) => ({
    value,
    label,
  }));

  const orderOptions = Object.entries(ORDER_CONFIG).map(([value, label]) => ({
    value,
    label,
  }));

  // تبدیل داده‌ها به رشته‌های قابل رندر در ری‌اکت
  const formattedData: FormattedUser[] = users.map((user) => ({
    ...user,
    createdAt: new Date(user.createdAt).toLocaleDateString("fa-IR"),
    isBan: user.isBan ? "مسدود شده" : "فعال",
  }));

  const userFieldColumn: columns<FormattedUser>[] = [
    {
      key: "createdAt",
      label: "تاریخ ثبت نام",
    },
    {
      key: "fullname",
      label: "اسم و فامیل",
    },
    {
      key: "phone",
      label: "شماره تماس",
    },
    {
      key: "role",
      label: "نقش",
    },
    {
      key: "isBan",
      label: "فعال/غیرفعال",
    },
  ];

  return (
    <div className="p-5 bg-gray-50 min-h-screen dark:bg-neutral-900">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3 flex-wrap">
          <ChoiesShowButton
            isCardView={isCardView}
            setIsCardView={setIsCardView}
          />
          <SortSelect options={showOption} queryKey={"sort"} />
          <SortSelect options={orderOptions} queryKey="order" />
          <SearchInput />
        </div>
      </div>
      <div>
        <DataTabel
          data={formattedData}
          columns={userFieldColumn}
          actions={(user) => (
            <div>
              <DeleteUser userId={user.id} userFullname={user.fullname} />
            </div>
          )}
        />
      </div>
    </div>
  );
}

export default UsersLayout;
