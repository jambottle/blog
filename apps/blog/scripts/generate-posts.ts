import { evaluate } from "@mdx-js/mdx";
import fs from "fs";
import path from "path";
import React from "react";
import * as runtime from "react/jsx-runtime";
import { renderToStaticMarkup } from "react-dom/server";

import { components } from "@/components/mdx";
import type { Post, PostMetadata } from "@/lib/types";

function parseFrontmatter(fileContent: string) {
  const frontmatterRegex = /---\s*([\s\S]*?)\s*---/;
  const match = frontmatterRegex.exec(fileContent);
  const frontMatterBlock = match![1];
  const content = fileContent.replace(frontmatterRegex, "").trim();
  const frontMatterLines = frontMatterBlock.trim().split("\n");
  const metadata: Partial<PostMetadata> = {};

  frontMatterLines.forEach((line) => {
    const [key, ...valueArr] = line.split(": ");
    let value = valueArr.join(": ").trim();
    value = value.replace(/^['"](.*)['"]$/, "$1"); // Remove quotes
    metadata[key.trim() as keyof PostMetadata] = value;
  });

  return { metadata: metadata as PostMetadata, content };
}

function getMDXFiles(dir: string) {
  return fs.readdirSync(dir).filter((file) => path.extname(file) === ".mdx");
}

function readMDXFile(filePath: string) {
  const rawContent = fs.readFileSync(filePath, "utf-8");
  return parseFrontmatter(rawContent);
}

async function renderMDXToHTML(content: string): Promise<string> {
  const { default: Content } = await evaluate(content, {
    ...(runtime as Parameters<typeof evaluate>[1]),
    baseUrl: import.meta.url,
  });
  return renderToStaticMarkup(
    React.createElement(
      Content as React.ComponentType<{ components: typeof components }>,
      { components },
    ),
  );
}

async function getMDXData(dir: string) {
  const mdxFiles = getMDXFiles(dir);
  return Promise.all(
    mdxFiles.map(async (file) => {
      const { metadata, content } = readMDXFile(path.join(dir, file));
      const slug = path.basename(file, path.extname(file));
      const html = await renderMDXToHTML(content);

      return {
        metadata,
        slug,
        html,
      };
    }),
  );
}

getMDXData(path.join(process.cwd(), "posts")).then((posts: Post[]) => {
  fs.writeFileSync(
    path.join(process.cwd(), "scripts", "posts.json"),
    JSON.stringify(posts, null, 2),
  );
});
