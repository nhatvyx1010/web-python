"use client";
import React, { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Button,
  Input,
} from "@nextui-org/react";
import { useSearchParams } from "next/navigation";
import http from "@/app/utils/http";
import { Infodonhang } from "@/app/types/info.type";
import { Item } from "@/app/types/item.type";
import { deleteCookie, getCookie } from "cookies-next";
import { ImMinus } from "react-icons/im";

interface BillItem {
  item: Item;
  quantity: number;
}

interface BillComponentProps {
  billItems: BillItem[];
  onRemoveFromBill: (item: Item) => void;
}



export default function BillComponent({ billItems, onRemoveFromBill }: BillComponentProps) {
  const [khachHangID, setkhachHangID] = useState<string[]>([]);
  const [sanPhamIDs, setSanPhamIDs] = useState<string[]>([]);
  const [soluong, setSoluong] = useState<number>(0);
  const [tongtien, setTongtien] = useState<number>(0);
  const [ten, setTen] = useState("");
  const [ngaysinh, setNgaysinh] = useState("");
  const [phone, setPhone] = useState("");
  const [diachi, setDiachi] = useState("");
  const [ghichu, setGhichu] = useState("");
  const [ngaymua, setNgaymua] = useState("");

  const [billItem, setBillItems] = useState<BillItem[]>([]);

  function formatDateBack(inputDate: string) {
    const [year, month, day] = inputDate.split('-');
    return `${day}/${month}/${year}`;
  }

  function getCurrentDate() {
    const today = new Date();
    const day = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0'); // Tháng bắt đầu từ 0
    const year = today.getFullYear();
  
    return `${day}/${month}/${year}`;
  }
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    return value;
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedDate = e.target.value;
    const formattedDate = new Date(selectedDate).toISOString().split('T')[0];
    return formattedDate;
  };

  const removeToBill = (item: Item) => {
    const existingItemIndex = billItems.findIndex((billItem) => billItem.item.SanPhamID === item.SanPhamID);

    if (existingItemIndex !== -1) {
      const updatedBillItems = [...billItems];
      if (updatedBillItems[existingItemIndex].quantity === 1) {
        onRemoveFromBill(item);
      } else {
        updatedBillItems[existingItemIndex].quantity -= 1;
      }
      setBillItems(updatedBillItems);
    } else {
      // Handle if item doesn't exist
    }
  };

  const handleAdd = async () => {
    if (ten != "" && phone != "" && diachi != "" && idnhanvien != "") {
      if(sanPhamIDs && sanPhamIDs.length > 0){
        const data = {
          hoten : ten,
          khachHangID,
          nhanVienID: "nv000000",
          soLuong: soluong,
          tongTien: tongtien,
          sanPhamIDs
        };
        try {
          const response = await http.post("bill_add_user", data);
          const result = await response.data;
          console.log(result);
          if (result.status == 200) {
            alert("Tạo bill thành công")
            // dispatch(successPopUp(result.data.message));
          } else if (result.status != 200) {
            // dispatch(failPopUp(result.data.message));
            alert("Tạo bill thất bại")

          }
        } catch (error) {
          console.error("Error:", error);
        }
      } else {
        alert("Xin mời chọn sản phẩm!")
      }
    } else {
      alert("Xin mời nhập input!")
    }
  };
  
  const totalQuantity = billItems.reduce((total: number, currentItem: BillItem) => total + currentItem.quantity, 0);
  const totalMoney = billItems.reduce((total: number, currentItem: BillItem) => total + currentItem.quantity * parseFloat(currentItem.item.GiaBan), 0);
  
  useEffect(() => {
    const newSanPhamIDs = billItems.map((sanpham) => sanpham.item.SanPhamID);
    setSanPhamIDs(newSanPhamIDs);
    setSoluong(totalQuantity);
    setTongtien(totalMoney);
  }, [billItems]);

