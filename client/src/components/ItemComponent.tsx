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

  

  const [inputValue, setInputValue] = useState<string>("");
  const [selectedOption, setSelectedOption] = useState<string>("");
  const options = [
    'Tăng dần',
    'Giảm dần',
    'Option 3',
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
  const handleFilterChange: React.FormEventHandler<HTMLInputElement | HTMLSelectElement> = (e) => {
    if (e.target instanceof HTMLInputElement || e.target instanceof HTMLSelectElement) {
      // Nếu thay đổi là từ input hoặc select
      const inputId = e.target.id;
      const inputValue = e.target.value.toLowerCase();
  
      // Cập nhật giá trị cho input tương ứng
      if (inputId === "textInput") {
        setInputValue(inputValue);
      }
  
      // Cập nhật giá trị cho select
      if (e.target instanceof HTMLSelectElement) {
        setSelectedOption(inputValue);
      }
  
      // Lọc dựa trên cả hai giá trị input và select
      let filteredItems = items;
  
      if (selectedOption === "Tăng dần" || selectedOption === "Giảm dần") {
        filteredItems = filteredItems.filter(
          (item) =>
            (inputValue === "" || item.TenSanPham.toLowerCase().includes(inputValue))
        );
  
        if (selectedOption === "Tăng dần") {
          filteredItems = filteredItems.filter((item) => item.GiaBan).sort((a, b) => parseInt(a.GiaBan) - parseInt(b.GiaBan));
        } else if (selectedOption === "Giảm dần") {
          filteredItems = filteredItems.filter((item) => item.GiaBan).sort((a, b) => parseInt(b.GiaBan) - parseInt(a.GiaBan));
        }
      }
  
      // Set lại danh sách lọc
      setFilteredItems(filteredItems);
    }
  };
  
  
  
  
  
  return (
    <>
      <div className="pl-4 w-full">
        {/* <div className="flex flex-col md:flex-row gap-4 mb-5">
          <div className="flex flex-col items-start mr-10" style={{ marginTop: '24px' }}>
            <div className="flex gap-2 items-center ">
              <select 
                      // value={selectedOption} 
                      // onChange={handleSelectChange} 
                      className="select-style h-10 ml-32" 
                      style={{
                        backgroundColor: '#f4f4f4',
                        paddingLeft: '8px',
                        fontSize: '16px',
                        borderRadius: '15px',
                      }} >
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
            <div className="flex gap-2 items-center">
              <Input
                key="outside"
                type="text"
                label="Tên sản phẩm"
                labelPlacement="outside"
                onInput={handleInputChange}
              />
              <FaSearch className="text-3xl text-purple-800 mt-5" />
            </div>
          </div>
        </div> */}
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
