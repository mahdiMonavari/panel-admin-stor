import Modal from "@/src/components/modal/Modal";
import NavyButton from "@/src/components/navyButton/NavyButton";
import { useEffect, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { FaPlus } from "react-icons/fa";
import { CreateCategoryType } from "../type/create.type";
import CreateCategorySchema from "../schema/create.shema";
import { zodResolver } from "@hookform/resolvers/zod";
import { CategoryType } from "../type/category.type";

type AddNewType = {
  categories: CategoryType[];
};

const AddNewCategory = ({ categories }: AddNewType) => {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [categoryName, setCategoryName] = useState("");
  const [isPending, startTransition] = useTransition();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateCategoryType>({
    resolver: zodResolver(CreateCategorySchema),
  });
  return (
    <div>
      <Modal open={isAddOpen} setClose={setIsAddOpen}>
        <div></div>
      </Modal>
      <NavyButton
        text="ایجاد دسته بندی جدید"
        onClick={() => setIsAddOpen(true)}
        Icon={<FaPlus />}
      />
    </div>
  );
};
export default AddNewCategory;
