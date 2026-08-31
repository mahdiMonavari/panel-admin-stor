import Modal from "@/src/components/modal/Modal";
import React, { useState } from "react";

type DeleteUserProps = {
  userId: string;
  userFullname: string;
};

function DeleteUser({ userId, userFullname }: DeleteUserProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleDelete = () => {
    console.log(userFullname);
    // اجرای Server Action یا ارسال رکوئست حذف با userId
  };

  return (
    <>
      <button
        onClick={() => handleDelete()}
        className="rounded-lg px-2.5 py-1 text-xs font-medium text-rose-600 transition-colors hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-950/40"
      >
        حذف
      </button>

      {/* <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
          <div>آیا از حذف مطمئن هستید؟</div>
          <button onClick={handleDelete}>بله، حذف کن</button>
      </Modal> */}
    </>
  );
}

export default DeleteUser;
