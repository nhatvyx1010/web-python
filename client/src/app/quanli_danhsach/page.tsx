"use client";
import React, { useEffect, useState } from "react";
import NavigaComponent from "@/components/NavigaComponent";
import {
  Tabs,
  Tab,
  Card,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Button,
  CardBody,
} from "@nextui-org/react";
import http from "../utils/http";
import { RiDeleteBin5Line, RiEditBoxLine } from "react-icons/ri";
import { Nhanvien } from "../types/nhanvien.type";
import { Khachhang } from "../types/khachhang.type";
import { useRouter } from "next/navigation";
import { BiPlus } from "react-icons/bi";

interface User {
  Note: string;
  Password: string;
  Role: string;
  UserID: number;
  Username: string;
}

export default function Quanlydanhsach() {
  const [Users, setUsers] = useState<User[]>([]);
  const userList = Array.isArray(Users) ? Users : [];
  const [Nhanviens, setNhanvien] = useState<Nhanvien[]>([]);
  const nhanvienList = Array.isArray(Nhanviens) ? Nhanviens : [];
  const [KhachHangs, setKhachhang] = useState<Khachhang[]>([]);
  const khachhangList = Array.isArray(KhachHangs) ? KhachHangs : [];
  const router = useRouter();

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await http.get(
          `user_index`
          // {
          //   headers: {
          //     Authorization: `${token}`,
          //   },
          // }
        );

        if (response.status === 200) {
          setUsers(response.data.users);
          console.log(response.data.users);
        } else {
          console.log("Loi he thong");
        }
      } catch (error) {
        console.error("Error:", error);
      }
    }

    fetchData();
  }, []);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await http.get(
          `nhanvien_index`
          // {
          //   headers: {
          //     Authorization: `${token}`,
          //   },
          // }
        );

        if (response.status === 200) {
          setNhanvien(response.data.nhanviens);
          console.log(response.data.nhanviens);
        } else {
          console.log("Loi he thong");
        }
      } catch (error) {
        console.error("Error:", error);
      }
    }

    fetchData();
  }, []);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await http.get(
          `khachhang_index`
          // {
          //   headers: {
          //     Authorization: `${token}`,
          //   },
          // }
        );

        if (response.status === 200) {
          setKhachhang(response.data.khachhangs);
          console.log(response.data.khachhangs);
        } else {
          console.log("Loi he thong");
        }
      } catch (error) {
        console.error("Error:", error);
      }
    }

    fetchData();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await http.get(`nhanvien_index`);
      if (response.status === 200) {
        setNhanvien(response.data.nhanviens);
        console.log(response.data.danhmucs);
      } else {
        console.log("Loi he thong");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <>
      <NavigaComponent />
      <div className="flex w-full flex-col">
        <Tabs aria-label="Options" className="mt-5">
          <Tab key="Nhân viên" title="Nhân viên">
            <Card>
              <CardBody>
                <div className="flex flex-row items-center justify-between mb-4">
                  <h5 className="font-bold text-xl">
                    Danh sách nhân viên trong hệ thống
                  </h5>

                  <div className="flex flex-row items-center justify-end space-x-4 px-4">
                    <Button
                      isIconOnly
                      color="success"
                      onClick={() => router.push("/add_nhanvien")}
                      className="mb-2"
                    >
                      <BiPlus size={25} />
                    </Button>
                  </div>
                </div>
                <Table aria-label="Example static collection table">
                  <TableHeader>
                    <TableColumn>NhanvienID</TableColumn>
                    <TableColumn>Họ Tên</TableColumn>
                    <TableColumn>Ngày Sinh</TableColumn>
                    <TableColumn>Địa chỉ</TableColumn>
                    <TableColumn>Ghi Chú</TableColumn>
                    <TableColumn>Phone</TableColumn>
                    <TableColumn>Chức năng</TableColumn>
                  </TableHeader>
                  <TableBody>
                    {nhanvienList?.map((value, index) => {
                      return (
                        <TableRow key={index}>
                          <TableCell>{value.NhanVienID}</TableCell>
                          <TableCell>
                            <div className="flex flex-col items-start justify-start">
                              <span className="font-semibold">
                                {value.HoTen}
                              </span>
                            </div>
                          </TableCell>

                          <TableCell>
                            <div className="flex flex-col items-start justify-start">
                              <span className="font-semibold">
                                {value.NgaySinh}
                              </span>
                            </div>
                          </TableCell>

                          <TableCell>
                            <div className="flex flex-col items-start justify-start">
                              <span className="font-semibold">
                                {value.DiaChi}
                              </span>
                            </div>
                          </TableCell>

                          <TableCell>
                            <div className="flex flex-col items-start justify-start">
                              <span className="font-semibold">
                                {value.GhiChu}
                              </span>
                            </div>
                          </TableCell>

                          <TableCell>
                            <div className="flex flex-col items-start justify-start">
                              <span className="font-semibold">
                                {value.Phone}
                              </span>
                            </div>
                          </TableCell>

                          <TableCell>
                            <div className="flex flex-row items-center justify-start space-x-4">
                              <Button isIconOnly color="primary">
                                <RiEditBoxLine
                                  size={20}
                                  onClick={() => router.push(`/update_nhanvien?id=${value.NhanVienID}`)}
                                />
                              </Button>
                              <Button
                                isIconOnly
                                color="danger"
                                onClick={() => {
                                  
                                  const headers: Headers = new Headers();
                                  headers.append(
                                    "Accept",
                                    "application/json"
                                  );
                                  headers.append(
                                    "Content-Type",
                                    "application/json"
                                  );
                                  // headers.append(
                                  //   "Authorization",
                                  //   getCookie("token") as string
                                  // );
                                  fetch(
                                    `${process.env.BACKEND_URL}nhanvien_delete/${value.NhanVienID}`,
                                    {
                                      method: "DELETE",
                                      headers: headers,
                                    
                                    }
                                  )
                                    .then((r) => r.json())
                                    .then((d) => {
                                      if (d.message === "Người dùng đã được xóa thành công") {
                                        alert("Xóa thành công")
                                        fetchOrders()
                                      } else 
                                      alert("Xóa thất bại")
                                    });
                                }}
                              >
                                <RiDeleteBin5Line size={20} />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </CardBody>
            </Card>
          </Tab>
          <Tab key="Khách hàng" title="Khách hàng">
            <Card>
              <CardBody>
                <div className="flex flex-row items-center justify-between mb-4">
                  <h5 className="font-bold text-xl">
                    Danh sách khách hàng
                  </h5>

                  <div className="flex flex-row items-center justify-end space-x-4 px-4">
                    <Button
                      isIconOnly
                      color="success"
                      onClick={() => router.push("/add_khachhang")}
                      className="mb-2"
                    >
                      <BiPlus size={25} />
                    </Button>
                  </div>
                </div>
                <Table aria-label="Example static collection table">
                  <TableHeader>
                    <TableColumn>KhachHangID</TableColumn>
                    <TableColumn>Họ Tên</TableColumn>
                    <TableColumn>Ngày Sinh</TableColumn>
                    <TableColumn>Địa chỉ</TableColumn>
                    <TableColumn>Ghi Chú</TableColumn>
                    <TableColumn>Phone</TableColumn>
                    <TableColumn>Chức năng</TableColumn>
                  </TableHeader>
                  <TableBody>
                    {khachhangList?.map((value, index) => {
                      return (
                        <TableRow key={index}>
                          <TableCell>{value.KhachHangID}</TableCell>
                          <TableCell>
                            <div className="flex flex-col items-start justify-start">
                              <span className="font-semibold">
                                {value.HoTen}
                              </span>
                            </div>
                          </TableCell>

                          <TableCell>
                            <div className="flex flex-col items-start justify-start">
                              <span className="font-semibold">
                                {value.NgaySinh}
                              </span>
                            </div>
                          </TableCell>

                          <TableCell>
                            <div className="flex flex-col items-start justify-start">
                              <span className="font-semibold">
                                {value.DiaChi}
                              </span>
                            </div>
                          </TableCell>

                          <TableCell>
                            <div className="flex flex-col items-start justify-start">
                              <span className="font-semibold">
                                {value.GhiChu}
                              </span>
                            </div>
                          </TableCell>

                          <TableCell>
                            <div className="flex flex-col items-start justify-start">
                              <span className="font-semibold">
                                {value.Phone}
                              </span>
                            </div>
                          </TableCell>

                          <TableCell>
                            <div className="flex flex-row items-center justify-start space-x-4">
                              <Button isIconOnly color="primary">
                                <RiEditBoxLine
                                  size={20}
                                  onClick={() => router.push(`/update_khachhang?id=${value.KhachHangID}`)}
                                />
                              </Button>
                              <Button
                                isIconOnly
                                color="danger"
                                onClick={() => {
                                  
                                  const headers: Headers = new Headers();
                                  headers.append(
                                    "Accept",
                                    "application/json"
                                  );
                                  headers.append(
                                    "Content-Type",
                                    "application/json"
                                  );
                                  // headers.append(
                                  //   "Authorization",
                                  //   getCookie("token") as string
                                  // );
                                  fetch(
                                    `${process.env.BACKEND_URL}khachhang_delete/${value.KhachHangID}`,
                                    {
                                      method: "DELETE",
                                      headers: headers,
                                    
                                    }
                                  )
                                    .then((r) => r.json())
                                    .then((d) => {
                                      if (d.message === "Người dùng đã được xóa thành công") {
                                        alert("Xóa thành công")
                                        fetchOrders()
                                      } else 
                                      alert("Xóa thất bại")
                                    });
                                }}
                              >
                                <RiDeleteBin5Line size={20} />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </CardBody>
            </Card>
          </Tab>
          <Tab key="Thongtin" title="Thông tin">
            <Card>
              <Table aria-label="Example static collection table">
                <TableHeader>
                  <TableColumn>UserID</TableColumn>
                  <TableColumn>Username</TableColumn>
                  <TableColumn>Role</TableColumn>
                  <TableColumn>Note</TableColumn>
                </TableHeader>
                <TableBody>
                  {userList?.map((value, index) => {
                    return (
                      <TableRow key={index}>
                        <TableCell>{value.UserID}</TableCell>
                        <TableCell>
                          <div className="flex flex-col items-start justify-start">
                            <span className="font-semibold">
                              {value.Username}
                            </span>
                          </div>
                        </TableCell>

                        <TableCell>
                          <div className="flex flex-col items-start justify-start">
                            <span className="font-semibold">{value.Role}</span>
                          </div>
                        </TableCell>

                        <TableCell>
                          <div className="flex flex-col items-start justify-start">
                            <span className="font-semibold">{value.Note}</span>
                          </div>
                        </TableCell>

                        
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </Card>
          </Tab>
        </Tabs>
      </div>
    </>
  );
}
