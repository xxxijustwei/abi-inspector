export interface FieldProps<T> {
  value: T;
  onChange: (...event: unknown[]) => void;
  onBlur: () => void;
  name: string;
  ref: (instance: HTMLInputElement | null) => void;
}
