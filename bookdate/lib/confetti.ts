import confetti from "canvas-confetti";

export function fireConfetti(intensity = 1): void {
  const count = Math.floor(120 * intensity);
  confetti({
    particleCount: count,
    spread: 80,
    origin: { y: 0.6 },
    colors: ["#ff6b9d", "#ff1744", "#ffc0cb", "#ffffff", "#ff4081"],
  });
  setTimeout(() => {
    confetti({
      particleCount: Math.floor(60 * intensity),
      angle: 60,
      spread: 55,
      origin: { x: 0 },
      colors: ["#ff6b9d", "#ff1744", "#ffc0cb"],
    });
    confetti({
      particleCount: Math.floor(60 * intensity),
      angle: 120,
      spread: 55,
      origin: { x: 1 },
      colors: ["#ff6b9d", "#ff1744", "#ffc0cb"],
    });
  }, 200);
}

export function fireHeartBurst(): void {
  const scalar = 2;
  const heart = confetti.shapeFromText({ text: "💖", scalar });
  confetti({
    shapes: [heart],
    scalar,
    particleCount: 25,
    spread: 100,
    origin: { y: 0.5 },
    ticks: 200,
  });
}
