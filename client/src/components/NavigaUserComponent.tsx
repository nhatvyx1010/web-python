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
import { Item } from "../app/types/item.type";
import { BillItem } from "../app/types/billitem.type";
import ItemComponent from "@/components/ItemComponent";
import BillComponent from "@/components/BillComponent_User";

interface Info {
  DiaChi: string;
  GhiChu: string;
  Gmail: string;
  HoTen: string;
  NgaySinh: string;
  Phone: string;
}

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
  const [userId, setID] = useState("");



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
          setHoten(response.data.user_info.HoTen);
          setID(response.data.user_info.KhachHangID);
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

  
  const [billItems, setBillItems] = useState<BillItem[]>([]);

  const addToBill = (item: Item) => {
    const existingItemIndex = billItems.findIndex((billItem) => billItem.item.SanPhamID === item.SanPhamID);

    if (existingItemIndex !== -1) {
      const updatedBillItems = [...billItems];
      updatedBillItems[existingItemIndex].quantity += 1;
      setBillItems(updatedBillItems);
    } else {
      setBillItems((prevItems) => [...prevItems, { item: item, quantity: 1 }]);
    }
  };

  const removeFromBill = (item: Item) => {
    const existingItemIndex = billItems.findIndex(
      (billItem) => billItem.item.SanPhamID === item.SanPhamID
    );

    if (existingItemIndex !== -1) {
      const updatedBillItems = [...billItems];
      if (updatedBillItems[existingItemIndex].quantity === 1) {
        updatedBillItems.splice(existingItemIndex, 1);
      } else {
        updatedBillItems[existingItemIndex].quantity -= 1;
      }
      setBillItems(updatedBillItems);
    }
  };


  const [isDivHidden, setIsDivHidden] = useState(false);
  const [isNavbarItemHidden, setIsNavbarItemHidden] = useState(false);

  const handleButtonClick = () => {
    setIsDivHidden(!isDivHidden); // Toggle the div visibility
  };

  const handleNavbarItemClick = () => {
    setIsNavbarItemHidden(!isNavbarItemHidden); // Toggle the NavbarItem visibility
  };

  return (
    <>
      <div style={{ position: 'fixed', top: 0, width: '100%', zIndex: 40, marginBottom: 10 }}>
        <Navbar className="bg-white shadow-lg text-black">
          <NavbarBrand>
            <AcmeLogo />
            <p
              className="font-bold text-inherit cursor-pointer"
              onClick={() => router.push(`/home_user`)}
            >
              Vegetable Shop
            </p>
          </NavbarBrand>
          <NavbarContent className="hidden sm:flex gap-4" justify="center">
            <NavbarItem isActive>
              <Link href="/home_user" aria-current="page" color="secondary">
                Trang Chủ
              </Link>
            </NavbarItem>
          </NavbarContent>
          <NavbarContent justify="end">
            <Dropdown>
              <NavbarItem>
                <DropdownTrigger>
                  <Button
                    disableRipple
                    className="p-0 bg-transparent data-[hover=true]:bg-transparent"
                    endContent={icons.chevron}
                    radius="sm"
                    variant="light"
                  >
                    Chi tiết
                  </Button>
                </DropdownTrigger>
              </NavbarItem>
              <DropdownMenu
                aria-label="ACME features"
                className="w-[340px]"
                itemClasses={{
                  base: "gap-4",
                }}
              >
                <DropdownItem
                  key="autoscaling"
                  description="Hiển thị thông tin cá nhân, sửa, xóa,..."
                  startContent={icons.scale}
                  onClick={() => router.push(`/view_user_info`)}
                >
                  Thông tin cá nhân
                </DropdownItem>
                <DropdownItem
                  key="usage_metrics"
                  description="Hiển thị lịch sử mua hàng"
                  startContent={icons.activity}
                  
                  onClick={() => 
                    router.push(`/quanli_donhang_user?id=${userId}`)}
                >
                  Lịch sử mua hàng
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
            <NavbarItem>
              <Dropdown placement="bottom-end">
                <DropdownTrigger>
                  <Avatar
                    isBordered
                    as="button"
                    className="transition-transform"
                    color="secondary"
                    name="Jason Hughes"
                    size="sm"
                    src="https://i.pravatar.cc/150?u=a042581f4e29026704d"
                  />
                </DropdownTrigger>
                <DropdownMenu aria-label="Profile Actions" variant="flat">
                  <DropdownItem key="profile" className="h-14 gap-2">
                    <p className="font-semibold">Signed in as</p>
                    <p className="font-semibold">{hoten}</p>
                  </DropdownItem>
                  <DropdownItem
                    key="logout"
                    color="danger"
                    onClick={() => {
                      deleteCookie("token");
                      router.push(`/index`);
                    }}
                  >
                    Log Out
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </NavbarItem>
          </NavbarContent>
        </Navbar>
      </div>
    </>
  );
}
