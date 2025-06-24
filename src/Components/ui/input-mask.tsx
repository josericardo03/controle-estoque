// Indica que este é um componente do lado do cliente (client-side)
"use client";

// Importações necessárias
import React from "react";
import { useFormContext } from "react-hook-form"; // Para integração com formulários
import { cn } from "../../lib/utils"; // Função utilitária para combinar classes CSS

interface InputMaskProps extends React.InputHTMLAttributes<HTMLInputElement> {
  name: string;
  mask: "cpf" | "cnpj" | "telefone" | "cep";
}

const applyMask = (
  value: string,
  mask: "cpf" | "cnpj" | "telefone" | "cep"
): string => {
  // Remove tudo que não for número
  const numbers = value.replace(/\D/g, "");

  switch (mask) {
    case "cpf":
      return numbers
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d{1,2})/, "$1-$2")
        .slice(0, 14);

    case "cnpj":
      return numbers
        .replace(/(\d{2})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d)/, "$1/$2")
        .replace(/(\d{4})(\d{1,2})/, "$1-$2")
        .slice(0, 18);

    case "telefone":
      return numbers
        .replace(/(\d{2})(\d)/, "($1) $2")
        .replace(/(\d{5})(\d{4})/, "$1-$2")
        .slice(0, 15);

    case "cep":
      return numbers.replace(/(\d{5})(\d{3})/, "$1-$2").slice(0, 9);

    default:
      return numbers;
  }
};

export function InputMask({ name, mask, className, ...rest }: InputMaskProps) {
  const formContext = useFormContext();

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const maskedValue = applyMask(event.target.value, mask);

    if (formContext) {
      formContext.setValue(name, maskedValue, { shouldValidate: true });
    }
  };

  return (
    <input
      type="text"
      {...rest}
      name={name}
      value={formContext ? formContext.watch(name) || "" : rest.value || ""}
      onChange={(e) => {
        handleChange(e);
        rest.onChange?.(e);
      }}
      className={`w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 ${
        className || ""
      }`}
    />
  );
}
