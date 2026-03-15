import { getCloudflareContext } from "@opennextjs/cloudflare";
import { type NextRequest, NextResponse } from "next/server";

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { env } = getCloudflareContext();
  const { slug } = await params;

  const value = await env.BLOG_VIEWS.get(slug);
  const views = Number(value ?? 0) + 1;

  await env.BLOG_VIEWS.put(slug, String(views));
  return NextResponse.json({ views });
}
