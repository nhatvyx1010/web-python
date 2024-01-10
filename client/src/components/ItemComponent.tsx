import React, { useEffect, useState } from "react";
import { Button, Card, CardBody, CardFooter, Image, Input } from "@nextui-org/react";
import { useRouter, useSearchParams } from "next/navigation";
import http from "@/app/utils/http";
import { IoAddOutline } from "react-icons/io5";
import { Item } from "@/app/types/item.type";

import { TbFilterSearch } from "react-icons/tb";
import { FaSearch } from "react-icons/fa";


interface ItemComponentProps {
  onAddToBill: (item: Item) => void;
}

export default function ItemComponent({ onAddToBill }: ItemComponentProps) {
  const [items, setItem] = useState<Item[]>([]);
  const itemList = Array.isArray(items) ? items : [];
  const [filteredItems, setFilteredItems] = useState<Item[]>([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await http.get(
          `sanpham_index`
          // {
          //   headers: {
          //     Authorization: `${token}`,
          //   },
          // }
        );

        if (response.status === 200) {
          setItem(response.data.sanphams);
          setFilteredItems(response.data.sanphams);
          console.log(response.data.sanphams);
        } else {
          console.log("Loi he thong");
        }
        // setFilteredItems(items);
      } catch (error) {
        console.error("Error:", error);
      }
    }

    fetchData();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value.toLowerCase();
    // Filter items based on the input value
    const filtered = items.filter(
      (item) =>
        item.TenSanPham.toLowerCase().includes(inputValue)
    );
    setFilteredItems(filtered);
  };

  return (
    <>
      <div className="pl-4 w-full">
        <div className="flex flex-col md:flex-row gap-4 mb-5">
          <div className="flex flex-col items-start mr-10" >
            <div className="flex gap-2 items-center">
              <Input
                key="outside"
                type="text"
                label="Giá tiền"
                labelPlacement="outside"
              />
              <TbFilterSearch className="text-3xl text-purple-800 mt-4" />
            </div>
          </div>
          <div className="flex flex-col items-start">
            <div className="flex gap-2 items-center">
              <Input
                key="outside"
                type="text"
                label="Tên sản phẩm"
                labelPlacement="outside"
                onInput={handleInputChange}
              />
              <FaSearch className="text-2xl text-purple-800 mt-4" />
            </div>
          </div>
        </div>
        <div className="gap-5 grid grid-cols-2 sm:grid-cols-4 ">
          {filteredItems?.map((item, index) => (
            <Card 
              shadow="sm"
              key={index}
              isPressable
              onPress={() => console.log("item pressed")}
            >
              <CardBody className="overflow-visible p-0">
                <Image
                  shadow="sm"
                  radius="lg"
                  width="100%"
                  alt={item.SanPhamID}
                  className="w-full object-cover h-[140px]"
                  src={`${process.env.BACKEND_URL}${item.HinhAnh}`}
                />
              </CardBody>
              <CardFooter className="text-small justify-between">
                <b>{item.TenSanPham}</b>
                <p className="text-default-500">{ parseInt(item.GiaBan)} VNĐ</p>
                <Button
                  isIconOnly
                  color="danger"
                  aria-label="Like"
                  className="text-sm"
                  onClick={() => onAddToBill(item)}
                >
                  <IoAddOutline />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </>
  );
}
