import React, { useEffect, useState } from "react";
import http from "@/app/utils/http";
import { Item } from "@/app/types/item.type";
import { Button, Card, CardBody, CardHeader, Image } from "@nextui-org/react";
import { createPortal } from "react-dom";

interface ItemModalProps {
  selectedItem: Item | null;
  onClose: () => void;
}

const ItemModal: React.FC<ItemModalProps> = ({ selectedItem, onClose }) => {
  if (!selectedItem) return null;
  const overlayStyle: React.CSSProperties = {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Màu nền làm mờ
    zIndex: 1000,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  };
  
  const modalStyle: React.CSSProperties = {
    maxWidth: "45%",
    minWidth: "30%",
    maxHeight: "100%",
    backgroundColor: "white",
    borderRadius: "8px",
    padding: "20px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)", // Hiệu ứng bóng đổ
  };
  
  const cardBodyStyle: React.CSSProperties = {
    fontWeight: "bold",
    fontSize: "16px",
  };
  
  return createPortal(
    <div style={overlayStyle} onClick={onClose}>
      <div style={modalStyle}>
        <Card shadow="sm">
          <CardBody style={cardBodyStyle}>
          <p><strong>Tên sản phẩm:</strong> {selectedItem.TenSanPham}</p>
          <p><strong>Thông tin sản phẩm:</strong> {selectedItem.ThongTinSanPham}</p>
          <p><strong>Giá bán:</strong> {parseInt(selectedItem.GiaBan)} VNĐ</p><br></br>
            <Image
              shadow="sm"
              radius="lg"
              width="100%"
              alt={selectedItem.SanPhamID}
              className="w-full object-cover h-[320px]"
              src={`${process.env.BACKEND_URL}${selectedItem.HinhAnh}`}
            />
            {/* Other details of the selected item */}
          </CardBody>
        </Card>
      </div>
    </div>,
    document.body
  );
};

export default ItemModal;
