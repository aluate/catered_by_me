"use client";

import React, { useEffect, useState } from "react";
import Button from "./ui/Button";

interface DemoSuccessProps {
  title?: string;
  message?: string;
  onClose: () => void;
}

export default function DemoSuccess({ title, message, onClose }: DemoSuccessProps) {
  const [showConfetti, setShowConfetti] = useState(true);

  useEffect(() => {
    // Trigger confetti effect
    if (showConfetti) {
      // Simple confetti using emojis and CSS animation
      const timer = setTimeout(() => setShowConfetti(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [showConfetti]);

  const triggerConfetti = () => {
    // Create confetti effect using canvas
    const canvas = document.createElement("canvas");
    canvas.style.position = "fixed";
    canvas.style.top = "0";
    canvas.style.left = "0";
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    canvas.style.pointerEvents = "none";
    canvas.style.zIndex = "9999";
    document.body.appendChild(canvas);

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const colors = ["#4F7C63", "#F4A87A", "#2C3E50", "#8B7355"];
    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      color: string;
      size: number;
    }> = [];

    // Create particles
    for (let i = 0; i < 50; i++) {
      particles.push({
        x: window.innerWidth / 2,
        y: window.innerHeight / 2,
        vx: (Math.random() - 0.5) * 10,
        vy: (Math.random() - 0.5) * 10 - 5,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: Math.random() * 5 + 3,
      });
    }

    let animationId: number;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      for (const particle of particles) {
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.vy += 0.2; // gravity

        ctx.fillStyle = particle.color;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();
      }

      if (particles.some((p) => p.y < window.innerHeight + 100)) {
        animationId = requestAnimationFrame(animate);
      } else {
        document.body.removeChild(canvas);
      }
    };

    animate();
  };

  useEffect(() => {
    triggerConfetti();
  }, []);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-xl p-8 shadow-lg max-w-md w-full border-2 border-accent-primary">
        <div className="text-center mb-6">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-2xl font-bold text-ink mb-2">
            {title || "Success!"}
          </h2>
          <p className="text-text-muted">
            {message || "You're seeing a demo of a Pro feature. This is what the upgrade flow will feel like!"}
          </p>
        </div>
        <div className="flex justify-center">
          <Button variant="primary" onClick={onClose}>
            Got it!
          </Button>
        </div>
      </div>
    </div>
  );
}

