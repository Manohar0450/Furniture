"use client";
import { useState } from "react";

export default function Gallery({ images, emoji, tone, name }) {
  const [i, setI] = useState(0);
  if (!images?.length) return <div className="tile big" style={{ background: tone || "#d8e2dc" }}>{emoji || "🪑"}</div>;
  return (
    <div>
      <div className="tile big"><img src={images[i]} alt={name} /></div>
      {images.length > 1 && (
        <div className="thumbs">
          {images.map((u, k) => <button key={u} className={k === i ? "on" : ""} onClick={() => setI(k)} aria-label={`Photo ${k + 1}`}><img src={u} alt="" /></button>)}
        </div>
      )}
    </div>
  );
}
