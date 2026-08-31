import Modal from "@/src/components/modal/Modal";
import React, { useState } from "react";

type DeleteUserProps = {
  userId: string;
  userFullname: string;
};
function DeleteUser({ userId, userFullname }: DeleteUserProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleDelete = () => {};
  return (
    <>
      <button
        onClick={(e) => setIsModalOpen(true)}
        className="rounded-lg px-2.5 py-1 text-xs font-medium text-rose-600 font-Morabba-Bold transition-colors hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-950/40"
      >
        حذف
      </button>

      <Modal
        open={isModalOpen}
        setClose={() => setIsModalOpen(false)}
        onConfirm={handleDelete}
      >
        <div className="flex items-center gap-2 font-Morabba-Bold text-lg">
          <span>آیا از حذف</span>
          <span className="text-rose-600">{userFullname}</span>
          <span>مطمئن هستید؟</span>
        </div>
      </Modal>
    </>
  );
}

export default DeleteUser;
