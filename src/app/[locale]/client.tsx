"use client";

import { LanguageToggle } from "@/components/language-toggle";
import { ModeToggle } from "@/components/mode-toggle";
import { ReadFunctions } from "@/components/read-functions";
import { AuroraText } from "@/components/ui/aurora-text";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea, TextareaContainer } from "@/components/ui/textarea";
import { WriteFunctions } from "@/components/write-functions";
import { useInspector } from "@/hooks/use-inspector";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useTranslations } from "next-intl";
import { parseAsString, useQueryState } from "nuqs";

export const Client = () => {
  const t = useTranslations("page");
  const [tab, setTab] = useQueryState("tab", parseAsString.withDefault("read"));
  const { form, onSubmit, ca, readFunction, writeFunction } = useInspector();

  return (
    <div className="w-full h-full min-h-dvh p-2 flex flex-col">
      <div className="w-full h-full flex flex-1 flex-col bg-[#fafafa] dark:bg-[#262626] rounded-2xl relative">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-4 p-2 sm:p-4">
          <span className="text-2xl font-bold">
            Abi <AuroraText>Inspector</AuroraText>
          </span>
          <div className="w-full sm:w-fit flex items-center justify-between gap-1">
            <div className="space-x-1">
              <LanguageToggle />
              <ModeToggle />
            </div>
            <ConnectButton showBalance={false} />
          </div>
        </div>

        <div className="relative w-full h-full min-w-0 flex flex-1 flex-col items-stretch md:flex-row gap-6 p-4 pt-2">
          <div className="w-full md:flex-1 md:min-w-0">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex flex-col gap-4"
              >
                <FormField
                  control={form.control}
                  name="ca"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("contract_address")}</FormLabel>
                      <FormControl>
                        <Input
                          id="contract-address"
                          variant="bordered"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="abi"
                  render={({ field }) => (
                    <FormItem className="flex flex-col gap-2 h-full">
                      <FormLabel>{t("json_abi")}</FormLabel>
                      <FormControl>
                        <TextareaContainer {...field}>
                          <Textarea minRows={10} maxRows={20} />
                        </TextareaContainer>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" size="lg">
                  {t("submit")}
                </Button>
              </form>
            </Form>
          </div>
          <div className="w-full md:w-px h-px md:h-auto bg-gray-300 mx-0 md:mx-4" />
          <div className="w-full md:flex-1 md:min-w-0">
            <Tabs defaultValue={tab} onValueChange={setTab}>
              <TabsList>
                <TabsTrigger value="read">{t("read")}</TabsTrigger>
                <TabsTrigger value="write">{t("write")}</TabsTrigger>
              </TabsList>
              <TabsContent value="read">
                <ReadFunctions ca={ca} abiFunctions={readFunction} />
              </TabsContent>
              <TabsContent value="write" className="flex-1">
                <WriteFunctions ca={ca} abiFunctions={writeFunction} />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};
