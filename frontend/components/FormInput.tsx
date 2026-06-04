import { ListingPayload } from "../lib/api";

type FormInputProps = {
  label: string;
  name: keyof ListingPayload;
  value: string | number;
  onChange: (name: keyof ListingPayload, value: string) => void;
  type?: string;
  placeholder?: string;
  required?: boolean;
  min?: string;
};

export function FormInput({
  label,
  name,
  value,
  onChange,
  type = "text",
  placeholder,
  required,
  min,
}: FormInputProps) {
  return (
    <label className="block text-sm font-medium text-slate-700">
      {label}
      <input
        className="mt-1.5 w-full rounded-md border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-blue-700 focus:ring-2 focus:ring-blue-100"
        min={min}
        name={name}
        onChange={(event) => onChange(name, event.target.value)}
        placeholder={placeholder}
        required={required}
        type={type}
        value={value}
      />
    </label>
  );
}
