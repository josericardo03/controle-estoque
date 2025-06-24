"use client";

import * as React from "react";
import { useFormContext, Controller } from "react-hook-form";
import type { MultiValue, SingleValue, StylesConfig } from "react-select";
import DefaultSelect from "react-select";
import { cn } from "../../lib/utils";

export type SelectOption = {
  label: string;
  value: string;
  color?: string;
};

interface SelectInputProps {
  name: string;
  options: SelectOption[];
  label?: string;
  placeholder?: string;
  className?: string;
  isMulti?: boolean;
  isSearchable?: boolean;
  isClearable?: boolean;
  error?: string;
  control?: any;
  value?: SelectOption | null;
  onChange?: (option: SelectOption | null) => void;
}

const customStyles: StylesConfig<SelectOption, boolean> = {
  control: (base: any, state: any) => ({
    ...base,
    backgroundColor: "transparent",
    borderColor: state.isFocused ? "#3b82f6" : "#3b82f620",
    boxShadow: state.isFocused ? "0 0 0 1px #3b82f6" : "none",
    "&:hover": {
      borderColor: "#3b82f6",
    },
    borderRadius: "0.375rem",
    padding: "1px",
  }),
  option: (base: any, state: any) => ({
    ...base,
    backgroundColor: state.isSelected
      ? "#3b82f6"
      : state.isFocused
      ? "#3b82f620"
      : "transparent",
    color: state.isSelected ? "white" : "#3b82f6",
    "&:hover": {
      backgroundColor: state.isSelected ? "#3b82f6" : "#3b82f620",
    },
  }),
  menu: (base: any) => ({
    ...base,
    backgroundColor: "#ffffff",
    borderRadius: "0.375rem",
    border: "1px solid #3b82f620",
    zIndex: 99999,
    position: "absolute",
    width: "100%",
    boxShadow:
      "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
  }),
  menuPortal: (base: any) => ({
    ...base,
    zIndex: 99999,
  }),
  menuList: (base: any) => ({
    ...base,
    maxHeight: "200px",
  }),
  multiValue: (base: any, { data }: any) => ({
    ...base,
    backgroundColor: data.color ? data.color + "20" : "#3b82f620",
    borderRadius: "0.375rem",
  }),
  multiValueLabel: (base: any, { data }: any) => ({
    ...base,
    color: data.color || "#3b82f6",
  }),
  multiValueRemove: (base: any, { data }: any) => ({
    ...base,
    color: data.color || "#3b82f6",
    "&:hover": {
      backgroundColor: data.color ? data.color + "40" : "#3b82f640",
      color: data.color || "#3b82f6",
    },
  }),
  input: (base: any) => ({
    ...base,
    color: "#3b82f6",
  }),
  singleValue: (base: any, { data }: any) => ({
    ...base,
    color: data.color || "#3b82f6",
  }),
  placeholder: (base: any) => ({
    ...base,
    color: "#3b82f680",
  }),
};

export function SelectInput({
  name,
  options,
  label,
  placeholder,
  className,
  isMulti = false,
  isSearchable = true,
  isClearable = true,
  error,
  control: controlProp,
  value,
  onChange,
}: SelectInputProps) {
  const formContext = useFormContext();
  const control = controlProp || formContext?.control;
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!control) {
    const Select = DefaultSelect as any;
    return (
      <div className="space-y-1">
        {label && (
          <label className="text-sm font-medium text-blue-500">{label}</label>
        )}
        <Select
          options={options}
          isMulti={isMulti}
          isSearchable={isSearchable}
          isClearable={isClearable}
          placeholder={placeholder}
          className={cn("text-sm", className)}
          styles={customStyles}
          instanceId={name}
          value={value}
          onChange={onChange}
          menuPortalTarget={mounted ? document.body : null}
          menuPosition="fixed"
          menuPlacement="auto"
        />
        {error && <p className="text-xs text-red-500">{error}</p>}
      </div>
    );
  }

  return (
    <div className="space-y-1">
      {label && (
        <label className="text-sm font-medium text-blue-500">{label}</label>
      )}

      <Controller
        name={name}
        control={control}
        render={({ field }) => {
          const Select = DefaultSelect as any;
          return (
            <Select
              {...field}
              options={options}
              isMulti={isMulti}
              isSearchable={isSearchable}
              isClearable={isClearable}
              placeholder={placeholder}
              className={cn("text-sm", className)}
              styles={customStyles}
              instanceId={name}
              menuPortalTarget={mounted ? document.body : null}
              menuPosition="fixed"
              menuPlacement="auto"
              value={
                isMulti
                  ? options.filter((option) =>
                      field.value?.includes(option.value)
                    )
                  : options.find((option) => option.value === field.value)
              }
              onChange={(val: any) => {
                if (isMulti) {
                  const selected = val as MultiValue<SelectOption>;
                  field.onChange(selected?.map((item) => item.value));
                } else {
                  const selected = val as SingleValue<SelectOption>;
                  field.onChange(selected?.value || null);
                }
              }}
            />
          );
        }}
      />

      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}
