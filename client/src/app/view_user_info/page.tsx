"use client";
import React, { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Avatar,
  Input,
  Button,
} from "@nextui-org/react";
import http from "../utils/http";
import { useSearchParams } from "next/navigation";
import { Infodonhang } from "../types/info.type";
import { deleteCookie, getCookie } from "cookies-next";

export default function App() {
  const params = useSearchParams();
  const [khachHangID, setKhachHangID] = useState("");
  const [hoTen, setHoten] = useState("");
  const [ngaysinh, setNgaySinh] = useState("");
  const [phone, setPhone] = useState("");
  const [diachi, setDiaChi] = useState("");
  const [ghichu, setGhiChu] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    return value;
  };
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedDate = e.target.value;
    const formattedDate = new Date(selectedDate).toISOString().split('T')[0];
    return formattedDate;
  };

  useEffect(() => {
    async function fetchData() {
      try {
        const token = getCookie("token")?.toString();
        const response = await http.get(
          `get_user_info_all`,
          {
            headers: {
              Authorization: `${token}`,
            },
          }
        );

        if (response.status === 200) {
          setKhachHangID(response.data.user_info.KhachHangID);
          setHoten(response.data.user_info.HoTen);
          setNgaySinh(response.data.user_info.NgaySinh);
          setPhone(response.data.user_info.Phone);
          setDiaChi(response.data.user_info.DiaChi);
          setGhiChu(response.data.user_info.GhiChu);
          setUsername(response.data.user_info.Username);
          setPassword(response.data.user_info.Password);
          console.log(response.data.user_info.SanPham);
        } else {
          console.log("Loi he thong");
        }
      } catch (error) {
        console.error("Error:", error);
      }
    }

    fetchData();
  }, []);

  const handleUpdate = async ()  => {
    const isConfirmed = window.confirm('Bạn có chắc chắn muốn thực hiện hành động này không?');
    if (!isConfirmed) {
      return; // Trở lại và không thực hiện gì cả nếu từ chối
    }
    if (khachHangID != "" && hoTen != "" && ngaysinh != "" && phone != "" && diachi != "" && username != "" && password != "") {
      const data = {
        khId: khachHangID,
        hoten: hoTen,
        ngaysinh: ngaysinh,
        phone: phone,
        diachi: diachi,
        username: username,
        password: password,
        ghichu: ghichu,
      };
      try {
        const response = await http.post(`khachhang_update_all/${khachHangID}`, data, {
          // headers: {
          //   Authorization: `${getCookie("token")?.toString()}`,
          // },
        });
        const result = await response.data;
        console.log(result);
        if (result.status == 200) {
          alert("Update thành công");
        } else if (result.status != 200) {
          alert("Update thất bại");
        }
      } catch (error) {
        console.error("Error:", error);
      }
    } else {
      alert("Xin mời nhập input")
    }
  };


  return (
    <div className="flex justify-center items-center h-screen">
      <div className="p-8 rounded-lg drop-shadow-2xl w-1/3">
        <Card className="max-w-[340px]">
          <div className="flex flex-col justify-center items-center gap-1 font-bold h-[desiredHeight] text-lg mb-2.5 mt-2.5">
            <h2>Thông tin cá nhân</h2>
            <CardHeader className="justify-between">
            <div className="flex gap-5">
              <div className="flex flex-col gap-1 items-start justify-center">
                <div className="flex w-full flex-wrap items-end md:flex-nowrap  gap-4 pb-2">
                  <Input
                    key="outside"
                    type="text"
                    label="Họ và Tên"
                    value={hoTen}
                    labelPlacement="outside"
                    onChange={(e) => {
                      const value = handleInputChange(e);
                      setHoten(value);
                    }}
                  />
                  <Input
                    key="outside"
                    type="Date"
                    label="Ngày sinh"
                    value={ngaysinh}
                    labelPlacement="outside"
                    onChange={(e) => {
                      const value = handleDateChange(e);
                      setNgaySinh(value);
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
                      setDiaChi(value);
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
                      setGhiChu(value);
                    }}
                  />
                </div>
                <div className="flex w-full flex-wrap items-end md:flex-nowrap  gap-4 pb-2">
                  <Input
                    key="outside"
                    type="text"
                    value={username}
                    label="Username"
                    labelPlacement="outside"
                    onChange={(e) => {
                      const value = handleInputChange(e);
                      setUsername(value);
                    }}
                  />
                  <Input
                    key="outside"
                    type="text"
                    value={password}
                    label="Password"
                    labelPlacement="outside"
                    onChange={(e) => {
                      const value = handleInputChange(e);
                      setPassword(value);
                    }}
                  />
                </div>
                <div className="flex w-full flex-wrap items-end md:flex-nowrap  gap-4 pb-2">
                <Button
                  color="default"
                  onClick={() => window.location.href = '/home_user'}
                  style={{ margin: 'auto', display: 'block' }}
                >
                  Thoát
                </Button>
                <Button
                  color="primary"
                  onClick={handleUpdate}
                  style={{ margin: 'auto', display: 'block' }}
                >
                  Cập nhật
                </Button>


                </div>
              
              </div>
              {/* onClick={() => handleAdd()} */}
            </div>
            </CardHeader>
          </div>
        </Card>
      </div>
    </div>
  );
}
