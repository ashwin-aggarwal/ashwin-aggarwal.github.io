// Blog posts render under the page's <h1>Blog</h1> and each post's own
// <h2> title, so a post's Markdown "##" sections need to come out as <h3>
// (and "###" as <h4>) to keep the heading outline intact. Scoped to files
// under src/content/blog/ — every other collection renders unchanged.
const BLOG_DIR = /[\\/]src[\\/]content[\\/]blog[\\/]/;

export function rehypeShiftBlogHeadings() {
  return (tree, file) => {
    const path = String(file.path ?? file.history?.[0] ?? '');
    if (!BLOG_DIR.test(path)) return;

    const walk = (node) => {
      if (node.type === 'element' && /^h[1-6]$/.test(node.tagName)) {
        node.tagName = `h${Math.min(Number(node.tagName[1]) + 1, 6)}`;
      }
      node.children?.forEach(walk);
    };
    walk(tree);
  };
}
