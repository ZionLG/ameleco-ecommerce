import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

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

const formSchema = z.object({
  name: z.string().min(1),
});
const CreateCategoryDialog = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });
  const utils = api.useContext();
  const { mutate, isLoading } = api.shop.addCategory.useMutation({
    onSuccess: () => {
      void utils.shop.getCategories.invalidate();
      toast.success("Category added successfully.");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
  function onSubmit(values: z.infer<typeof formSchema>) {
    mutate({ name: values.name });
  }
  return (
    <Dialog>
      <DialogTrigger>
        <span
          className={`${cn(
            buttonVariants({ size: "lg", variant: "outline" }),
          )} `}
        >
          Add Category
        </span>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Category Creation</DialogTitle>
          <DialogDescription>
            This will add a new Category to the store.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 ">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormDescription>This is the category name.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              disabled={isLoading}
              type="submit"
              className="lg:ml-auto lg:self-end"
            >
              Submit
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateCategoryDialog;
