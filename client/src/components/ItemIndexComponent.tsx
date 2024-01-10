import React, { useEffect, useState } from "react";
import { Button, Card, CardBody, CardFooter, Image, Input } from "@nextui-org/react";
import http from "@/app/utils/http";
import { Item } from "@/app/types/item.type";
import { DanhMuc } from "@/app/types/danhmuc.type";

import { createPortal } from "react-dom";
import { TbFilterSearch } from "react-icons/tb";
import { FaSearch } from "react-icons/fa";

interface ItemComponentProps {
  onDetailSanPham: (item: Item) => void;
  setSelectedItem: React.Dispatch<React.SetStateAction<Item | null>>;
}

export default function ItemComponent({ onDetailSanPham, setSelectedItem }: ItemComponentProps) {
  const [items, setItems] = useState<Item[]>([]);
  const [danhmucs, setDanhmucs] = useState<DanhMuc[]>([]);
  const [filteredItems, setFilteredItems] = useState<Item[]>([]);
  
  useEffect(() => {
    async function fetchData() {
      try {
        const response = await http.get(`sanpham_index`);
        if (response.status === 200) {
          setFilteredItems(response.data.sanphams);
          setItems(response.data.sanphams);
        } else {
          console.log("Loi he thong");
        }
      } catch (error) {
        console.error("Error:", error);
      }
    }

    async function fetchDanhMucs() {
      try {
        const response = await http.get('danhmuc_index');
        if (response.status === 200) {
          setDanhmucs(response.data.danhmucs);
        } else {
          console.log("Loi he thong");
        }
      } catch (error) {
        console.error("Error:", error);
      }
    }

    fetchData();
    fetchDanhMucs();
  }, []);

  const handleDetailClick = (item: Item) => {
    onDetailSanPham(item);
    setSelectedItem(item);
    
  };

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


      <div className="pl-4" >
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-y-6">
          {filteredItems.map((item, index) => (
            <Card
              className="w-[90%]"
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
                  className="w-full object-cover h-[160px]"
                  src={`${process.env.BACKEND_URL}${item.HinhAnh}`}
                />
              </CardBody>
              <CardFooter className="text-small justify-between">
                <b>{item.TenSanPham}</b>
                <p className="text-default-500">{parseInt(item.GiaBan)} VNĐ</p>
                <Button
                  color="danger"
                  aria-label="Like"
                  className="text-sm"
                  onClick={() => handleDetailClick(item)}
                >
                  Chi tiết
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </>
  );
}
