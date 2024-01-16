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

  const [selectedOption, setSelectedOption] = useState<string>("");
  const options = [
    'Tăng dần',
    'Giảm dần',
  ];
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value.toLowerCase();
    // Filter items based on the input value
    const filtered = items.filter(
      (item) =>
        item.TenSanPham.toLowerCase().includes(inputValue)
    );
    setFilteredItems(filtered);
  };
  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = e.target.value;
    setSelectedOption(selectedValue);
    let filtered = items;

    if (selectedValue === "Tăng dần") {
      filtered = filtered.filter((item) => item.GiaBan).sort((a, b) => parseInt(a.GiaBan) - parseInt(b.GiaBan));
    } else if (selectedValue === "Giảm dần") {
      filtered = filtered.filter((item) => item.GiaBan).sort((a, b) => parseInt(b.GiaBan) - parseInt(a.GiaBan));
    }
  
    setFilteredItems(filtered);
  };

  return (
    <>
      <div className="flex flex-col md:flex-row gap-4 mb-5">
          <div className="flex flex-col items-start mr-10" >
            <label htmlFor="selectInput" className="block text-sm font-medium text-gray-700 mb-1" style={{ marginLeft: '45%', height: '100%' }}>
            Loại sản phẩm
          </label>

          <div className="flex gap-2 items-center relative">
            <select 
              id="selectInput"
              value={selectedOption} 
              // onChange={handleFilterChange} 
              onChange={handleSelectChange} 
              className="select-style h-10 ml-32" 
              style={{
                backgroundColor: '#f4f4f4',
                paddingLeft: '8px',
                fontSize: '16px',
                borderRadius: '15px',
              }}
            >
              <option value="" disabled>Select an option</option>
              {options.map((option, index) => (
                <option key={index} value={option}>
                  {option}
                </option>
              ))}
            </select>
            <TbFilterSearch className="text-3xl text-purple-800" />
          </div>
        </div>
        <div className="flex flex-col items-start">
          <div className="flex gap-2 items-center relative">
            <Input
              key="outside"
              type="text"
              label="Tên sản phẩm"
              labelPlacement="outside"
              // onChange={handleFilterChange} 
              onInput={handleInputChange}
              id="textInput"
            />
            <FaSearch className="text-3xl text-purple-800 mt-5" />
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
