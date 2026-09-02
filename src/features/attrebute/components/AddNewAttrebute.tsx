import Modal from "@/src/components/modal/Modal";
import NavyButton from "@/src/components/navyButton/NavyButton";
import { useState, useTransition } from "react";
import { FaPlus } from "react-icons/fa";

function AddNewAttrebute() {
  const [isAddOpen, setIsAddOPen] = useState(false);
  const [isPending, startTransition] = useTransition();
  return (
    <div>
      <Modal open={isAddOpen} setClose={setIsAddOPen}>
        <div></div>
      </Modal>
      <NavyButton
        text="ایجاد ویژگی جدید"
        onClick={() => setIsAddOPen(true)}
        Icon={<FaPlus />}
      />
    </div>
  );
}

export default AddNewAttrebute;
