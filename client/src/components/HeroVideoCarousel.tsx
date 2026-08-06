import React, { useEffect, useState } from 'react';

const HERO_VIDEOS = [
  '/hero/hero-3.mp4',
  '/hero/hero-1.mp4',
  '/hero/hero-2.mp4',
  '/hero/hero-4.mp4',
];

const CYCLE_MS = 6500;

export const HeroVideoCarousel: React.FC = () => {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setActive((prev) => (prev + 1) % HERO_VIDEOS.length);
    }, CYCLE_MS);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="absolute inset-0 hidden h-full w-full overflow-hidden pointer-events-none md:block" aria-hidden="true">
      {HERO_VIDEOS.map((src, idx) => (
        <video
          key={src}
          src={src}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          className={`absolute inset-0 h-full w-full min-h-full min-w-full object-cover object-center transition-opacity duration-1000 ${idx === active ? 'opacity-100' : 'opacity-0'}`}
        />
      ))}
    </div>
  );
};
