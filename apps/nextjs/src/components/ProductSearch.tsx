import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import { Search } from "lucide-react";

import { api } from "~/utils/api";
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
  maxResults?: number;
}

const ProductSearch = ({ maxResults = 5 }: SearchProps) => {
  const { data } = api.shop.allProducts.useQuery();
  const { data: categoryData } = api.shop.getCategories.useQuery();
  const [category, setCategory] = useState<string>("all categories");

  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filtered, setFiltered] = useState<
    NonNullable<RouterOutputs["shop"]["allProducts"]>
  >([]);
  const router = useRouter();

  useEffect(() => {
    if (searchTerm.length > 0 && data) {
      const tempArray = [] as NonNullable<RouterOutputs["shop"]["allProducts"]>;
      for (let i = 0; i < data.length && tempArray.length <= maxResults; i++) {
        if (
          data[i]!.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
          (category === "all categories" || data[i]!.category.name === category)
        ) {
          tempArray.push(data[i]!);
        }
      }

      setFiltered(tempArray);
    } else {
      setFiltered([]);
    }
  }, [category, data, maxResults, searchTerm]);

  const handleOnSelect = (itemName: string) => {
    console.log("seleced");
    setSearchTerm("");
    void router.push(`/shop/${encodeURIComponent(itemName)}`);
  };
  const formatResult = (
    product: NonNullable<RouterOutputs["shop"]["productById"]>,
  ) => {
    return (
      <div
        key={product.id}
        className="group/item  grow  cursor-pointer bg-background "
      >
        <button
          className="flex w-full items-center gap-10 p-4"
          onClick={() => handleOnSelect(product.name)}
        >
          <Image
            alt={product.name}
            src={product.imageUrl}
            width={50}
            height={50}
            className="rounded-md"
          />
          <div className="flex  grow items-center justify-center self-stretch rounded-md p-2 group-hover/item:bg-secondary">
            <span className="text-center text-primary">{product.name}</span>
          </div>
        </button>
      </div>
    );
  };
  return (
    <div className="group/display relative flex flex-col p-2">
      <div className={`flex items-center`}>
        <div className="min-w-fit">
          <Select
            defaultValue="all categories"
            value={category}
            onValueChange={(selected) => {
              setCategory(selected);
            }}
          >
            <SelectTrigger className="h-11 rounded-r-none bg-secondary text-xs font-semibold focus:ring-0 focus:ring-offset-0 md:text-medium">
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={"all categories"}>All Categories</SelectItem>
              {categoryData?.map((category) => (
                <SelectItem key={category.id} value={category.name}>
                  {category.name}
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
            className="h-11 rounded-none border-x-0 focus-visible:ring-0 focus-visible:ring-offset-0 md:min-w-[12rem]"
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
          onClick={() => {
            void router.push({
              pathname: "/shop",
              query:
                category === "all categories"
                  ? { q: searchTerm }
                  : { category: category, q: searchTerm },
            });
          }}
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
        <div className="absolute right-[1px] top-full z-50 hidden  w-full rounded-md bg-background p-1 group-focus-within/display:block ">
          {filtered.map((v) => formatResult(v))}
        </div>
      )}
    </div>
  );
};

export default ProductSearch;
