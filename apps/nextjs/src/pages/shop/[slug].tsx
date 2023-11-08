import React, { useState } from "react";
import type {
  GetStaticPaths,
  GetStaticPropsContext,
  InferGetStaticPropsType,
} from "next";
import Image from "next/image";
import { useRouter } from "next/router";
import { BreadcrumbItem, Breadcrumbs, Spinner } from "@nextui-org/react";
import { createServerSideHelpers } from "@trpc/react-query/server";
import { Dot, Minus, Plus } from "lucide-react";
import superjson from "superjson";

import { appRouter } from "@ameleco/api";
import { prisma } from "@ameleco/db";

import { api } from "~/utils/api";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Separator } from "~/components/ui/separator";

const ProductPage = (props: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { name } = props;

  const router = useRouter();
  const product = api.shop.productByName.useQuery({
    productName: name,
  });
  const [quantity, setQuantity] = useState(1);
  const utils = api.useContext();
  const { mutate, isLoading } = api.shop.addToCart.useMutation({
    onSuccess: () => {
      void utils.shop.getCart.invalidate();
    },
  });
  if (router.isFallback || product.status !== "success") {
    return <div>Loading...</div>;
  }
  if (product.data) {
    const productData = product.data;
    return (
      <main className="flex flex-col justify-center gap-10 bg-secondary px-10 py-5 ">
        <Breadcrumbs>
          <BreadcrumbItem>Home</BreadcrumbItem>
          <BreadcrumbItem>Music</BreadcrumbItem>
          <BreadcrumbItem>Artist</BreadcrumbItem>
          <BreadcrumbItem>Album</BreadcrumbItem>
          <BreadcrumbItem>Song</BreadcrumbItem>
        </Breadcrumbs>
        <div className="invisible hidden justify-center gap-10 md:visible md:flex">
          <div className="grid max-w-2xl grid-rows-2 gap-10">
            <div className=" rounded-sm bg-background p-10 shadow-md">
              <Image
                src={productData.imageUrl}
                alt={productData.name}
                width={500}
                height={500}
                className="max-h-[36rem]"
              />
            </div>
            <div className="flex flex-col gap-5 rounded-sm bg-background p-10 shadow-md">
              <span className="  text-xl font-semibold">Description</span>
              <span className="text-2xl font-bold ">{productData.name}</span>
              <p>{productData.description}</p>
            </div>
          </div>
          <div className="top-60 flex h-fit flex-col  gap-10  rounded-sm bg-background px-10 py-5 shadow-md md:sticky lg:top-52 3xl:top-64">
            <span className="text-2xl font-bold">{productData.name}</span>
            <span className="text-sm">{productData.category}</span>
            <Separator className="my-2" />
            <span className="min-w-fit">
              Price:
              <span className="text-xl font-semibold">
                {" "}
                {Object.keys(productData.price).map(function (key) {
                  return (
                    "$" +
                    productData.price[key as keyof typeof productData.price]
                  );
                })}
              </span>
            </span>
            <div className="flex whitespace-nowrap">
              Stock:{" "}
              <span
                className={`flex items-center font-bold ${
                  productData.stock > 0 ? " text-green-600" : "text-gray-500"
                }`}
              >
                <Dot />
                {productData.stock > 0 ? (
                  <span>In stock ({productData.stock} units)</span>
                ) : (
                  <span>Sold out</span>
                )}
              </span>
            </div>
            <div className="flex items-center gap-5">
              <span>Quantity: </span>
              <div className="flex">
                <Button
                  variant={"outline"}
                  size={"icon"}
                  className="rounded-none border border-r-0 p-2"
                  onClick={() =>
                    setQuantity((old) => {
                      if (old > 1) return old - 1;
                      return old;
                    })
                  }
                >
                  <Minus />
                </Button>
                <Input
                  type="number"
                  className="w-14 rounded-none p-2 text-center text-lg focus-visible:ring-transparent"
                  value={quantity}
                  onChange={(e) => {
                    if (Number.isNaN(e.target.valueAsNumber)) {
                      setQuantity(1);
                      return;
                    } else if (e.target.valueAsNumber > productData.stock) {
                      setQuantity(productData.stock);
                      return;
                    }
                    setQuantity(e.target.valueAsNumber);
                  }}
                />
                <Button
                  variant={"outline"}
                  className="rounded-none border-l-0  p-2"
                  size={"icon"}
                  onClick={() =>
                    setQuantity((old) => {
                      if (old < productData.stock) return old + 1;
                      return old;
                    })
                  }
                >
                  <Plus />
                </Button>
              </div>
            </div>
            <Button
              disabled={isLoading || productData.stock === 0}
              onClick={() =>
                mutate({ productId: productData.id, productQuantity: quantity })
              }
            >
              {isLoading && (
                <Spinner color="secondary" className="mr-2" size="sm" />
              )}
              Add To Cart
            </Button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="flex flex-col items-center justify-center gap-10 px-10 py-5 ">
      <Spinner />
    </main>
  );
};

export async function getStaticProps(
  context: GetStaticPropsContext<{ slug: string }>,
) {
  const helpers = createServerSideHelpers({
    router: appRouter,
    ctx: { prisma: prisma, user: null, supabase: null },
    transformer: superjson, // optional - adds superjson serialization
  });
  const name = context.params?.slug!;
  // prefetch `post.byId`
  await helpers.shop.productByName.prefetch({ productName: name });
  return {
    props: {
      trpcState: helpers.dehydrate(),
      name,
    },
    revalidate: 1,
  };
}

export const getStaticPaths: GetStaticPaths = async () => {
  const posts = await prisma.product.findMany({
    select: {
      name: true,
    },
  });

  return {
    paths: posts.map((post) => ({
      params: {
        slug: encodeURIComponent(post.name),
      },
    })),
    // https://nextjs.org/docs/pages/api-reference/functions/get-static-paths#fallback-blocking
    fallback: true,
  };
};

export default ProductPage;