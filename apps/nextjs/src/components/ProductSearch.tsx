import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { Search, X } from "lucide-react";

import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

interface SearchProps {
  data: Data[];
  maxResults?: number;
}

interface Data {
  name: string;
  id: string;
  tumbURL: string;
}
export const categories = [
  {
    label: "All Categories",
    value: "all categories",
  },
  {
    label: "Breaker",
    value: "breaker",
  },
  {
    label: "Cooper",
    value: "cooper",
  },
];

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
    <div className="relative flex flex-col p-2">
      <div className={`flex items-center`}>
        <div className="min-w-fit">
          <Select defaultValue="all categories">
            <SelectTrigger className="bg-secondary h-11 rounded-r-none focus:ring-0 focus:ring-offset-0">
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category.value} value={category.value}>
                  {category.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex  grow">
          <Input
            type="search"
            value={searchTerm}
            placeholder="Search..."
            onChange={(e) => setSearchTerm(e.target.value)}
            className="h-11 min-w-[12rem] rounded-none border-x-0 focus-visible:ring-0 focus-visible:ring-offset-0"
          />
          {/* {searchTerm !== "" && (
            <X
              cursor={"pointer"}
              className="text-primary h-11 w-8 border-y pr-2"
              onClick={() => setSearchTerm("")}
            />
          )} */}
        </div>
        <Search
          cursor={"pointer"}
          className="h-11 w-16 rounded-r-md bg-blue-950 p-2 text-white"
        />
        {/* {
          <MdClear
            className="cursor-pointer text-gray-500"
            onClick={() => setSearchTerm("")}
            size={25}
          /> */}
      </div>
      {filtered.length > 0 && (
        <div className="absolute top-full z-50 w-full rounded-b bg-white ">
          {filtered.map((v) => formatResult(v))}
        </div>
      )}
    </div>
  );
};

export default ProductSearch;
