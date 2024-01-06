"use client"
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import http from "@/app/utils/http";
// import { getCookie } from "cookies-next";
import { MdOutlineDevicesOther } from "react-icons/md";
import { Tabs, Tab, Card, CardBody, CardHeader } from "@nextui-org/react";
import FormComponent from "@/components/FormComponent";
import NavigaComponent from "@/components/NavigaComponent";

interface OptionType {
  value: string;
  label: string;
}

type SelectChangeValueType = OptionType | null;

export default function AddHome() {
  const [selectedOption, setSelectedOption] =
    useState<SelectChangeValueType | null>(null);
  const router = useRouter();


  const handleAdd = async (input1: string, input2: string) => {
    if (input1 != "" && input2 != "") {
      const data = {
        tendanhmuc :input1,
        mota :input2,
      };
      try {
        const response = await http.post("danhmuc_add", data, {
          // headers: {
          //   Authorization: `${getCookie("token")?.toString()}`,
          // },
        });
        const result = await response.data;
        console.log(result);
        if (result.status == "success") {
          alert("Thêm thành công")
        } else if (result.status != 200) {
          alert("Thêm thất bại")

        }
      } catch (error) {
        console.error("Error:", error);
      }
    } else {
      // dispatch(failPopUp("E001"));
    }
  };  

  


  return (
    <>
      <NavigaComponent />
      <div className="flex justify-center items-center h-screen">
        <div className="bg-white p-8 rounded-lg drop-shadow-2xl w-1/3">
          <div className="flex flex-col justify-center items-center gap-1 font-bold h-[desiredHeight] text-lg mb-2.5">
            <MdOutlineDevicesOther className="text-2xl" />
            Thêm danh mục
            <Tabs
              key="primary"
              color="primary"
              aria-label="Tabs colors"
              radius="full"
            >
              <Tab key="danhmuc" title="Danh mục">
                <FormComponent titleInput1 = "Tên danh mục" titleInput2 = "Mô tả"  handleFunction = {handleAdd} />
              </Tab>
            </Tabs>
          </div>
        </div>
      </div>
    </>
  );
}
