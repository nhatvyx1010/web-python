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

interface BillItem {
  item: Item;
  quantity: number;
}

interface BillComponentProps {
  billItems: BillItem[];
}

const getTotalQuantity = (billItems: BillItem[]): number => {
  return billItems.reduce((total, currentItem) => total + currentItem.quantity, 0);
};

export default function BillComponent({ billItems }: BillComponentProps) {
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    return value;
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedDate = e.target.value;
    const formattedDate = new Date(selectedDate).toISOString().split('T')[0];
    return formattedDate;
  };

  const handleAdd = async () => {
    if (ten != "" && ngaysinh != "" && phone != "" && diachi != "" && ghichu != "" && ngaymua != "" && idnhanvien != "") {
      const data = {
        hoten : ten,
        ngaysinh,
        phone,
        diachi,
        ghichu,
        ngaymua,
        nhanVienID: idnhanvien,
        soLuong: soluong,
        tongTien: tongtien,
        sanPhamIDs
      };
      try {
        const response = await http.post("bill_add", data);
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
      alert("Xin mời nhập input")
    }
  };

  const handleRemoveItem = (indexToRemove: number) => {
    const updatedBillItems = billItems.filter((_, index) => index !== indexToRemove);
    setBillItems(updatedBillItems);
  };
  
  const totalQuantity = billItems.reduce((total: number, currentItem: BillItem) => total + currentItem.quantity, 0);
  const totalMoney = billItems.reduce((total: number, currentItem: BillItem) => total + currentItem.quantity * parseFloat(currentItem.item.GiaBan), 0);
  
  useEffect(() => {
    const newSanPhamIDs = billItems.map((sanpham) => sanpham.item.SanPhamID);
    setSanPhamIDs(newSanPhamIDs);
    setSoluong(totalQuantity);
    setTongtien(totalMoney);
  }, [billItems]);

  
  const [nvID, setNvID] = useState("");
  useEffect(() => {
    async function fetchData() {
      try {
        const token = getCookie("token")?.toString();
        const response = await http.get(
          `get_user_info`,
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
    <div className="pl-52 rounded-lg drop-shadow-2xl w-1/2 mr-5">
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
                  <Input
                    key="outside"
                    type="Date"
                    value={ngaysinh}
                    label=""
                    labelPlacement="outside"
                    onChange={(e) => {
                      const value = handleDateChange(e);
                      setNgaysinh(value);
                    }}
                  />
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
                  <Input
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
                  />
                </div>

                <Input
                  readOnly
                  key="outside"
                  type="text"
                  value={nvID}
                  label="ID Nhân viên"
                  labelPlacement="outside"
                />
              </div>
            </div>
          </CardHeader>
          <CardBody className="px-3 py-0 text-small text-default-400">
            {billItems?.map((sanpham, index) => (
              <div
                key={index + 1}
                className="flex flex-col gap-1 items-start justify-center"
              >
                -------------------------------------------------
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-[300px]">
                      <h4 className="text-small font-semibold leading-none text-default-600">
                        {index + 1}. Tên sản phẩm: {sanpham.item.TenSanPham}
                      </h4>
                    </div>
                    <Button style={{ height: '20px' }} onClick={() => handleRemoveItem(index)}>
                      Xóa
                    </Button>
                  </div>
                </div>
                <h4 className="text-small font-semibold leading-none text-default-600">
                  Giá bán: {sanpham.item.GiaBan} VNĐ
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
