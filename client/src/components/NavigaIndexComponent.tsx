"use client";
import React, { useEffect, useState } from "react";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Link,
  Input,
  Dropdown,
  DropdownTrigger,
  Button,
  DropdownMenu,
  DropdownItem,
  Avatar,
} from "@nextui-org/react";
import AcmeLogo from "../app/Icon/AcmeLogo";
import {
  ChevronDown,
  Lock,
  Activity,
  Flash,
  Server,
  TagUser,
  Scale,
} from "../app/Icon/Icons";
import { useRouter } from "next/navigation";
import { deleteCookie, getCookie } from "cookies-next";
import http from "@/app/utils/http";

interface Info {
  DiaChi: string;
  GhiChu: string;
  Gmail: string;
  HoTen: string;
  NgaySinh: string;
  Phone: string;
}
import { SlLogin } from "react-icons/sl";

export default function NavigaComponent() {
  const icons = {
    chevron: <ChevronDown fill="currentColor" size={16} />,
    scale: <Scale className="text-warning" fill="currentColor" size={30} />,
    lock: <Lock className="text-success" fill="currentColor" size={30} />,
    activity: (
      <Activity className="text-secondary" fill="currentColor" size={30} />
    ),
    flash: <Flash className="text-primary" fill="currentColor" size={30} />,
    server: <Server className="text-success" fill="currentColor" size={30} />,
    user: <TagUser className="text-danger" fill="currentColor" size={30} />,
  };

  const router = useRouter();
  const [hoten, setHoten] = useState("");



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
          setHoten(response.data.user_info.HoTen);
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

  return (
    <>
      <Navbar className="bg-white shadow-lg text-black">
        <NavbarBrand>
          <AcmeLogo />
          <p
            className="font-bold text-inherit cursor-pointer"
            onClick={() => router.push(`/index`)}
          >
            Vegetable Shop
          </p>
        </NavbarBrand>
        <NavbarContent className="hidden sm:flex gap-4" justify="center">
          <NavbarItem isActive>
            <Link href="/index" aria-current="page" color="secondary">
              Trang Chủ
            </Link>
          </NavbarItem>
        </NavbarContent>
        <NavbarContent justify="end">
          <Button
            disableRipple
            className="font-bold p-0 bg-transparent data-[hover=true]:bg-transparent"
            radius="sm"
            variant="light"
            aria-current="page" color="secondary"
            onClick={() => {
              deleteCookie("token");
              router.push(`/login`);
            }}
          >
            Login
            <SlLogin className="text-xl text-purple-500" />
          </Button>
        </NavbarContent>
      </Navbar>
    </>
  );
}
