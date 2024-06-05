"use client";
import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { ScrollArea } from "../ui/scroll-area";
import { useRouter } from "next/navigation";
import { formdata } from "@/components/constants/service-provider-form-data";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "../ui/textarea";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "../ui/calendar";
import { uploadImage } from "@/lib/upload-img";
import { format } from "date-fns";
import axios from "@/lib/axios";
import MultiSelect from "../ui/multi-select";

const dynamicFormSchema = z.object(
  formdata.reduce(
    (acc: any, field: any) => {
      if (field.tag === "date") {
        acc[field.name] = field.required
          ? z.date({
              required_error: "A date of birth is required.",
            })
          : z.any();
      } else if (field.tag === "tags") {
        acc[field.name] = field.required
          ? z.string().min(2, {
              message: `${field.title} must be at least 2 characters.`,
            })
          : z.string();
      } else if (field.tag === "checkbox") {
        acc[field.name] = field.required
          ? z.boolean().refine((val) => val === true, {
              message: `${field.title} is required.`,
            })
          : z.boolean();
      } else if (field.tag === "select") {
        acc[field.name] = field.required
          ? z.array(z.string()).nonempty({
              message: `${field.title} is required.`,
            })
          : z.any();
      } else if (field.tag === "number") {
        acc[field.name] = field.required
          ? z.number().min(1, {
              message: `${field.title} must be at least 1.`,
            })
          : z.number();
      } else {
        // Handle text and other input types as strings
        acc[field.name] = field.required
          ? z.string().min(2, {
              message: `${field.title} must be at least 2 characters.`,
            })
          : z.string();
      }
      return acc;
    },
    {} as Record<string, z.ZodTypeAny>
  )
);

