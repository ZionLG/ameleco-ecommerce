import React from "react";
import Image from "next/image";
import { BreadcrumbItem, Breadcrumbs } from "@nextui-org/react";
import { createServerSideHelpers } from "@trpc/react-query/server";
import superjson from "superjson";

import { appRouter } from "@ameleco/api";
import { prisma } from "@ameleco/db";

import { api } from "~/utils/api";
import ProductCard from "~/components/ProductCard";

const Shop = () => {
  const products = api.shop.allProducts.useQuery();

  return (
    <main className="flex flex-col justify-center gap-10 px-10 py-5 ">
      <div className="flex flex-col items-center justify-around gap-10 bg-[#F2F2F7] p-5 font-bold md:flex-row">
        <div className="flex flex-col gap-2 ">
          <span className="text-7xl text-blue-950">Electric Supply</span>
          <p className="text-lg font-light">
            Find all items you need here. Commercial, industrial materials and
            residential.
          </p>
        </div>
        <Image src={"/shop.svg"} alt="Shop" width={500} height={500} />
      </div>
      <Breadcrumbs>
        <BreadcrumbItem href="/">Home</BreadcrumbItem>
        <BreadcrumbItem href="/shop">Shop</BreadcrumbItem>
      </Breadcrumbs>
      <div className=" mt-10 grid grid-cols-1 justify-center gap-x-32 gap-y-10 md:grid-cols-2  xl:grid-cols-3 2xl:grid-cols-4">
        {products.data?.map((product) => (
          <ProductCard product={product} key={product.id} />
        ))}
      </div>

      {/* <pre> {JSON.stringify(products.data, null, 4)}</pre> */}
    </main>
  );
};

export async function getStaticProps() {
  const helpers = createServerSideHelpers({
    router: appRouter,
    ctx: { prisma: prisma, user: null, supabase: null },
    transformer: superjson,
  });

  await helpers.shop.allProducts.prefetch();

  return {
    props: {
      trpcState: helpers.dehydrate(),
    },
    revalidate: 1,
  };
}
export default Shop;
