import Modal from "@/src/components/modal/Modal";
import React, { useState, useTransition } from "react";
import { deleteUser } from "../actions/user.delete";

type DeleteUserProps = {
  userId: string;
  userFullname: string;
};
function DeleteUser({ userId, userFullname }: DeleteUserProps) {
  const [isPending, startTransition] = useTransition();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [errorMesage, setErrorMessage] = useState<null | string>(null);
  const handleDelete = () => {
    try {
      startTransition(async () => {
        const res = await deleteUser(userId);
        if (res.success) {
          setIsModalOpen(false);
        } else {
          setErrorMessage(res.errorMesage);
        }
      });
    } catch (error) {
      setErrorMessage(error as string);
    }
  };
  return (
    <>
      <button
        onClick={(e) => setIsModalOpen(true)}
        className="rounded-lg px-2.5 py-1 text-xs font-medium text-rose-600 font-Morabba-Bold transition-colors hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-950/40"
      >
        حذف
      </button>

      <Modal
        isLoading={isPending}
        open={isModalOpen}
        setClose={() => setIsModalOpen(false)}
        onConfirm={handleDelete}
        errorMessage={errorMesage}
      >
        <form
          onSubmit={handleDelete}
          className="flex items-center gap-2 font-Morabba-Bold text-lg"
        >
          <span>آیا از حذف</span>
          <span className="text-rose-600">{userFullname}</span>
          <span>مطمئن هستید؟</span>
        </form>
      </Modal>
    </>
  );
}

export default DeleteUser;
