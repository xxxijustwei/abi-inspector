import { Select, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "../ui/input";
import { FieldProps } from "./types";

export const BoolField = ({ value, onChange }: FieldProps<boolean>) => {
  return (
    <Select
      value={value ? "true" : "false"}
      onValueChange={(v) => onChange(v === "true")}
    >
      <SelectTrigger variant="bordered" size="sm">
        <SelectValue placeholder="Select" />
      </SelectTrigger>
    </Select>
  );
};

export const IntField = ({ value, onChange, ...rest }: FieldProps<string>) => {
  return (
    <Input
      variant="bordered"
      inputMode="numeric"
      placeholder="Enter value"
      value={value || ""}
      onChange={onChange}
      {...rest}
    />
  );
};

export const AddressField = ({
  value,
  onChange,
  ...rest
}: FieldProps<string>) => {
  return (
    <Input
      variant="bordered"
      placeholder="0x..."
      value={value || ""}
      onChange={onChange}
      {...rest}
    />
  );
};

export const StringField = ({
  value,
  onChange,
  ...rest
}: FieldProps<string>) => {
  return (
    <Input
      variant="bordered"
      placeholder="Enter value"
      value={value || ""}
      onChange={onChange}
      {...rest}
    />
  );
};
