// Build-time figures inside a Markdown post, without MDX.
//
// In a post, on lines of their own:
//
//   <post-figure name="hook">
//   Caption text (plain HTML).
//   </post-figure>
//
// Markdown keeps that block as one raw-HTML node; this plugin swaps it for
// whatever figures[name](caption) returns. Posts without the tag are
// untouched. An unknown name fails the build rather than shipping a gap.
import { figures } from '../components/rewardlens/figures.mjs';

const TAG = /^<post-figure name="([\w-]+)">\s*([\s\S]*?)\s*<\/post-figure>\s*$/;

export default function remarkPostFigures() {
  return (tree) => {
    for (const node of tree.children) {
      if (node.type !== 'html') continue;
      const match = node.value.match(TAG);
      if (!match) continue;
      const [, name, caption] = match;
      if (!figures[name]) throw new Error(`post-figure: no figure named "${name}"`);
      node.value = figures[name](caption);
    }
  };
}
