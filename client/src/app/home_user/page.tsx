"use client";
import React, { useEffect, useState } from "react";
import NavigaComponent from "@/components/NavigaUserComponent";
import { getCookie } from "cookies-next";
import { Card, CardHeader, CardFooter, Button, Image } from "@nextui-org/react";
// import Image from "next/image";
import anh1 from "@/app/images/anh1.jpg";
import anh2 from "@/app/images/anh2.jpg";
import anh3 from "@/app/images/anh3.jpg";
import anh4 from "@/app/images/anh4.jpg";
import anh5 from "@/app/images/anh5.jpg";
import ItemComponent from "@/components/ItemComponent";
import BillComponent from "@/components/BillComponent_User";
import { Item } from "../types/item.type";
import { BillItem } from "../types/billitem.type";
import http from "@/app/utils/http";

export default function Homepage() {
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

  return (
<div>
  <div style={{ position: 'fixed', top: 0, width: '100%', zIndex: 40, marginBottom: 10 }}>
    <NavigaComponent />
  </div>
  <div style={{ marginTop: 80, paddingTop: 10, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 'calc(100vh - 200px)' }}>
    <div className="flex">
      <ItemComponent onAddToBill={addToBill} />
      <BillComponent billItems={billItems} onRemoveFromBill={removeFromBill} />
    </div>
  </div>
</div>
  );
}
