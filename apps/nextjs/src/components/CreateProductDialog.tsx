import React, { useEffect, useState } from "react";
import Image from "next/image";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

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

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  imageUrl: z.string(),
});
const CreateProductDialog = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      imageUrl: "",
    },
  });
  const [selectedFile, setSelectedFile] = useState<File>();
  const [previewLink, setPreviewLink] = useState<string>();

  const supabase = useSupabaseClient();
  useEffect(() => {
    console.log(form.watch("imageUrl"));
  }, [form.watch("imageUrl")]);

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

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
  }
  return (
    <Dialog>
      <DialogTrigger>
        <span className={`${cn(buttonVariants({ size: "lg" }))} `}>
          Add Product
        </span>
      </DialogTrigger>
      <DialogContent className="lg:max-w-4xl xl:max-w-6xl">
        <DialogHeader>
          <DialogTitle>Poduct Creation</DialogTitle>
          <DialogDescription>
            This will create a new product to the store.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-5 space-y-8 lg:flex-row"
          >
            <FormField
              control={form.control}
              name="imageUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Image</FormLabel>
                  <FormControl>
                    <section className="mx-auto w-full items-center">
                      <div className=" max-w-sm items-center overflow-hidden rounded-lg bg-white shadow-md">
                        <div className="px-4 py-6">
                          <div
                            id="image-preview"
                            className="mx-auto mb-4 max-w-sm cursor-pointer items-center rounded-lg border-2 border-dashed border-gray-400 bg-gray-100 p-6 text-center"
                          >
                            <input
                              id="upload"
                              type="file"
                              className="hidden"
                              accept="image/png,image/jpg"
                              onChange={(e) =>
                                setSelectedFile(e.target.files![0])
                              }
                              {...field.onBlur}
                              {...field.ref}
                            />
                            <label htmlFor="upload" className="cursor-pointer">
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
                                    <b className="text-gray-600">JPG or PNG</b>{" "}
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
                            className="w-full"
                            onClick={async () => {
                              if (selectedFile) {
                                const { data, error } = await supabase.storage
                                  .from("Product Images")
                                  .upload(selectedFile.name, selectedFile);

                                if (data) {
                                  form.setValue("imageUrl", data.path);
                                }
                              }
                            }}
                          >
                            Upload
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
              )}
            />
            <div className="flex flex-col gap-5">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
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
            </div>

            <Button type="submit" className="lg:ml-auto lg:self-end">
              Submit
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateProductDialog;
