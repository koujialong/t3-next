"use client";
import { api } from "@/trpc/react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { User } from "@prisma/client";
import { ConfigForm } from "@/components/form/config-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";

export default function Register() {
  const { t } = useTranslation();
  const regist = api.user.register.useMutation({
    onSuccess(e) {
      router.replace("/login");
    },
  });
  const router = useRouter();
  const register = async (val) => {
    regist.mutate({ ...val, role: 'common' } as User);
  };

  return (
    <div
      className="flex h-screen w-screen items-center justify-center bg-cover"
      style={{
        backgroundImage:
          "url(https://images.unsplash.com/photo-1451187580459-43490279c0fa?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80)",
      }}
    >
      <div className="w-[1000px] py-16">
        <div className="mx-auto flex max-w-sm overflow-hidden rounded-lg bg-white bg-opacity-10 shadow-md backdrop-blur-lg backdrop-filter">
          <div className="w-full p-8 dark:bg-opacity-30">
            <h2 className="mb-4 text-center text-2xl font-semibold text-white">
              {t("register")}
            </h2>
            <ConfigForm
              className="w-full"
              formItems={[
                {
                  key: "username",
                  type: "Input",
                  placeholder: `${t("please input")} ${t("username")}`,
                  rule: z
                    .string()
                    .min(1, `${t("please input")} ${t("username")}`),
                },
                {
                  key: "email",
                  type: "Input",
                  inputType: "email",
                  placeholder: `${t("please input")} ${t("email")}`,
                  rule: z.string().email(`${t("please input")} ${t("email")}`),
                },
                {
                  key: "password",
                  type: "Input",
                  inputType: "password",
                  placeholder: `${t("please input")} ${t("password")}`,
                  rule: z
                    .string()
                    .min(1, `${t("please input")} ${t("password")}`),
                },
              ]}
              onSubmit={register}
              footer={
                <Button type="submit" className="w-full">
                  {t("register")}
                </Button>
              }
            />
            <div className="mt-4 flex items-center justify-between">
              <span className="w-1/5 border-b md:w-1/4"></span>
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  router.push("/login");
                }}
                className="text-xs uppercase text-white"
              >
                {t("sign in")}
              </a>
              <span className="w-1/5 border-b md:w-1/4"></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
