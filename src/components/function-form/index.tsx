import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { getAbiFunctionInputSchema } from "@/lib/abi";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { AbiFunction } from "viem";
import { useAccount } from "wagmi";
import { z } from "zod";
import { Button } from "../ui/button";
import { AddressField, BoolField, IntField, StringField } from "./fields";
import { FieldProps } from "./types";

export interface FunctionFormProps {
  abiFunction: AbiFunction;
  submitLabel?: string;
  onSubmit?: (data: Record<string, unknown>) => Promise<void>;
}

export const FunctionForm = ({
  abiFunction,
  submitLabel = "Call",
  onSubmit,
}: FunctionFormProps) => {
  const { isConnected } = useAccount();
  const { inputs } = abiFunction;
  const schema = getAbiFunctionInputSchema(
    inputs.filter((input) => input.name),
  );

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
  });

  const handleSubmit = async (data: z.infer<typeof schema>) => {
    await onSubmit?.(data);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="flex flex-col gap-3"
      >
        {inputs.map((input, idx) => (
          <FormField
            key={`${input.name}-${idx}`}
            control={form.control}
            name={input.name || `arg${idx}`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>{`${input.name} (${input.type})`}</FormLabel>
                <FormControl>
                  {renderFieldByType(input.type, field)}
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        ))}
        <div className="flex justify-end">
          <Button
            type="submit"
            size="sm"
            disabled={!isConnected}
            loading={form.formState.isSubmitting}
          >
            {submitLabel}
          </Button>
        </div>
      </form>
    </Form>
  );
};

const fieldRenderers = {
  bool: (props: FieldProps<boolean>) => <BoolField {...props} />,
  int: (props: FieldProps<string>) => <IntField {...props} />,
  address: (props: FieldProps<string>) => <AddressField {...props} />,
  string: (props: FieldProps<string>) => <StringField {...props} />,
  bytes: (props: FieldProps<string>) => <StringField {...props} />,
  default: (props: FieldProps<string>) => <StringField {...props} />,
} as const;

const getFieldCategory = (type: string): keyof typeof fieldRenderers => {
  if (type === "bool") return "bool";
  if (/^u?int\d*$/.test(type)) return "int";
  if (type === "address") return "address";
  if (type === "string") return "string";
  if (/^bytes([1-9]|[12][0-9]|3[0-2])$/.test(type)) return "bytes";
  return "default";
};

const renderFieldByType = (type: string, field: FieldProps<unknown>) => {
  const category = getFieldCategory(type);
  const renderer = fieldRenderers[category];
  return renderer(field as never);
};
