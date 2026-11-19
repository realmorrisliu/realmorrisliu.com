export function thoughtFeedPath(id: string): string {
  return `/thoughts/${id.replace(/\.(md|mdx)$/, "")}`;
}
