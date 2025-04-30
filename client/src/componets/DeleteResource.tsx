"use client";

import React from "react";
import Button from "./Button";

import type { ComponentProps } from "react";
import { toast } from "react-toastify";
import { wait } from "@/util/funcitons";

type buttonProps = ComponentProps<typeof Button>;
function DeleteResourceButton({
  buttonType,
  type = "link",
  resourcePath = "",
  id,
}: {
  buttonType?: HTMLButtonElement["type"];
  type?: buttonProps["type"];
  resourcePath: string;
  id: string;
}) {
  const handleClick = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/${resourcePath}/${id}`,
        {
          method: "DELETE",
        }
      );
      if (!response.ok) throw new Error("Something went wrong!");
      toast.success("Deleted successfully!", {
        autoClose: 1000, // Toast closes in 1 second
      });
      await wait(1.5);
      window.location.reload();
    } catch (error: unknown) {
      console.log(error);
      toast("Unable to delete resource!", {
        type: "error",
      });
    }
  };
  return (
    <>
      <Button type={type} buttonType={buttonType} onClick={handleClick}>
        Delete
      </Button>
    </>
  );
}

export default DeleteResourceButton;
