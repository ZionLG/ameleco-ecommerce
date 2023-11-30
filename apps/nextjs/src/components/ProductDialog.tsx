import React, { useEffect, useState } from "react";
import Image from "next/image";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { Trash2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { z } from "zod";

import { RouterInputs } from "@ameleco/api";
import { productCreationSchema } from "@ameleco/api/src/schemas";

import { api } from "~/utils/api";
import { cn } from "~/utils/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Button, buttonVariants } from "./ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import { ScrollArea } from "./ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Separator } from "./ui/separator";
import { Textarea } from "./ui/textarea";

interface ProductDialogProps {
  actionType: "Create" | "Update";
  productId?: string;
  defaultValues?: {
    category: string;
    description: string;
    imageUrl: string;
    name: string;
    stock: number;
    pricing: {
      contractor: number;
      customer: number;
      frequent: number;
      professional: number;
      vip: number;
      visitor: number;
    };
  };
}
const ProductDialog = ({
  actionType,
  productId,
  defaultValues = {
    category: "",
    description: "",
    imageUrl: "",
    name: "",
    stock: 0,
    pricing: {
      contractor: 0,
      customer: 0,
      frequent: 0,
      professional: 0,
      vip: 0,
      visitor: 0,
    },
  },
}: ProductDialogProps) => {
  const form = useForm<z.infer<typeof productCreationSchema>>({
    resolver: zodResolver(productCreationSchema),

    defaultValues: defaultValues,
  });
  const [selectedFile, setSelectedFile] = useState<File>();
  const [previewLink, setPreviewLink] = useState<string | undefined>();
  const { data } = api.shop.getCategories.useQuery(undefined, {
    refetchOnWindowFocus: false,
  });
  const supabase = useSupabaseClient();

  useEffect(() => {
    if (!selectedFile) {
      setPreviewLink(undefined);
      return;
    }
    // create the preview
    const objectUrl = URL.createObjectURL(selectedFile);
    setPreviewLink(objectUrl);
    // free memory when ever this component is unmounted
    return () => URL.revokeObjectURL(objectUrl);
  }, [selectedFile]);
  const utils = api.useUtils();

  const { mutate: createProduct, isLoading: createProductIsLoading } =
    api.shop.addProduct.useMutation({
      onSuccess: () => {
        void utils.shop.allProducts.invalidate();
        toast.success("Product added successfully.");
      },
      onError: (error) => {
        toast.error(error.message);
      },
    });
  const { mutate: updateProduct, isLoading: updateProductIsLoading } =
    api.shop.updateProduct.useMutation({
      onSuccess: () => {
        void utils.shop.allProducts.invalidate();
        toast.success("Product updated successfully.");
      },
      onError: (error) => {
        toast.error(error.message);
      },
    });
  function onSubmit(values: z.infer<typeof productCreationSchema>) {
    console.log(values);
    if (actionType === "Create") createProduct(values);
    if (actionType === "Update" && productId)
      updateProduct({ data: values, productId: productId });
  }
  return (
    <Dialog>
      <DialogTrigger>
        <span className={`${cn(buttonVariants({ size: "lg" }))} `}>
          {actionType === "Create" ? "Add Product" : "Edit Product"}
        </span>
      </DialogTrigger>
      <DialogContent className="max-h-full max-w-[95%]">
        <DialogHeader>
          <DialogTitle>Poduct Creation</DialogTitle>
          <DialogDescription>
            This will create a new product to the store.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-[65vh] max-h-[65vh]  xl:h-fit xl:max-h-fit">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-col gap-5 p-3 "
            >
              <div className="flex flex-col gap-5 space-y-8 pr-5 xl:flex-row">
                <FormField
                  control={form.control}
                  name="imageUrl"
                  render={({ field }) => {
                    console.log(field);
                    return (
                      <FormItem className="w-60 grow">
                        <FormLabel>
                          <div className="flex items-center gap-2">
                            Image
                            {form.watch("imageUrl") != "" &&
                              actionType == "Create" && (
                                <Button
                                  type="button"
                                  onClick={async () => {
                                    if (selectedFile) {
                                      const { data, error } =
                                        await supabase.storage
                                          .from("Product Images")
                                          .remove([selectedFile.name]);
                                    }
                                    form.resetField("imageUrl");
                                    setPreviewLink(undefined);
                                    setSelectedFile(undefined);
                                  }}
                                  className="grow lg:grow-0"
                                  variant={"destructive"}
                                  size={"icon"}
                                >
                                  <Trash2 />
                                </Button>
                              )}
                          </div>
                        </FormLabel>
                        <FormControl>
                          <section className="mx-auto w-full items-center">
                            <div className="mx-auto max-w-sm items-center overflow-hidden rounded-lg bg-white shadow-md xl:mx-0">
                              <div className="px-4 py-6">
                                <div
                                  id="image-preview"
                                  className="mx-auto mb-4 max-w-sm cursor-pointer items-center rounded-lg border-2 border-dashed border-gray-400 bg-gray-100 p-6 text-center"
                                >
                                  <input
                                    id="upload"
                                    type="file"
                                    className="hidden"
                                    accept="image/*"
                                    onChange={(e) =>
                                      setSelectedFile(e.target.files![0])
                                    }
                                  />
                                  <label
                                    htmlFor="upload"
                                    className="cursor-pointer"
                                  >
                                    {previewLink ? (
                                      <Image
                                        alt="imagee"
                                        src={previewLink}
                                        width={300}
                                        height={300}
                                        className="h-auto w-auto"
                                      />
                                    ) : (
                                      <>
                                        <svg
                                          xmlns="http://www.w3.org/2000/svg"
                                          fill="none"
                                          viewBox="0 0 24 24"
                                          strokeWidth="1.5"
                                          stroke="currentColor"
                                          className="mx-auto mb-4 h-8 w-8 text-gray-700"
                                        >
                                          <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
                                          />
                                        </svg>
                                        <h5 className="mb-2 text-xl font-bold tracking-tight text-gray-700">
                                          Upload picture
                                        </h5>
                                        <p className="text-sm font-normal text-gray-400 md:px-6">
                                          Choose photo size should be less than{" "}
                                          <b className="text-gray-600">2mb</b>
                                        </p>
                                        <p className="text-sm font-normal text-gray-400 md:px-6">
                                          and should be in{" "}
                                          <b className="text-gray-600">
                                            an image
                                          </b>{" "}
                                          format.
                                        </p>
                                        <span
                                          id="filename"
                                          className="z-50 bg-gray-200 text-gray-500"
                                        ></span>
                                      </>
                                    )}
                                  </label>
                                </div>
                                <Button
                                  type="button"
                                  disabled={
                                    (form.watch("imageUrl") != "" &&
                                      actionType == "Create") ||
                                    selectedFile == undefined
                                  }
                                  className="w-full"
                                  onClick={async () => {
                                    if (selectedFile) {
                                      const { data, error } =
                                        await supabase.storage
                                          .from("Product Images")
                                          .upload(
                                            selectedFile.name,
                                            selectedFile,
                                          );

                                      if (data) {
                                        const { data: publicUrl } =
                                          supabase.storage
                                            .from("Product Images")
                                            .getPublicUrl(data.path);
                                        if (publicUrl)
                                          form.setValue(
                                            "imageUrl",
                                            publicUrl.publicUrl,
                                          );
                                      }
                                    }
                                  }}
                                >
                                  {form.watch("imageUrl") == "" ||
                                  actionType === "Update"
                                    ? "Upload"
                                    : "Uploaded"}
                                </Button>
                              </div>
                            </div>
                          </section>
                        </FormControl>
                        <FormDescription>
                          This is the product public Image.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />
                <Separator orientation="vertical" className="h-auto" />
                <div className="flex min-w-[200px] flex-col gap-5 lg:flex-row xl:flex-col xl:justify-center">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem className="grow xl:grow-0">
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormDescription>
                          This is the product name. (and URL)
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="stock"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Stock</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} />
                        </FormControl>
                        <FormDescription>
                          This is the available stock amount.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category</FormLabel>
                        <FormControl>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a category" />
                              </SelectTrigger>
                            </FormControl>

                            <SelectContent>
                              <ScrollArea className="h-36 max-h-36 pr-3">
                                {data?.map((category) => (
                                  <SelectItem
                                    key={category.id}
                                    value={category.name}
                                  >
                                    {category.name}
                                  </SelectItem>
                                ))}
                              </ScrollArea>
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormDescription>
                          Category of the product
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <Separator orientation="vertical" className="h-auto" />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea {...field} className="w-96 lg:h-3/4" />
                      </FormControl>
                      <FormDescription>
                        This is the product description.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Separator orientation="vertical" className="h-auto" />
                <div className="flex flex-row items-center  gap-5 xl:justify-center">
                  <div className="flex flex-col gap-2">
                    <FormField
                      control={form.control}
                      name="pricing.visitor"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Visitor Price</FormLabel>
                          <FormControl>
                            <div className="flex items-center gap-1">
                              <span>$</span>
                              <Input type="number" {...field} />
                            </div>
                          </FormControl>
                          <FormDescription>Odd walk.</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="pricing.customer"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Customer Price</FormLabel>
                          <FormControl>
                            <div className="flex items-center gap-1">
                              <span>$</span>
                              <Input type="number" {...field} />
                            </div>
                          </FormControl>
                          <FormDescription>
                            Home owners / Handymen.
                          </FormDescription>

                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="pricing.frequent"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Frequent Price</FormLabel>
                          <FormControl>
                            <div className="flex items-center gap-1">
                              <span>$</span>
                              <Input type="number" {...field} />
                            </div>
                          </FormControl>
                          <FormDescription>
                            Renovators / Maintenance workers
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <FormField
                      control={form.control}
                      name="pricing.contractor"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Contractor Price</FormLabel>
                          <FormControl>
                            <div className="flex items-center gap-1">
                              <span>$</span>
                              <Input type="number" {...field} />
                            </div>
                          </FormControl>
                          <FormDescription>
                            Builders / General contractors / Side jobsite
                            electricians
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="pricing.professional"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Professional Price</FormLabel>
                          <FormControl>
                            <div className="flex items-center gap-1">
                              <span>$</span>
                              <Input type="number" {...field} />
                            </div>
                          </FormControl>
                          <FormDescription>
                            Professional Electrician / Electrical Contractors
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="pricing.vip"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>VIP Price</FormLabel>
                          <FormControl>
                            <div className="flex items-center gap-1">
                              <span>$</span>
                              <Input type="number" {...field} />
                            </div>
                          </FormControl>
                          <FormDescription>VIP Customers</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </div>
              <div className="flex gap-2 lg:ml-auto lg:justify-center lg:self-end">
                <Button
                  type="reset"
                  onClick={async () => {
                    if (selectedFile && form.watch("imageUrl") != "") {
                      const { data, error } = await supabase.storage
                        .from("Product Images")
                        .remove([selectedFile.name]);
                    }
                    form.reset();
                    setPreviewLink(undefined);
                    setSelectedFile(undefined);
                  }}
                  className="grow lg:grow-0"
                  variant={"destructive"}
                >
                  Clear
                </Button>
                <Button
                  className="grow lg:grow-0"
                  type="submit"
                  disabled={createProductIsLoading || updateProductIsLoading}
                >
                  Submit
                </Button>
              </div>
            </form>
          </Form>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default ProductDialog;
