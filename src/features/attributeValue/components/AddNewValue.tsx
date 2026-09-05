"use client";
import Modal from "@/src/components/modal/Modal";
import NavyButton from "@/src/components/navyButton/NavyButton";
import React, { useEffect, useState, useTransition } from "react";
import { FaPlus } from "react-icons/fa";
import { createAttibuteValueInputs } from "../inputs/create.inputs";
import Input from "@/src/components/input/Input";
import { useForm } from "react-hook-form";
import { CreateAttributeValue } from "../type/create.type";
import { zodResolver } from "@hookform/resolvers/zod";
import { attributeValueItemSchema } from "../schema/create.schema";
import { useParams } from "next/navigation";
import generateAttributeValue from "../actions/attribute.Valuecreate";

function AddNewValue() {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<null | string>(null);
  const openHandler = () => setIsOpen(true);
  const params = useParams();
  const {
    reset,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateAttributeValue>({
    resolver: zodResolver(attributeValueItemSchema),
    mode: "onTouched",
  });
  useEffect(() => {
    if (isOpen === false) {
      reset();
    }
  }, [isOpen]);
  const createNewValue = (data: CreateAttributeValue) => {
    setError(null);
    startTransition(async () => {
      const { id } = params;
      const res = await generateAttributeValue({ ...data, attributeId: id });
      if (!res.success) {
        return setError(res.message);
      }
      setIsOpen(false);
    });
  };

  return (
    <div>
      <div>
        <NavyButton
          text="ایجاد مقدار جدید"
          Icon={<FaPlus />}
          onClick={openHandler}
        />
        <Modal
          isLoading={isPending}
          open={isOpen}
          onConfirm={() => handleSubmit(createNewValue)()}
          setClose={setIsOpen}
          errorMessage={error}
          title="ایجاد مقدار جدید"
        >
          <form
            className="flex flex-col gap-5"
            onSubmit={handleSubmit(createNewValue)}
          >
            {createAttibuteValueInputs.map((input) => (
              <Input<CreateAttributeValue>
                key={input.name}
                register={register}
                errors={errors}
                {...input}
              />
            ))}
          </form>
        </Modal>
      </div>
    </div>
  );
}

export default AddNewValue;
