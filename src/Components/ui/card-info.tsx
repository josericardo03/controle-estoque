"use client";

import { cva, type VariantProps } from "class-variance-authority";

// Definindo as variações do card usando class-variance-authority
const cardVariants = cva(
  // Base styles
  "rounded-lg p-6 shadow-sm transition-all hover:shadow-md",
  {
    variants: {
      variant: {
        default: "bg-white border border-gray-200",
        blue: "bg-blue-50 border border-blue-200",
        green: "bg-green-50 border border-green-200",
        yellow: "bg-yellow-50 border border-yellow-200",
        red: "bg-red-50 border border-red-200",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

// Props do componente
interface CardInfoProps extends VariantProps<typeof cardVariants> {
  title: string;
  value: string | number;
  description?: string;
  icon?: React.ReactNode;
  trend?: {
    value: number;
    isUpward: boolean;
  };
  className?: string;
  formatter?: (value: string | number) => string;
}

export function CardInfo({
  title,
  value,
  description,
  icon,
  trend,
  variant,
  className,
  formatter = (val) => String(val),
}: CardInfoProps) {
  return (
    <div className={cardVariants({ variant, className })}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <h3 className="mt-2 text-2xl font-semibold text-gray-900">
            {formatter(value)}
          </h3>
          {description && (
            <p className="mt-1 text-sm text-gray-500">{description}</p>
          )}
          {trend && (
            <p
              className={`mt-2 text-sm font-medium ${
                trend.isUpward
                  ? "text-green-600"
                  : trend.value === 0
                  ? "text-gray-600"
                  : "text-red-600"
              }`}
            >
              <span className="inline-flex items-center">
                {trend.isUpward ? (
                  <svg
                    className="mr-1 h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                    />
                  </svg>
                ) : trend.value === 0 ? (
                  <svg
                    className="mr-1 h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M20 12H4"
                    />
                  </svg>
                ) : (
                  <svg
                    className="mr-1 h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"
                    />
                  </svg>
                )}
                {trend.value}%{" "}
                {trend.isUpward
                  ? "aumento"
                  : trend.value === 0
                  ? "manteve"
                  : "diminuição"}
              </span>
            </p>
          )}
        </div>
        {icon && (
          <div
            className={`rounded-full p-3 ${
              variant === "blue"
                ? "bg-blue-100 text-blue-600"
                : variant === "green"
                ? "bg-green-100 text-green-600"
                : variant === "yellow"
                ? "bg-yellow-100 text-yellow-600"
                : variant === "red"
                ? "bg-red-100 text-red-600"
                : "bg-gray-100 text-gray-600"
            }`}
          >
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}