const CreateFormSubmit = ({ status, response }: any) => {
  const form = useForm<z.infer<typeof dynamicFormSchema>>({
    resolver: zodResolver(dynamicFormSchema),
    defaultValues: status
      ? {
          full_name: response.full_name,
          mobile_number: response.mobile_number,
          email: response.email,
          residential_address: response.residential_address,
          date_of_birth: response.date_of_birth,
          qualifications: response.qualifications,
          skills_and_expertise: response.skills_and_expertise,
          experience_in_years: +response.experience_in_years as number,
          licence_and_certificates: response.licence_and_certificates[0],
          work_location: response.work_location,
          latitude: +response.latitude as number,
          longitude: +response.longitude as number,
          job_type: [response.job_type],
          hourly_salary: +response.hourly_salary as number,
          identification_proof: response.identification_proof,
          addressproof: response.addressproof,
          pan_proof: response.pan_proof,
          profilePic: response.profilePic,
        }
      : Object.fromEntries(formdata.map((field: any) => [field.name, ""])),
  });

  const router = useRouter();
  async function onSubmit(values: z.infer<typeof dynamicFormSchema>) {
    try {
      console.log(values, "value");

      if (status === "update") {
        values["job_type"] = values.job_type[0];
        values["licence_and_certificates"] = [values.licence_and_certificates];
        const response1 = await axios.patch(
          `/admin/service_provider/${response.sp_uid}`,
          {
            ...values,
          }
        );

        if (
          response1.data.message === "Service Provider Updated Successfully"
        ) {
          toast.success("Service Provider updated successfully");
          router.push("/dashboard/service-provider");
        } else {
          toast.error(
            response1.data.message
              ? response.data.message
              : "Failed to update Service Provider"
          );
        }
      } else {
        values["job_type"] = values.job_type[0];
        values["licence_and_certificates"] = [values.licence_and_certificates];
        const response = await axios.post("/admin/service_provider", {
          ...values,
        });

        if (response.data.message === "Service Provider Created Successfully") {
          toast.success("Service Provider added successfully");
          router.push("/dashboard/service-provider");
        } else {
          toast.error(
            response.data.message
              ? response.data.message
              : "Failed to Service Provider"
          );
        }
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  }

  return (
    <div>
      <div className="">
        <h1 className="py-2">Add Story With Ads</h1>
        <ScrollArea className="h-[100vh]">
          <div className="px-8 pb-96 pt-4">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8 grid grid-cols-4 gap-3"
              >
                {formdata?.map((item: any, index: any) => (
                  <div key={index} className="text-base">
                    {item.tag === "text" ? (
                      <FormField
                        key={item.name}
                        control={form.control}
                        name={item.name}
                        render={({ field }: any) => (
                          <FormItem>
                            <FormLabel>{item.title}</FormLabel>

                            <FormControl>
                              <Input
                                placeholder={`Enter ${item.title}`}
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    ) : item.tag === "number" ? (
                      <FormField
                        key={item.name}
                        control={form.control}
                        name={item.name}
                        render={({ field }: any) => (
                          <FormItem>
                            <FormLabel>{item.title}</FormLabel>

                            <FormControl>
                              <Input
                                className="w-full"
                                type="number"
                                onChange={(e) => {
                                  field.onChange(+e.target.value as number);
                                }}
                                placeholder={`Enter ${item.title}`}
                                // {...field}
                                value={field.value}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    ) : item.tag === "price" ? (
                      <div className="flex items-center gap-4">
                        <FormField
                          control={form.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Currency</FormLabel>
                              <FormDescription>
                                {item.description}
                              </FormDescription>
                              <Select>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select a currencies" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <ScrollArea className="max-h-60">
                                    <SelectItem value="USD">
                                      United States Dollar - USD - $
                                    </SelectItem>
                                  </ScrollArea>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          key={item.name}
                          control={form.control}
                          name={item.name}
                          render={({ field }: any) => (
                            <FormItem>
                              <FormLabel>{item.title}</FormLabel>
                              <FormDescription>
                                {item.description}
                              </FormDescription>
                              <FormControl>
                                <Input
                                  className="w-full"
                                  type="number"
                                  placeholder={`Enter ${item.title}`}
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    ) : item.tag === "checkbox" ? (
                      <FormField
                        key={item.name}
                        control={form.control}
                        name={item.name}
                        render={({ field }: any) => (
                          <FormItem>
                            <FormLabel>{item.title}</FormLabel>

                            <FormControl>
                              <Input
                                className="w-4 h-4"
                                type="checkbox"
                                placeholder={`Enter ${item.title}`}
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    ) : item.tag === "date" ? (
                      <FormField
                        control={form.control}
                        name={item.name}
                        render={({ field }) => (
                          <FormItem className="flex flex-col">
                            <FormLabel>{item.title}</FormLabel>
                            <Popover>
                              <PopoverTrigger asChild>
                                <FormControl>
                                  <Button
                                    variant={"outline"}
                                    className={cn(
                                      "w-[240px] pl-3 text-left font-normal",
                                      !field.value && "text-muted-foreground"
                                    )}
                                  >
                                    {field.value ? (
                                      status === "update" ? (
                                        <span>{field.value}</span>
                                      ) : (
                                        format(field.value, "PPP")
                                      )
                                    ) : (
                                      <span>Pick a date</span>
                                    )}
                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                  </Button>
                                </FormControl>
                              </PopoverTrigger>
                              <PopoverContent
                                className="w-auto p-0"
                                align="start"
                              >
                                <Calendar
                                  defaultMonth={new Date()}
                                  mode="single"
                                  selected={field.value}
                                  onSelect={field.onChange}
                                  disabled={(date: any) =>
                                    date > new Date() ||
                                    date < new Date("1900-01-01")
                                  }
                                  initialFocus
                                />
                              </PopoverContent>
                            </Popover>

                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    ) : item.tag === "file" ? (
                      <FormField
                        key={item.name}
                        control={form.control}
                        name={item.name}
                        render={({ field }: any) => (
                          <FormItem>
                            <FormLabel>{item.title}</FormLabel>

                            <FormControl>
                              <Input
                                onChange={async (e: any) => {
                                  console.log("working", e.target.files[0]);
                                  const imageUrl: any = await uploadImage(
                                    e.target.files[0]
                                  );
                                  field.onChange(imageUrl);
                                }}
                                type="file"
                                placeholder={`Enter ${item.title}`}
                              />
                            </FormControl>
                            {field.value && (
                              <img
                                src={field.value}
                                className="rounded-3xl w-[400px] border h-[300px] object-cover shadow-lg mt-6"
                                alt=""
                              />
                            )}
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    ) : item.tag === "tags" ? (
                      <FormField
                        key={item.name}
                        control={form.control}
                        name={item.name}
                        render={({ field }: any) => (
                          <FormItem>
                            <FormLabel>{item.title}</FormLabel>

                            <FormControl>
                              <Input
                                placeholder={`Enter ${item.title}`}
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    ) : item.tag === "textarea" ? (
                      <FormField
                        key={item.name}
                        control={form.control}
                        name={item.name}
                        render={({ field }: any) => (
                          <FormItem>
                            <FormLabel>{item.title}</FormLabel>

                            <FormControl>
                              <Textarea
                                rows={6}
                                className="w-full"
                                placeholder={`Enter ${item.title}`}
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    ) : item.tag === "select" ? (
                      <FormField
                        control={form.control}
                        name={item.name}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{item.title}</FormLabel>

                            <MultiSelect
                              status={status}
                              field={field}
                              name={item.name}
                              options={item.options}
                            />
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    ) : item.tag === "title" ? (
                      <div className="">
                        <h1 className="text-base font-bold">{item.title}</h1>
                      </div>
                    ) : (
                      <FormField
                        key={item.name}
                        control={form.control}
                        name={item.name}
                        render={({ field }: any) => (
                          <FormItem>
                            <FormLabel>{item.title}</FormLabel>

                            <FormControl>
                              <Textarea
                                rows={6}
                                className="w-full"
                                placeholder={`Enter ${item.title}`}
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}
                  </div>
                ))}

                <Button className="" type="submit">
                  Submit
                </Button>
              </form>
            </Form>
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};

export default CreateFormSubmit;
