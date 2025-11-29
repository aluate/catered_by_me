"use client";

import React from "react";

type ButtonVariant = "primary" | "secondary" | "tertiary";

type ButtonProps = {
  variant?: ButtonVariant;
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  className?: string;
};

const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  size = "md",
  children,
  onClick,
  type = "button",
  disabled = false,
  className = "",
}) => {
  const sizeClasses = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3",
    lg: "px-8 py-4 text-lg",
  };
  
  const baseClasses = `${sizeClasses[size]} rounded-xl font-medium transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed`;
  
  const variantClasses = {
    primary: "bg-accent-primary text-white hover:bg-[#2d6348] hover:shadow-md hover:-translate-y-0.5",
    secondary: "border-2 border-accent-secondary text-ink hover:bg-accent-secondary hover:text-white hover:shadow-md hover:-translate-y-0.5",
    tertiary: "text-accent-primary hover:text-[#2d6348] hover:underline",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;