useEffect(() => {
  async function fetchData() {
    try {
      const token = getCookie("token")?.toString();
      const response = await http.get(
        `get_user_info_user`,
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      );

      if (response.status === 200) {
        setkhachHangID(response.data.user_info.KhachHangID);
        setTen(response.data.user_info.HoTen);
        setNgaysinh(formatDateBack(response.data.user_info.NgaySinh));
        setPhone(response.data.user_info.Phone);
        setDiachi(response.data.user_info.DiaChi);
        setGhichu(response.data.user_info.GhiChu);
        console.log(response.data.user_info.HoTen);
      } else {
        console.log("Loi he thong");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }

  fetchData();
}, []);
  
  const [nvID, setNvID] = useState("");
  useEffect(() => {
    async function fetchData() {
      try {
        const token = getCookie("token")?.toString();
        const response = await http.get(
          `get_user_info_user`,
          {
            headers: {
              Authorization: `${token}`,
            },
          }
        );

        if (response.status === 200) {
          setNvID(response.data.user_info.NhanVienID);
          console.log(response.data.user_info.NhanVienID);
        } else {
          console.log("Loi he thong");
        }
      } catch (error) {
        console.error("Error:", error);
      }
    }

    fetchData();
  }, []);

  // //////////////////
  const idnhanvien = nvID;
  
  return (
    <div className="pl-12 rounded-lg drop-shadow-2xl w-1/2 mr-5">
      <Card className="max-w-[420px]">
        <div className="flex flex-col justify-center items-center gap-1 font-bold h-[desiredHeight] text-lg mb-2.5 mt-2.5">
          <h2>Hóa đơn thanh toán</h2>
          <CardHeader className="justify-between">
            <div className="flex gap-5">
              <div className="flex flex-col gap-1 items-start justify-center">
                <div className="flex w-full flex-wrap items-end md:flex-nowrap  gap-4 pb-2">
                  <Input
                    key="outside"
                    type="text"
                    label="Họ và Tên"
                    value={ten}
                    labelPlacement="outside"
                    onChange={(e) => {
                      const value = handleInputChange(e);
                      setTen(value);
                    }}
                  />
                  {/* <Input
                    key="outside"
                    type="Date"
                    value={ngaysinh}
                    label=""
                    labelPlacement="outside"
                    onChange={(e) => {
                      const value = handleDateChange(e);
                      setNgaysinh(value);
                    }}
                  /> */}
                </div>
                <div className="flex w-full flex-wrap items-end md:flex-nowrap  gap-4 pb-2">
                  <Input
                    key="outside"
                    type="text"
                    value={phone}
                    label="Số điện thoại"
                    labelPlacement="outside"
                    onChange={(e) => {
                      const value = handleInputChange(e);
                      setPhone(value);
                    }}
                  />
                  <Input
                    key="outside"
                    type="text"
                    value={diachi}
                    label="Địa chỉ"
                    labelPlacement="outside"
                    onChange={(e) => {
                      const value = handleInputChange(e);
                      setDiachi(value);
                    }}
                  />
                </div>
                <div className="flex w-full flex-wrap items-end md:flex-nowrap  gap-4 pb-2">
                  <Input
                    key="outside"
                    type="text"
                    value={ghichu}
                    label="Ghi chú"
                    labelPlacement="outside"
                    onChange={(e) => {
                      const value = handleInputChange(e);
                      setGhichu(value);
                    }}
                  />
                  {/* <Input
                  key="outside"
                  type="date"
                  value={ngaymua}
                  label=""
                  // Ngày mua
                  labelPlacement="outside"
                  onChange={(e) => {
                    const value = handleDateChange(e);
                    setNgaymua(value);
                  }}
                /> */}
                
                </div>
              </div>
            </div>
          </CardHeader>
          <CardBody className="px-3 py-0 text-small text-default-400">
            {billItems?.map((sanpham, index) => (
              <div key={index + 1} className="flex flex-col gap-1 items-start justify-center">
                <div className="border-t-2 border-black-5 mt-5">
                  <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center gap-2 w-full">
                      <div className="w-[100%]">
                        <div className="flex items-center justify-between">
                          <div className="w-[350px]">
                            <div className="flex items-center justify-between">
                              <h4 className="text-small font-semibold leading-none text-default-600">
                                {index + 1}. Tên sản phẩm: {sanpham.item.TenSanPham}
                              </h4>
                              <Button
                                isIconOnly
                                color="default"
                                aria-label="Like"
                                className="ml-auto h-6"
                                onClick={() => onRemoveFromBill(sanpham.item)}
                              >
                                <ImMinus />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <h4 className="text-small font-semibold leading-none text-default-600">
                  Giá bán: {parseInt(sanpham.item.GiaBan)} VNĐ
                </h4>
                <h4 className="text-small font-semibold leading-none text-default-600">
                  Danh mục: {sanpham.item.TenDanhMuc}
                </h4>
                <h4 className="text-small font-semibold leading-none text-default-600">
                  Số lượng: {sanpham.quantity}
                </h4>
              </div>
            ))}
          </CardBody>


          <CardFooter className="flex justify-between items-center flex-wrap gap-3">
            <div className="flex gap-1">
              <p className="text-default-400 text-small">Số lượng: </p>
              <p className="font-semibold text-default-400 text-small">
                {totalQuantity}
              </p>
            </div>
            <div className="flex gap-1">
              <p className="text-default-400 text-small">Tổng tiền: </p>
              <p className="font-semibold text-default-400 text-small">
                {totalMoney}
              </p>
            </div>
            <div className="flex gap-1 pl-32">
              <Button color="primary" onClick={() => handleAdd()}>
                Thêm
              </Button>
            </div>
          </CardFooter>
        </div>
      </Card>
    </div>
  );
}
