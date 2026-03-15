"use client";

import { useEffect, useState } from "react";

export function ViewCounter({ slug }: { slug: string }) {
  const [views, setViews] = useState<number | null>(null);

  useEffect(() => {
    fetch(`/api/views/${slug}`, { method: "POST" })
      .then((res) => res.json())
      .then((data: { views: number }) => setViews(data.views));
  }, [slug]);

  if (views === null) return null;
  return <>{views.toLocaleString()} views</>;
}
