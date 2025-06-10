// Indica que este é um componente do lado do cliente (client-side)
"use client";

// Importações necessárias
import * as React from "react";
import { useFormContext } from "react-hook-form"; // Para integração com formulários
import { cn } from "../../lib/utils"; // Função utilitária para combinar classes CSS

interface InputMaskProps {
  name: string;
  label?: string;
  placeholder?: string;
  className?: string;
  mask: "cpf" | "telefone" | "cep";
  width?: "sm" | "md" | "lg" | "full"; // Novo prop para controlar largura
}

export function InputMask({
  name,
  label,
  placeholder,
  className,
  mask,
  width = "full", // Valor padrão
}: InputMaskProps) {
  const {
    register,
    formState: { errors },
  } = useFormContext();
  const error = errors[name]?.message as string | undefined;

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
    const { value } = e.target;
    e.target.value = applyMask(value);
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
        {...register(name)}
        placeholder={placeholder}
        onChange={(e) => {
          handleChange(e);
          register(name).onChange(e);
        }}
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
