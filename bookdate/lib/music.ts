export function playBackgroundMusic() {
  const audio = document.getElementById("bg-music") as HTMLAudioElement | null;
  if (!audio) return;
  audio.volume = 0.45;
  void audio.play().catch(() => {});
}
