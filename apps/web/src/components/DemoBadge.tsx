"use client";

import React from "react";
import { isDemoMode } from "../lib/demo";

export default function DemoBadge() {
  if (!isDemoMode()) return null;

  return (
    <div className="px-3 py-1 bg-amber-100 border border-amber-300 rounded-full text-xs font-medium text-amber-800">
      DEMO MODE
    </div>
  );
}

