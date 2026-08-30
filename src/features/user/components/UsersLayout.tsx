"use client";
import { useState } from "react";
import { UserType } from "../types/user.type";
import ChoiesShowButton from "@/src/components/choiseShowButton/ChoiesShowButton";
import SortSelect, { SortOption } from "@/src/components/sortSelect/SortSelect";
import { ORDER_CONFIG, SORT_CONFIG } from "../types/userFilter.type";

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

  return (
    <div className="p-5 h-1000 bg-gray-50 min-h-screen">
      <div className="flex items-center gap-x-3">
        <ChoiesShowButton
          isCardView={isCardView}
          setIsCardView={setIsCardView}
        />
        <SortSelect options={showOption} queryKey={"sort"} />
        <SortSelect options={orderOptions} queryKey="order" />
      </div>
    </div>
  );
}

export default UsersLayout;
