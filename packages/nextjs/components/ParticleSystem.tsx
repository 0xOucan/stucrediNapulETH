"use client";

import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  opacity: number;
  color: string;
  life: number;
  maxLife: number;
}

const ParticleSystem = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationRef = useRef<number | null>(null);

  const colors = ["#ff00ff", "#00ffff", "#8b00ff", "#0080ff", "#ff4500"];

  const createParticle = (): Particle => {
    const width = typeof window !== "undefined" ? window.innerWidth : 1920;
    const height = typeof window !== "undefined" ? window.innerHeight : 1080;

    return {
      x: Math.random() * width,
      y: height + 10,
      size: Math.random() * 3 + 1,
      speedX: (Math.random() - 0.5) * 2,
      speedY: -(Math.random() * 3 + 1),
      opacity: Math.random() * 0.8 + 0.2,
      color: colors[Math.floor(Math.random() * colors.length)],
      life: 0,
      maxLife: Math.random() * 300 + 200,
    };
  };

  const updateParticle = (particle: Particle): boolean => {
    particle.x += particle.speedX;
    particle.y += particle.speedY;
    particle.life++;

    // Fade out as particle ages
    particle.opacity = Math.max(0, 1 - particle.life / particle.maxLife);

    // Remove particle if it's dead or off screen
    return particle.life < particle.maxLife && particle.y > -10;
  };

  const drawParticle = (ctx: CanvasRenderingContext2D, particle: Particle) => {
    ctx.save();
    ctx.globalAlpha = particle.opacity;
    ctx.fillStyle = particle.color;
    ctx.shadowColor = particle.color;
    ctx.shadowBlur = 10;

    ctx.beginPath();
    ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  };

  const animate = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Add new particles occasionally
    if (Math.random() < 0.3) {
      particlesRef.current.push(createParticle());
    }

    // Update and draw particles
    particlesRef.current = particlesRef.current.filter(particle => {
      const isAlive = updateParticle(particle);
      if (isAlive) {
        drawParticle(ctx, particle);
      }
      return isAlive;
    });

    // Keep particle count reasonable
    if (particlesRef.current.length > 50) {
      particlesRef.current = particlesRef.current.slice(-50);
    }

    animationRef.current = requestAnimationFrame(animate);
  };

  const resizeCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  };

  useEffect(() => {
    if (typeof window === "undefined") return;

    resizeCanvas();
    animate();

    const handleResize = () => {
      resizeCanvas();
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full pointer-events-none z-0"
      style={{
        background: "transparent",
        mixBlendMode: "screen",
      }}
    />
  );
};

export default ParticleSystem;
