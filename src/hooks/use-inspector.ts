"use client";

import { getAbiFunctions } from "@/lib/abi";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { AbiFunction, isAddress } from "viem";
import { z } from "zod";

export const useInspector = () => {
  const [writeFunction, setWriteFunction] = useState<AbiFunction[]>([]);
  const [readFunction, setReadFunction] = useState<AbiFunction[]>([]);

  const schema = z.object({
    ca: z.custom<`0x${string}`>(
      (addr): addr is `0x${string}` => {
        return typeof addr === "string" && isAddress(addr);
      },
      {
        message: "Invalid contract address",
      },
    ),
    abi: z.string().refine(
      (str) => {
        try {
          JSON.parse(str);
          return true;
        } catch {
          return false;
        }
      },
      {
        message: "Invalid JSON abi",
      },
    ),
  });

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      ca: "" as `0x${string}`,
      abi: "",
    },
  });

  const onSubmit = (data: z.infer<typeof schema>) => {
    try {
      const { writeFunction, readFunction } = getAbiFunctions(data.abi);
      setWriteFunction(writeFunction);
      setReadFunction(readFunction);
    } catch (error) {
      console.error(error);
      toast.error("Parse abi failed");
    }
  };

  return {
    form,
    schema,
    onSubmit,
    ca: form.watch("ca"),
    writeFunction,
    readFunction,
  };
};
