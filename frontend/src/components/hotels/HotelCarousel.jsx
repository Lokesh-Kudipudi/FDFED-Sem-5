import React, { useEffect, useRef, useState } from "react";

export default function HotelCarousel({ items = [], itemGap = "gap-3" }) {
  const scrollerRef = useRef(null);
  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(true);

  const updateArrows = () => {
    const el = scrollerRef.current;
    if (!el) return;
    setCanLeft(el.scrollLeft > 0);
    setCanRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 2);
  };

  useEffect(() => {
    updateArrows();
    const el = scrollerRef.current;
    if (!el) return;
    const onScroll = () => updateArrows();
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, [items.length]);

  const scrollByCards = (dir = 1) => {
    const el = scrollerRef.current;
    if (!el) return;
    const card = el.querySelector(":scope > *");
    const step = card ? card.getBoundingClientRect().width + 16 : 320;
    el.scrollBy({ left: dir * step * 2, behavior: "smooth" });
  };

  return (
    <div className="relative w-full">
      {/* Left */}
      <button
        onClick={() => scrollByCards(-1)}
        disabled={!canLeft}
        className="hidden md:flex absolute left-[-18px] top-1/2 -translate-y-1/2 z-10 h-10 w-10 rounded-full bg-white shadow items-center justify-center disabled:opacity-40"
        aria-label="Previous"
      >
        ‹
      </button>

      {/* scroller */}
      <div
        ref={scrollerRef}
        className={`w-full overflow-x-auto no-scrollbar scroll-smooth`}
        onLoad={updateArrows}
      >
        <div className={`flex ${itemGap} py-2`}>
          {items.map((it) => (
            <div key={it.key} className="shrink-0">
              {it.content}
            </div>
          ))}
        </div>
      </div>

      {/* Right */}
      <button
        onClick={() => scrollByCards(1)}
        disabled={!canRight}
        className="hidden md:flex absolute right-[-18px] top-1/2 -translate-y-1/2 z-10 h-10 w-10 rounded-full bg-white shadow items-center justify-center disabled:opacity-40"
        aria-label="Next"
      >
        ›
      </button>
    </div>
  );
}
