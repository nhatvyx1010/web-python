import React, { useEffect, useState } from "react";
import { Button, Card, CardBody, CardFooter, Image } from "@nextui-org/react";
import http from "@/app/utils/http";
import { Item } from "@/app/types/item.type";
import { DanhMuc } from "@/app/types/danhmuc.type";

import { createPortal } from "react-dom";

interface ItemComponentProps {
  onDetailSanPham: (item: Item) => void;
  setSelectedItem: React.Dispatch<React.SetStateAction<Item | null>>;
}

export default function ItemComponent({ onDetailSanPham, setSelectedItem }: ItemComponentProps) {
  const [items, setItems] = useState<Item[]>([]);
  const [danhmucs, setDanhmucs] = useState<DanhMuc[]>([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await http.get(`sanpham_index`);
        if (response.status === 200) {
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

  return (
    <div className="pl-4">
      <div className="grid grid-cols-1 sm:grid-cols-5 gap-y-6">
        {items.map((item, index) => (
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
  );
}
