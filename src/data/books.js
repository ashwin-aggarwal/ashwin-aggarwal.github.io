// Seed data for the bookshelf. Rendered client-side by scripts/shelf.js so
// "Add book" can insert a spine without a rebuild.
//
// coverImage imports go through Astro's project-wide image handling, which
// wraps them as { src, width, height, format } metadata rather than a
// plain URL string — .src below is the part shelf.js needs for a CSS
// background-image url().
//
// NOTE: the `pages` copy below for both books is placeholder text written
// only so the open/turn animation has something to show — replace with
// real reading notes.
import siddharthaCover from './siddhartha.webp';
import atomicHabitsCover from './atomic-habits.webp';

export const books = [
  {
    id: 'siddhartha',
    title: 'Siddhartha',
    author: 'Hermann Hesse',
    spineColor: '#2F6B5E',
    coverImage: siddharthaCover.src,
    thickness: 34,
    height: 0.92,
    pages: [
      // PLACEHOLDER — replace with real notes.
      'Started this on a slow Sunday. Hesse writes the river like it '
        + 'already knows the ending and is just being polite about it.',
      'Page 2 (placeholder): "Knowledge can be communicated, but not '
        + 'wisdom." Underlined this twice, argued with it for a week.',
      'Placeholder note — the ferryman chapters are the ones I keep '
        + 'coming back to. Something about listening to the river.',
      'Placeholder note — finished it on the porch. Want to reread in '
        + 'a year and see if it lands differently.',
    ],
  },
  {
    id: 'atomic-habits',
    title: 'Atomic Habits',
    author: 'James Clear',
    spineColor: '#C9A227',
    coverImage: atomicHabitsCover.src,
    thickness: 46,
    height: 0.86,
    pages: [
      // PLACEHOLDER — replace with real notes.
      'Placeholder note — "You do not rise to the level of your goals, '
        + 'you fall to the level of your systems." Chapter 1 hook.',
      'Placeholder note — the four laws: obvious, attractive, easy, '
        + 'satisfying. Wrote these on a sticky note on my monitor.',
      'Placeholder note — habit stacking examples. Tried this with '
        + 'flossing + coffee. Actually stuck, three weeks in.',
      'Placeholder note — identity-based habits chapter. "Every action '
        + 'is a vote for the type of person you wish to become."',
    ],
  },
];
