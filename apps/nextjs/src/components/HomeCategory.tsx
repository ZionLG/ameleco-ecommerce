import React from "react";
import type { StaticImport } from "next/dist/shared/lib/get-img-props";
import Image from "next/image";
import { Card } from "@nextui-org/react";

export interface HomeCategoryProps {
  image: string | StaticImport;
  title: string;
  description: string;
}

const HomeCategory = ({ description, image, title }: HomeCategoryProps) => {
  return (
    <Card
      isPressable
      className="flex h-56 w-60 cursor-pointer flex-col items-center justify-center gap-1 rounded-lg bg-background p-5 shadow-lg"
    >
      <Image src={image} alt={title} className="rounded-md" />
      <div className="flex flex-col items-center">
        <span className="text-lg font-semibold">{title}</span>
        <span>{description}</span>
      </div>
    </Card>
  );
};

export default HomeCategory;
