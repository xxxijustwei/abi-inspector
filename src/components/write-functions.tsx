"use client";

import { FunctionForm } from "@/components/function-form";
import { toast } from "@/lib/toast";
import { useTranslations } from "next-intl";
import { useCallback, useMemo, useState } from "react";
import {
  AbiFunction,
  BaseError,
  ContractFunctionRevertedError,
  TransactionReceipt,
  stringify,
} from "viem";
import { useAccount, usePublicClient, useWalletClient } from "wagmi";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";

interface WriteFunctionsProps {
  ca: `0x${string}`;
  abiFunctions: AbiFunction[];
}

export const WriteFunctions = ({ ca, abiFunctions }: WriteFunctionsProps) => {
  const t = useTranslations("page");
  if (abiFunctions.length === 0) {
    return (
      <div className="text-sm text-muted-foreground">
        {t("no_write_functions")}
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
  const { address } = useAccount();
  const publicClient = usePublicClient();
  const { data: walletClient } = useWalletClient();
  const { name, inputs, outputs } = abiFunction;
  const [txReceipt, setTxReceipt] = useState<TransactionReceipt | null>(null);

  const signature = useMemo(() => {
    return `${name}(${inputs
      .map((input) => input.type)
      .join(",")}) -> (${outputs.map((output) => output.type).join(",")})`;
  }, [name, inputs, outputs]);

  const onSubmit = useCallback(
    async (data: Record<string, unknown>) => {
      if (!publicClient || !walletClient) return;
      try {
        const { request } = await publicClient.simulateContract({
          account: address,
          address: ca,
          abi: [abiFunction],
          functionName: abiFunction.name,
          args: Object.values(data),
        });

        const txHash = await walletClient.writeContract(request);
        const receipt = await publicClient.waitForTransactionReceipt({
          hash: txHash,
        });
        setTxReceipt(receipt);
      } catch (error) {
        if (error instanceof BaseError) {
          const revertError = error.walk(
            (err) => err instanceof ContractFunctionRevertedError,
          );
          if (
            revertError instanceof ContractFunctionRevertedError &&
            revertError.data?.errorName
          ) {
            toast.error(`Reverted: ${revertError.data.errorName}`);
          } else {
            toast.error(error.shortMessage);
          }
          console.error(error.cause);
          return;
        }
        console.error(error);
      }
    },
    [publicClient, walletClient, address, ca, abiFunction],
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
        {txReceipt && (
          <div>
            <span>{t("transaction_receipt")}:</span>
            <div className="mt-2 p-2 max-h-60 bg-accent text-accent-foreground rounded-md whitespace-pre overflow-auto">
              {stringify(txReceipt, null, 2)}
            </div>
          </div>
        )}
      </AccordionContent>
    </AccordionItem>
  );
};
