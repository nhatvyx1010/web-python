"use client";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Button, SelectItem, Select } from "@nextui-org/react";
import { Input } from "@nextui-org/react";
import Dropzone from "react-dropzone";
import http from "@/app/utils/http";

interface Type {
  titleInput1: string;
  titleInput2: string;
  titleInput3: string;
  titleInput4: string;
  titlebutton: string;
  handleFunction: (
    input1: string,
    input2: string,
    input3: string,
    input4: string,
    image: File | null
  ) => Promise<void>;
}
interface DanhMuc {
  TenDanhMuc: string;
  // Other properties if available
}

export default function AddSanphamComponent({
  titleInput1,
  titleInput2,
  titleInput3,
  titleInput4,
  titlebutton,
  handleFunction,
}: Type) {
  const router = useRouter();

  const [input1, setInput1] = useState("");
  const [input2, setInput2] = useState("");
  const [input3, setInput3] = useState("");
  const [input4, setInput4] = useState("");
  const [listDanhMuc, setListDanhMuc] = useState<DanhMuc[]>([]); // Use the DanhMuc interface

  const [isImage, setIsImage] = useState(false);
  const [image, setImage] = useState<File | null>(null);
  const params = useSearchParams();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    return value;
  };

  const handleAddFunction = async () => {
    if (image) {
      await handleFunction(input1, input2, input3, input4, image);
    }
  };

  const onDrop = (acceptedFiles: File[]) => {
    // Handle the dropped files (in this case, only the first file is used)
    setImage(acceptedFiles[0]);
    setIsImage(true);
  };

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await http.get(
          `sanpham_select/${params.get("id")}`
        );

        if (response.status === 200) {
          setInput1(response.data.sanpham_dict.TenSanPham);
          setInput2(response.data.sanpham_dict.ThongTinSanPham);
          setInput3(response.data.sanpham_dict.GiaBan);
          setInput4(response.data.sanpham_dict.TenDanhMuc);
          setImage(response.data.sanpham_dict.Image);
          // console.log(response.data.khachhangs);
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
    async function fetchDanhMuc() {
      try {
        const response = await http.get(`get_list_danhmuc`);
        if (response.status === 200) {
          const danhMucsData: DanhMuc[] = response.data.danhmucs;
          setListDanhMuc(danhMucsData);
        } else {
          console.log('Error fetching danh muc');
        }
      } catch (error) {
        console.error("Error:", error);
      }
    }

    fetchDanhMuc();
  }, []);

  return (
    <>
      <Input
        isRequired
        type="text"
        label={titleInput1}
        value={input1}
        className="mb-5 h-12 mr-32"
        onChange={(e) => {
          const value = handleInputChange(e);
          setInput1(value);
        }}
      />

      <Input
        isRequired
        type="text"
        label={titleInput2}
        value={input2}
        className="mb-5 h-12 mr-32"
        onChange={(e) => {
          const value = handleInputChange(e);
          setInput2(value);
        }}
      />
      <Input
        isRequired
        type="text"
        label={titleInput3}
        value={input3}
        className="mb-5 h-12 mr-32"
        onChange={(e) => {
          const value = handleInputChange(e);
          setInput3(value);
        }}
      />

      <Input
        isRequired
        type="text"
        label={titleInput4}
        value={input4}
        className="mb-5 h-12 mr-32"
        onChange={(e) => {
          const value = handleInputChange(e);
          setInput4(value);
        }}
      />

{/* <Select
  label={titleInput4}
  value={input4}
  onChange={(e) => setInput4(e.target.value)}
  className="mb-5 h-12 mr-32"
>
  <SelectItem key="" value="">
    Chọn danh mục
  </SelectItem>
  {listDanhMuc.map((danhMuc: DanhMuc, index: number) => (
    <SelectItem
      key={index.toString()}
      value={danhMuc.TenDanhMuc}
    >
      {danhMuc.TenDanhMuc}
    </SelectItem>
  ))}
</Select> */}





  
      {isImage ? (
        // Display the selected image
        <div className="mb-5">
          {image && (
            <img
              src={URL.createObjectURL(image)}
              alt="Selected"
              className="max-w-full max-h-48"
            />
          )}
        </div>
      ) : (
        // Dropzone for image selection
        <Dropzone onDrop={onDrop}>
          {({ getRootProps, getInputProps }) => (
            <div
              {...getRootProps()}
              className="border-2 border-dashed border-gray-300 p-5 mb-5 cursor-pointer"
            >
              <input {...getInputProps()} />
              <p className="text-gray-600">
                {isImage ? "Image added" : "Chọn ảnh"}
              </p>
            </div>
          )}
        </Dropzone>
      )}

      <div className="flex justify-around">
        <Button
          color="danger"
          variant="flat"
          onClick={() => {
            const idDanhMuc = 'dm0001'; 
            router.push(`/view_danhmuc?id=${idDanhMuc}`);
          }}
        >
          Cancel
        </Button>
        <Button
          color="primary"
          onClick={() => {
            handleAddFunction();
            router.push(`/quanli_danhmuc`);
          }}
        >
          {titlebutton}
        </Button>
      </div>
    </>
  );
}
