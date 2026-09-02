"use client";

import { useEffect, useMemo, useState } from "react";
import { UserType } from "../types/user.type";
import ChoiesShowButton from "@/src/components/choiseShowButton/ChoiesShowButton";
import { ORDER_CONFIG, SORT_CONFIG } from "../types/userFilter.type";
import SearchInput from "@/src/components/searchInput/SearchInput";
import DataTabel, { columns } from "@/src/components/dataTabel/DataTabel";
import SortSelect from "@/src/components/sortSelect/SortSelect";
import DeleteUser from "./DeleteUser";
import DataCard from "@/src/components/dataCard/DataCard";
import UpdateUser from "./UpdateUser";

type FormattedUser = Omit<UserType, "createdAt" | "isBan"> & {
  createdAt: string;
  isBan: string;
};

const SORT_OPTIONS = Object.entries(SORT_CONFIG).map(([value, label]) => ({
  value,
  label,
}));

const ORDER_OPTIONS = Object.entries(ORDER_CONFIG).map(([value, label]) => ({
  value,
  label,
}));

function UsersLayout({ users }: { users: UserType[] }) {
  const [isCardView, setIsCardView] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 800) {
        setIsCardView(true);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const formattedData: FormattedUser[] = useMemo(() => {
    return users.map((user) => ({
      ...user,
      createdAt: new Date(user.createdAt).toLocaleDateString("fa-IR"),
      isBan: user.isBan ? "مسدود شده" : "فعال",
    }));
  }, [users]);

  const userFieldColumn: columns<FormattedUser>[] = useMemo(
    () => [
      {
        key: "createdAt",
        label: "تاریخ ثبت نام",
        render: (value) => (
          <div className="flex items-center justify-center">
            <span className="flex h-6 w-20 items-center justify-center rounded-md border border-blue-600/30 bg-blue-500/10 font-Morabba-Medium text-xs text-blue-600 dark:border-blue-500/30 dark:bg-blue-500/20 dark:text-blue-400">
              {value}
            </span>
          </div>
        ),
      },
      {
        key: "fullname",
        label: "نام و نام‌خانوادگی",
      },
      {
        key: "phone",
        label: "شماره تماس",
      },
      {
        key: "role",
        label: "نقش",
        render: (value) => (
          <div className="flex items-center justify-center">
            <span
              className={`flex h-6 w-16 items-center justify-center rounded-md font-Morabba-Medium text-xs ${
                value === "ADMIN"
                  ? "border border-red-500/30 bg-red-500/10 text-red-600 dark:bg-red-500/20 dark:text-red-400"
                  : "border border-amber-500/30 bg-amber-500/10 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400"
              }`}
            >
              {value}
            </span>
          </div>
        ),
      },
      {
        key: "isBan",
        label: "وضعیت حساب",
        render: (value) => (
          <div className="flex items-center justify-center">
            <span
              className={`flex h-6 w-20 items-center justify-center rounded-md font-Morabba-Medium text-xs ${
                value === "فعال"
                  ? "border border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400"
                  : "border border-rose-500/30 bg-rose-500/10 text-rose-600 dark:bg-rose-500/20 dark:text-rose-400"
              }`}
            >
              {value}
            </span>
          </div>
        ),
      },
    ],
    [],
  );

  return (
    <div className="min-h-screen bg-gray-50 p-8 dark:bg-neutral-900 sm:p-6 lg:p-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="hidden md:block">
            <ChoiesShowButton
              isCardView={isCardView}
              setIsCardView={setIsCardView}
            />
          </div>
          <SortSelect options={SORT_OPTIONS} queryKey="sort" />
          <SortSelect options={ORDER_OPTIONS} queryKey="order" />
          <SearchInput />
        </div>
      </div>

      {!isCardView ? (
        <DataTabel<FormattedUser>
          data={formattedData}
          columns={userFieldColumn}
          actions={(user) => (
            <div className="flex items-center justify-center gap-2">
              <DeleteUser userFullname={user.fullname} userId={user.id} />
              <UpdateUser
                fullname={user.fullname}
                userId={user.id}
                role={user.role}
                isActive={user.isBan}
              />
            </div>
          )}
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {formattedData.length > 0 ? (
            formattedData.map((user) => (
              <div
                key={user.id}
                className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:shadow-md dark:border-slate-800 dark:bg-slate-950"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800/80">
                    <span className="font-Morabba-Bold text-base text-slate-900 dark:text-white">
                      {user.fullname}
                    </span>
                    <span
                      className={`flex h-6 items-center rounded-md px-2 font-Morabba-Medium text-xs ${
                        user.role === "ADMIN"
                          ? "border border-red-500/30 bg-red-500/10 text-red-600 dark:bg-red-500/20 dark:text-red-400"
                          : "border border-amber-500/30 bg-amber-500/10 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400"
                      }`}
                    >
                      {user.role}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
                    <span>شماره تماس:</span>
                    <span>{user.phone}</span>
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
                    <span>تاریخ ثبت‌نام:</span>
                    <span className="flex h-5 items-center rounded border border-blue-600/30 bg-blue-500/10 px-1.5 font-Morabba-Medium text-[11px] text-blue-600 dark:bg-blue-500/20 dark:text-blue-400">
                      {user.createdAt}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
                    <span>وضعیت حساب:</span>
                    <span
                      className={`flex h-5 items-center rounded px-2 font-Morabba-Medium text-[11px] ${
                        user.isBan === "فعال"
                          ? "border border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400"
                          : "border border-rose-500/30 bg-rose-500/10 text-rose-600 dark:bg-rose-500/20 dark:text-rose-400"
                      }`}
                    >
                      {user.isBan}
                    </span>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-end border-t border-slate-100 pt-3 dark:border-slate-800/80">
                  <DeleteUser userFullname={user.fullname} userId={user.id} />
                  <UpdateUser
                    fullname={user.fullname}
                    userId={user.id}
                    role={user.role}
                    isActive={user.isBan}
                  />
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full py-10 text-center text-sm text-slate-500 dark:text-slate-400">
              کاربری برای نمایش یافت نشد.
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default UsersLayout;
