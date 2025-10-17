import { AbiFunction, AbiParameter, AbiType } from "abitype";
import { Abi } from "abitype/zod";
import { isAddress } from "viem";
import { z } from "zod";

export const getAbiFunctions = (jsonAbi: string) => {
  const abi = Abi.parse(JSON.parse(jsonAbi));

  const writeFunction: AbiFunction[] = [];
  const readFunction: AbiFunction[] = [];

  for (const item of abi) {
    if (item.type !== "function") continue;

    if (["nonpayable", "payable"].includes(item.stateMutability)) {
      writeFunction.push(item);
    } else {
      readFunction.push(item);
    }
  }

  return {
    writeFunction,
    readFunction,
  };
};

export const getAbiFunctionInputSchema = (
  inputs: AbiParameter[] | readonly AbiParameter[],
) => {
  const shape = Object.fromEntries(
    inputs.map((item) => [item.name, abiTypeToZodSchema(item.type)]),
  ) as Record<string, z.ZodTypeAny>;
  return z.object(shape);
};

const abiTypeToZodSchema = (abiType: AbiType | string) => {
  if (abiType === "address") {
    return z.string("Required address").refine((addr) => isAddress(addr), {
      message: "Invalid address",
    });
  }

  if (abiType === "bool") {
    return z.boolean("Invalid boolean");
  }

  if (abiType === "string") {
    return z.string();
  }

  if (abiType.match(/^bytes([1-9]|[12][0-9]|3[0-2])$/)) {
    const size = Number.parseInt(abiType.slice(5));
    const hexLength = size * 2;

    return z.coerce
      .string("Required hex value")
      .regex(new RegExp(`^0x[0-9a-fA-F]{${hexLength}}$`), "Invalid hex value");
  }

  if (/^u?int\d*$/.test(abiType)) {
    return z.coerce.bigint("Invalid amount");
  }

  return z.unknown();
};
