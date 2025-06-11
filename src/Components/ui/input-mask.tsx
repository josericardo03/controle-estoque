// Indica que este é um componente do lado do cliente (client-side)
"use client";

// Importações necessárias
import * as React from "react";
import { useFormContext } from "react-hook-form"; // Para integração com formulários
import { cn } from "../../lib/utils"; // Função utilitária para combinar classes CSS

type BaseInputProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "onChange"
>;

interface InputMaskProps extends BaseInputProps {
  name: string;
  label?: string;
  placeholder?: string;
  className?: string;
  mask: "cpf" | "cnpj" | "telefone" | "cep";
  width?: "sm" | "md" | "lg" | "full"; // Novo prop para controlar largura
  value?: string;
  onChange?: (value: string) => void;
}

export function InputMask({
  name,
  label,
  placeholder,
  className,
  mask,
  width = "full",
  value: controlledValue,
  onChange: controlledOnChange,
  ...props
}: InputMaskProps) {
  // Tenta obter o contexto do formulário, se disponível
  const formContext = useFormContext();
  const { register, formState } = formContext || {};
  const error = formState?.errors?.[name]?.message as string | undefined;

  // Estado local para quando não houver contexto de formulário
  const [uncontrolledValue, setUncontrolledValue] = React.useState("");
  const isControlled = controlledValue !== undefined;
  const finalValue = isControlled ? controlledValue : uncontrolledValue;

  const widthClasses = {
    sm: "w-32",
    md: "w-48",
    lg: "w-64",
    full: "w-full",
  };

  const applyMask = (value: string) => {
    if (!value) return "";

    // Remove tudo que não for número
    const numbers = value.replace(/\D/g, "");

    switch (mask) {
      case "cpf":
        return numbers
          .replace(/(\d{3})(\d)/, "$1.$2")
          .replace(/(\d{3})(\d)/, "$1.$2")
          .replace(/(\d{3})(\d{1,2})/, "$1-$2")
          .replace(/(-\d{2})\d+?$/, "$1");

      case "cnpj":
        return numbers
          .replace(/(\d{2})(\d)/, "$1.$2")
          .replace(/(\d{3})(\d)/, "$1.$2")
          .replace(/(\d{3})(\d)/, "$1/$2")
          .replace(/(\d{4})(\d{1,2})/, "$1-$2")
          .replace(/(-\d{2})\d+?$/, "$1");

      case "telefone":
        return numbers
          .replace(/(\d{2})(\d)/, "($1) $2")
          .replace(/(\d{5})(\d)/, "$1-$2")
          .replace(/(-\d{4})\d+?$/, "$1");

      case "cep":
        return numbers
          .replace(/(\d{5})(\d)/, "$1-$2")
          .replace(/(-\d{3})\d+?$/, "$1");

      default:
        return value;
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const maskedValue = applyMask(e.target.value);
    e.target.value = maskedValue;

    if (!formContext) {
      setUncontrolledValue(maskedValue);
      controlledOnChange?.(maskedValue);
    }
  };

  const inputProps = formContext
    ? {
        ...register(name, {
          onChange: (e) => {
            handleChange(e);
            register(name).onChange(e);
          },
        }),
      }
    : {
        name,
        value: finalValue,
        onChange: handleChange,
        ...props,
      };

  return (
    <div className="space-y-1">
      {/* Renderiza o label se existir */}
      {label && (
        <label htmlFor={name} className="text-sm font-medium text-blue-500">
          {label}
        </label>
      )}

      <input
        {...inputProps}
        placeholder={placeholder}
        className={cn(
          "flex h-9 rounded-md border border-blue-500/20 bg-transparent px-3 py-1",
          "text-sm text-blue-500 placeholder:text-blue-500/50",
          "focus:outline-none focus:ring-1 focus:ring-blue-500/50",
          "disabled:cursor-not-allowed disabled:opacity-50",
          widthClasses[width],
          error && "border-red-500 focus:ring-red-500/50",
          className
        )}
      />

      {/* Renderiza mensagem de erro se existir */}
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}
