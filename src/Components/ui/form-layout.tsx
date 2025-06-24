"use client";

import * as React from "react";
import { Button, type ButtonProps } from "./button";

interface FormLayoutProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  onSubmit: (e: React.FormEvent) => void;
  onCancel?: () => void;
  isSubmitting?: boolean;
  submitText?: string;
  cancelText?: string;
  showCancelButton?: boolean;
  showDivider?: boolean;
  className?: string;
  actions?: React.ReactNode;
}

export function FormLayout({
  title,
  description,
  children,
  onSubmit,
  onCancel,
  isSubmitting = false,
  submitText = "Salvar",
  cancelText = "Cancelar",
  showCancelButton = true,
  showDivider = true,
  className = "",
  actions,
}: FormLayoutProps) {
  return (
    <div className={`space-y-3 sm:space-y-6 pb-2 sm:pb-4 ${className}`}>
      {/* Cabeçalho */}
      <div className="flex-shrink-0">
        <h2 className="text-lg sm:text-2xl font-semibold text-gray-900">
          {title}
        </h2>
        {description && (
          <p className="mt-1 text-sm text-gray-600">{description}</p>
        )}
      </div>

      {/* Divisor */}
      {showDivider && <div className="h-px bg-gray-200 flex-shrink-0" />}

      {/* Formulário */}
      <form onSubmit={onSubmit} className="space-y-3 sm:space-y-6">
        {/* Campos do formulário */}
        <div className="space-y-3 sm:space-y-6">{children}</div>

        {/* Divisor antes dos botões */}
        {showDivider && <div className="h-px bg-gray-200 flex-shrink-0" />}

        {/* Botões de ação */}
        <div className="flex flex-col sm:flex-row items-center justify-end gap-3 flex-shrink-0">
          {/* Botões customizados */}
          {actions}

          {/* Botões padrão */}
          {!actions && (
            <>
              {showCancelButton && onCancel && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={onCancel}
                  disabled={isSubmitting}
                  className="w-full sm:w-auto"
                >
                  {cancelText}
                </Button>
              )}
              <Button
                type="submit"
                loading={isSubmitting}
                className="w-full sm:w-auto"
              >
                {submitText}
              </Button>
            </>
          )}
        </div>
      </form>
    </div>
  );
}

// Componente para agrupar campos do formulário
interface FormSectionProps {
  title?: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

export function FormSection({
  title,
  description,
  children,
  className = "",
}: FormSectionProps) {
  return (
    <div className={`space-y-2 sm:space-y-4 ${className}`}>
      {/* Cabeçalho da seção */}
      {(title || description) && (
        <div>
          {title && (
            <h3 className="text-sm sm:text-lg font-medium text-gray-900">
              {title}
            </h3>
          )}
          {description && (
            <p className="mt-1 text-sm text-gray-600">{description}</p>
          )}
        </div>
      )}

      {/* Campos da seção */}
      <div className="grid grid-cols-1 gap-3 sm:gap-6 sm:grid-cols-2">
        {children}
      </div>
    </div>
  );
}

// Componente para campo do formulário
interface FormFieldProps {
  label?: string;
  error?: string;
  children: React.ReactNode;
  className?: string;
  fullWidth?: boolean;
}

export function FormField({
  label,
  error,
  children,
  className = "",
  fullWidth = false,
}: FormFieldProps) {
  return (
    <div
      className={`${
        fullWidth ? "col-span-1 sm:col-span-2" : ""
      } space-y-1.5 ${className}`}
    >
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      {children}
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}
