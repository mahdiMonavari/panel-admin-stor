"use client";
import { useState } from "react";
import { UserType } from "../types/user.type";
import ChoiesShowButton from "@/src/components/choiseShowButton/ChoiesShowButton";
import SortSelect, { SortOption } from "@/src/components/sortSelect/SortSelect";
import { ORDER_CONFIG, SORT_CONFIG } from "../types/userFilter.type";
import SearchInput from "@/src/components/searchInput/SearchInput";
import Modal from "@/src/components/modal/Modal";
import NavyButton from "@/src/components/navyButton/NavyButton";

function UsersLayout({ users }: { users: UserType[] }) {
  const [isCardView, setIsCardView] = useState(false);
  const [modal, setModal] = useState(false);
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
      <Modal open={modal} setClose={setModal}>
        <div></div>
      </Modal>
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3 flex-wrap">
          <ChoiesShowButton
            isCardView={isCardView}
            setIsCardView={setIsCardView}
          />
          <SortSelect options={showOption} queryKey={"sort"} />
          <SortSelect options={orderOptions} queryKey="order" />
          <SearchInput />
        </div>
        <NavyButton text="ایجاد کاربر جدید" onClick={() => setModal(true)} />
      </div>
    </div>
  );
}

export default UsersLayout;
