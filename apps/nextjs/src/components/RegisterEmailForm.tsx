import { useState } from "react";
import {
  Input,
  Select,
  SelectItem,
  SelectSection,
  Textarea,
} from "@nextui-org/react";
import type {
  BusinessType,
  Occupation,
  PurchaseFrequency,
} from "@prisma/client";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import {
  Briefcase,
  Eye,
  EyeOff,
  Home,
  Info,
  Lock,
  Mail,
  PhoneCall,
  User,
} from "lucide-react";
import type { SubmitHandler } from "react-hook-form";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { api } from "~/utils/api";
import { Button } from "~/components/ui/button";

interface signUpEmail {
  email: string;
  password: string;
  firstName: string;
  companyName: string;
  lastName: string;
  phone: string;
  additionalInfo: string;
  occupation: Occupation;
  businessType: BusinessType;
  purchaseFrequency: PurchaseFrequency;
}
const RegisterEmailForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<signUpEmail>({
    defaultValues: {
      email: "",
      password: "",
      firstName: "",
      lastName: "",
      companyName: "",
      phone: "",
      additionalInfo: "",
    },
    mode: "onTouched",
  });
  const supabase = useSupabaseClient();
  const [isVisible, setIsVisible] = useState(false);
  const { mutate: createCart } = api.shop.createCart.useMutation();
  const toggleVisibility = () => setIsVisible(!isVisible);
  const onSubmit: SubmitHandler<signUpEmail> = async (data) => {
    console.log(data);
    const toastId = toast("Sonner");
    toast.loading("Loading...", {
      id: toastId,
    });

    const result = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: {
          phone: data.phone,
          company_name: data.companyName,
          first_name: data.firstName,
          last_name: data.lastName,
          additional_info: data.additionalInfo,
          occupation: data.occupation,
          business_type: data.businessType,
          purchase_frequency: data.purchaseFrequency,
        },
      },
    });
    if (result.error) {
      toast.error(`${result.error.message}`, {
        id: toastId,
      });
    } else {
      createCart();
      toast.success(
        `Confirm your email ${result.data.user?.email} to log in.`,
        {
          id: toastId,
        },
      );
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col  gap-7">
      <div className="flex flex-col gap-2 rounded-xl  bg-secondary p-4">
        <div className="flex items-center gap-2">
          <div className="rounded-lg bg-background p-3">
            <User size={24} className="text-blue-600" />
          </div>
          <Input
            isRequired
            {...register("firstName", {
              required: true,
              minLength: 2,
            })}
            label="First Name"
            variant="bordered"
            isClearable
            isInvalid={!!errors.firstName}
            errorMessage={!!errors.firstName && "First name is invalid"}
          />
          <Input
            isRequired
            {...register("lastName", {
              required: true,
              minLength: 2,
            })}
            label="Last Name"
            variant="bordered"
            isClearable
            isInvalid={!!errors.lastName}
            errorMessage={!!errors.lastName && "Last name is invalid"}
          />
        </div>
      </div>
      <div className="flex flex-col gap-2 rounded-xl  bg-secondary p-4">
        <div className="flex items-center gap-2">
          <div className="rounded-lg bg-background  p-3">
            <Mail size={24} className="text-blue-600 " />
          </div>
          <Input
            isRequired
            {...register("email", {
              required: true,
              pattern: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/i,
            })}
            label="Email"
            variant="bordered"
            isClearable
            isInvalid={!!errors.email}
            errorMessage={!!errors.email && "Email is Invalid"}
          />
        </div>
        <div className="flex items-center gap-2">
          <div className="rounded-lg bg-background p-3">
            <PhoneCall size={24} className="text-blue-600" />
          </div>
          <Input
            isRequired
            type={"tel"}
            {...register("phone", {
              required: true,
              pattern: /^\D*([2-9]\d{2})(\D*)([2-9]\d{2})(\D*)(\d{4})\D*$/,
            })}
            label="Phone Number"
            variant="bordered"
            isClearable
            isInvalid={!!errors.phone}
            errorMessage={!!errors.phone && "Phone number is invalid"}
          />
        </div>
      </div>

      <div className="flex flex-col gap-2 rounded-xl  bg-secondary p-4">
        <div className="flex items-center gap-2">
          <div className="rounded-lg bg-background p-3">
            <Briefcase size={24} className="text-blue-600 " />
          </div>

          <Select
            scrollShadowProps={{ isEnabled: false }}
            label="Occupation"
            {...register("occupation")}
            className=""
            isRequired
            variant="bordered"
          >
            <SelectItem key="HOME_OWNER">Home owner</SelectItem>
            <SelectItem key="HANDY_MAN">Handy man</SelectItem>
            <SelectItem key="RENOVATION_CONTRACTOR">
              Renovation contractor
            </SelectItem>
            <SelectItem key="BUILDER">Builder</SelectItem>
            <SelectItem key="GENERAL_CONTRACTOR">General contractor</SelectItem>
            <SelectItem key="ELECTRICIAN">Electrician</SelectItem>
            <SelectItem key="ELECTRICAL_CONTRACTOR">
              Electrical Contractor
            </SelectItem>
            <SelectItem key="OTHER">Other</SelectItem>
          </Select>
          <Select
            variant="bordered"
            label="Purchase Frequency"
            {...register("purchaseFrequency")}
            isRequired
          >
            <SelectItem key="PROJECT_BASED">Project demand</SelectItem>
            <SelectItem key="DAILY">Daily</SelectItem>
            <SelectItem key="WEEKLY">Weeky</SelectItem>
            <SelectItem key="BIWEEKLY">Bi-weekly</SelectItem>
            <SelectItem key="MONTHLY">Monthly</SelectItem>
            <SelectItem key="RARELY">Rarely</SelectItem>
          </Select>
        </div>
      </div>
      <div className="flex flex-col gap-2 rounded-xl  bg-secondary p-4">
        <div className="flex items-center gap-2">
          <div className="rounded-lg bg-background p-3">
            <Home size={24} className="text-blue-600 " />
          </div>
          <Input
            {...register("companyName")}
            label="Company name"
            variant="bordered"
            isClearable
            isInvalid={!!errors.companyName}
            errorMessage={!!errors.companyName && "Company name is Invalid"}
          />
          <Select
            label="Business Type"
            {...register("businessType")}
            variant="bordered"
          >
            <SelectSection showDivider title="Residential">
              <SelectItem key="RESIDENTIAL_RENOVATION">Renovation</SelectItem>
              <SelectItem key="RESIDENTIAL_NEW_CONSTRUCTION">
                New Construction
              </SelectItem>
            </SelectSection>
            <SelectSection title="Commercial">
              <SelectItem key="COMMERCIAL_RENOVATION">Renovation</SelectItem>
              <SelectItem key="COMMERCIAL_NEW_CONSTRUCTION">
                New Construction
              </SelectItem>
            </SelectSection>
          </Select>
        </div>
      </div>

      <div className="flex w-full flex-col gap-1 rounded-xl bg-secondary p-4">
        <div className="flex items-center gap-2">
          <div className="rounded-lg bg-background  p-3">
            <Lock size={24} className="text-blue-600 " />
          </div>

          <Input
            isRequired
            {...register("password", {
              required: true,
              minLength: 6,
              maxLength: 72,
            })}
            endContent={
              <button
                className="focus:outline-none"
                type="button"
                onClick={toggleVisibility}
              >
                {isVisible ? (
                  <Eye className="pointer-events-none text-2xl text-default-400" />
                ) : (
                  <EyeOff className="pointer-events-none text-2xl text-default-400" />
                )}
              </button>
            }
            type={isVisible ? "text" : "password"}
            variant="bordered"
            label="Password"
            isInvalid={!!errors.password}
            errorMessage={!!errors.password && "Password is Invalid"}
          />
        </div>
      </div>

      <div className="flex flex-col gap-2 rounded-xl  bg-secondary p-4">
        <div className="flex items-center gap-2">
          <div className="rounded-lg bg-background p-3">
            <Info size={24} className="text-blue-600 " />
          </div>

          <Textarea
            label="Additional Information"
            {...register("additionalInfo")}
            variant="bordered"
          />
        </div>
      </div>
      <Button type="submit">Register</Button>
    </form>
  );
};

export default RegisterEmailForm;
