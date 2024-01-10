"use client";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Button, SelectItem, select } from "@nextui-org/react";
import { Select, Input } from "@nextui-org/react";
// import { getCookie, hasCookie } from "cookies-next";
import http from "@/app/utils/http";

interface Type {
  titleInput1: string;
  titleInput2: string;
  handleFunction: (input1: string, input2: string) => Promise<void>
}

export default function FormComponent( {titleInput1, titleInput2, handleFunction} : Type) {
  const router = useRouter();

  const [input1, setInput1] = useState("");
  const [input2, setInput2] = useState("");
  const params = useSearchParams();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    return value;
  };

  const handleAddFunction = async () => {
    // Sử dụng hàm được truyền từ prop
    await handleFunction(input1, input2);
  };

  
  useEffect(() => {
    async function fetchData() {
      try {
        const response = await http.get(
          `danhmuc_info/${params.get("id")}`
        );

        if (response.status === 200) {
          setInput1(response.data.danhmuc.TenDanhMuc);
          setInput2(response.data.danhmuc.MoTa);
          // console.log(response.data.khachhangs);
        } else {
          console.log("Loi he thong");
        }
      } catch (error) {
        console.error("Error:", error);
      }
    }

    fetchData();
  }, []);

  return (
    <>
      <Input
        isRequired
        type="text"
        label={titleInput1}
        value={input1}
        className="mb-5 h-12 mr-32"
        onChange={(e) => {
          const value = handleInputChange(e);
          setInput1(value);
        }}
      />

      <Input
        isRequired
        type="text"
        label={titleInput2}
        value={input2}
        className="mb-5 h-12 mr-32"
        onChange={(e) => {
          const value = handleInputChange(e);
          setInput2(value);
        }}
      />
      <div className="flex justify-around">
        <Button
          color="danger"
          variant="flat"
          onClick={() =>
            router.push(`/quanli_danhmuc`)
          }
        >
          Cancel
        </Button>
        <Button
          color="primary"
          onClick={() => {
            handleAddFunction();
            router.push(`/quanli_danhmuc`);
          }}
        >
          Add
        </Button>
      </div>
    </>
  );
}
