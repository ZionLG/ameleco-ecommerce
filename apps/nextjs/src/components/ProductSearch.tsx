import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import { Search } from "lucide-react";

import type { RouterOutputs } from "~/utils/api";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

interface SearchProps {
  data: NonNullable<RouterOutputs["shop"]["allProducts"]>;
  maxResults?: number;
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
  const [filtered, setFiltered] = useState<
    NonNullable<RouterOutputs["shop"]["allProducts"]>
  >([]);
  const router = useRouter();

  useEffect(() => {
    console.log(searchTerm);
    if (searchTerm.length > 0) {
      const tempArray = [] as NonNullable<RouterOutputs["shop"]["allProducts"]>;
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

  const handleOnSelect = async (itemId: string) => {
    setSearchTerm("");
    await router.push(`/shop/${itemId}`);
  };
  const formatResult = (
    product: NonNullable<RouterOutputs["shop"]["productById"]>,
  ) => {
    return (
      <div
        key={product.id}
        onClick={() => handleOnSelect(product.id)}
        className="bg-background group/item flex cursor-pointer items-center gap-10  p-4"
      >
        <Image
          alt={product.name}
          src={product.avatarUrl}
          width={50}
          height={50}
          className="rounded-md"
        />
        <div className="group-hover/item:bg-secondary  flex grow items-center justify-center self-stretch rounded-md p-2">
          <span className="text-primary text-center">{product.name}</span>
        </div>
      </div>
    );
  };
  return (
    <div className="group/display relative flex flex-col p-2">
      <div className={`flex items-center`}>
        <div className="min-w-fit">
          <Select defaultValue="all categories">
            <SelectTrigger className="bg-secondary h-11 rounded-r-none font-semibold focus:ring-0 focus:ring-offset-0">
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
        <div className="bg-background absolute right-[1px] top-full z-50  hidden w-full rounded-md p-1 group-focus-within/display:block ">
          {filtered.map((v) => formatResult(v))}
        </div>
      )}
    </div>
  );
};

export default ProductSearch;
