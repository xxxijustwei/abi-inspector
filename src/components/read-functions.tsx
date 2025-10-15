"use client";

import { FunctionForm } from "@/components/function-form";
import { toast } from "@/lib/toast";
import { useTranslations } from "next-intl";
import { useCallback, useMemo, useState } from "react";
import { AbiFunction, BaseError, ContractFunctionRevertedError } from "viem";
import { usePublicClient } from "wagmi";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";

interface ReadFunctionsProps {
  ca: `0x${string}`;
  abiFunctions: AbiFunction[];
}

export const ReadFunctions = ({ ca, abiFunctions }: ReadFunctionsProps) => {
  const t = useTranslations("page");
  if (abiFunctions.length === 0) {
    return (
      <div className="text-sm text-muted-foreground">
        {t("no_read_functions")}
      </div>
    );
  }
  return (
    <Accordion type="multiple" variant="solid">
      {abiFunctions.map((abiFunction) => (
        <FunctionItem
          key={abiFunction.name}
          ca={ca}
          abiFunction={abiFunction}
        />
      ))}
    </Accordion>
  );
};

const FunctionItem = ({
  ca,
  abiFunction,
}: {
  ca: `0x${string}`;
  abiFunction: AbiFunction;
}) => {
  const t = useTranslations("page");
  const publicClient = usePublicClient();
  const { name, inputs, outputs } = abiFunction;
  const [result, setResult] = useState<string | null>(null);

  const signature = useMemo(() => {
    return `${name}(${inputs
      .map((input) => input.type)
      .join(",")}) -> (${outputs.map((output) => output.type).join(",")})`;
  }, [name, inputs, outputs]);

  const onSubmit = useCallback(
    async (data: Record<string, unknown>) => {
      if (!publicClient) return;
      try {
        const result = await publicClient.readContract({
          address: ca,
          abi: [abiFunction],
          functionName: abiFunction.name,
          args: Object.values(data),
        });
        setResult(String(result));
      } catch (error) {
        if (error instanceof BaseError) {
          const revertError = error.walk(
            (err) => err instanceof ContractFunctionRevertedError,
          );
          if (revertError instanceof ContractFunctionRevertedError) {
            const errorName = revertError.data?.errorName ?? "";
            toast.error(`Reverted: ${errorName}`);
          } else {
            toast.error(error.shortMessage);
          }
        }
        console.error(error);
      }
    },
    [publicClient, ca, abiFunction],
  );

  return (
    <AccordionItem value={signature}>
      <AccordionTrigger>{signature}</AccordionTrigger>
      <AccordionContent>
        <FunctionForm
          abiFunction={abiFunction}
          submitLabel="Call"
          onSubmit={onSubmit}
        />
        {result && (
          <div>
            <span>{t("result")}:</span>
            <div className="mt-2 p-2 bg-accent text-accent-foreground rounded-md">
              {result}
            </div>
          </div>
        )}
      </AccordionContent>
    </AccordionItem>
  );
};
