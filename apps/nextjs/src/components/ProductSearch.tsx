import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";

interface SearchProps {
  data: Data[];
  maxResults?: number;
}

interface Data {
  name: string;
  id: string;
  tumbURL: string;
}

const ProductSearch = ({ data, maxResults = 5 }: SearchProps) => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filtered, setFiltered] = useState<Data[]>([]);
  const router = useRouter();

  useEffect(() => {
    console.log(searchTerm);
    if (searchTerm.length > 0) {
      const tempArray = [] as Data[];
      for (let i = 0; i < data.length && tempArray.length <= maxResults; i++) {
        if (data[i]!.name.toLowerCase().includes(searchTerm.toLowerCase())) {
          tempArray.push(data[i]!);
        }
      }

      setFiltered(tempArray);
    } else {
      setFiltered([]);
    }
  }, [data, maxResults, searchTerm]);

  useEffect(() => {
    console.log(filtered);
  }, [filtered]);

  const handleOnSelect = (itemId: string) => {
    setSearchTerm("");
    router.push(`/shop/${itemId}`);
  };
  const formatResult = (item: Data) => {
    return (
      <div
        onClick={() => handleOnSelect(item.id)}
        className="group flex cursor-pointer items-center  gap-10 bg-white p-4"
      >
        <Image alt={item.name} src={item.tumbURL} width={50} height={50} />
        <div className="flex  grow items-center justify-center self-stretch rounded-md p-2 group-hover:bg-gray-200">
          <span className="text-center text-black">{item.name}</span>
        </div>
      </div>
    );
  };
  return (
    <div className="relative flex flex-col">
      <div
        className={`flex bg-white ${
          filtered.length > 0 ? " rounded-t-md" : " rounded-md"
        } items-center gap-2 p-2`}
      >
        <input
          className=" rounded-lg border-none bg-white  px-5  text-black"
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        {/* <MdClear
          className="text-gray-500 cursor-pointer"
          onClick={() => setSearchTerm("")}
          size={25}
        /> */}
      </div>
      {filtered.length > 0 && (
        <div className="absolute top-full z-50 w-full rounded-b bg-white p-2">
          {filtered.map((v) => formatResult(v))}
        </div>
      )}
    </div>
  );
};

export default ProductSearch;
