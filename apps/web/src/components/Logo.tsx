"use client";

import React from "react";
import Image from "next/image";

type LogoVariant = "primary" | "secondary" | "mono";

type LogoProps = {
  variant?: LogoVariant;
  withWordmark?: boolean;
  className?: string;
};

const Logo: React.FC<LogoProps> = ({
  variant = "primary",
  withWordmark = true,
  className = "",
}) => {
  const logoPath = `/logo/logo-clock-${variant}.svg`;

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="relative w-8 h-8 flex-shrink-0">
        <Image
          src={logoPath}
          alt="Catered By Me logo"
          width={32}
          height={32}
          className="w-full h-full"
        />
      </div>
      {withWordmark && (
        <span className="text-xl font-bold text-ink whitespace-nowrap">
          Catered By Me
        </span>
      )}
    </div>
  );
};

export default Logo;

