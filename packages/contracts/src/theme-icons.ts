/**
 * The icon bank (THEMING §2.2): icons shipped with QuizDock for the answers, by group,
 * and sets of eight to give the eight answers at once. Phosphor Icons, fill style
 * (MIT, `public/licenses/phosphor-icons.txt`); each is `/icons/bank/<group>/<name>.svg`,
 * square, its fill the answer's text colour. A slot names one as `bank:<group>/<name>`.
 */

export const ICON_BANK = {
  animals: [
    'bird',
    'bug',
    'butterfly',
    'cat',
    'cow',
    'dog',
    'fish',
    'fish-simple',
    'horse',
    'paw-print',
    'rabbit',
    'shrimp',
  ],
  nature: [
    'cactus',
    'cloud',
    'drop',
    'fire',
    'flower',
    'leaf',
    'lightning',
    'moon',
    'mountains',
    'plant',
    'rainbow',
    'snowflake',
    'star',
    'sun',
    'tree',
  ],
  food: [
    'apple-logo',
    'avocado',
    'bread',
    'cake',
    'carrot',
    'coffee',
    'cookie',
    'egg',
    'hamburger',
    'ice-cream',
    'orange-slice',
    'pepper',
    'pizza',
    'popcorn',
    'wine',
  ],
  sports: [
    'barbell',
    'baseball',
    'basketball',
    'bicycle',
    'boxing-glove',
    'flag-checkered',
    'football',
    'golf',
    'medal',
    'ping-pong',
    'sneaker',
    'soccer-ball',
    'target',
    'tennis-ball',
    'trophy',
    'volleyball',
  ],
  travel: [
    'airplane',
    'anchor',
    'boat',
    'bus',
    'car',
    'castle-turret',
    'compass',
    'globe',
    'house',
    'lighthouse',
    'map-pin',
    'rocket',
    'suitcase',
    'tent',
    'train',
  ],
  objects: [
    'alarm',
    'bell',
    'book-open',
    'camera',
    'crown',
    'game-controller',
    'gift',
    'guitar',
    'hourglass',
    'key',
    'lightbulb',
    'music-note',
    'paint-brush',
    'puzzle-piece',
    'scissors',
    'umbrella',
  ],
  symbols: [
    'check',
    'circle',
    'club',
    'cross',
    'diamond',
    'exclamation-mark',
    'heart',
    'hexagon',
    'question',
    'shield',
    'smiley',
    'spade',
    'square',
    'star-four',
    'triangle',
    'x',
  ],
  halloween: ['broom', 'cat', 'eye', 'flask', 'ghost', 'moon-stars', 'skull', 'spiral'],
  christmas: ['bell', 'coffee', 'cookie', 'gift', 'snowflake', 'sparkle', 'star', 'tree-evergreen'],
  'new-year': [
    'balloon',
    'champagne',
    'clock',
    'confetti',
    'martini',
    'music-notes',
    'sparkle',
    'wine',
  ],
  easter: ['basket', 'bird', 'butterfly', 'egg', 'flower', 'flower-tulip', 'plant', 'rabbit'],
  summer: [
    'beach-ball',
    'ice-cream',
    'sailboat',
    'sun',
    'sunglasses',
    'tree-palm',
    'umbrella-simple',
    'waves',
  ],
} as const;
export type IconGroup = keyof typeof ICON_BANK;

/** Sets of eight, in the default order of the answers (green, red, blue, yellow…). */
export const ICON_SETS: Record<IconGroup, readonly string[]> = {
  animals: ['rabbit', 'cat', 'fish', 'bird', 'dog', 'butterfly', 'horse', 'cow'],
  nature: ['sun', 'star', 'moon', 'snowflake', 'drop', 'leaf', 'fire', 'cloud'],
  food: ['apple-logo', 'pizza', 'carrot', 'cookie', 'egg', 'ice-cream', 'cake', 'coffee'],
  sports: [
    'soccer-ball',
    'basketball',
    'tennis-ball',
    'trophy',
    'medal',
    'bicycle',
    'target',
    'flag-checkered',
  ],
  travel: ['airplane', 'car', 'train', 'boat', 'rocket', 'bus', 'tent', 'lighthouse'],
  objects: ['key', 'bell', 'crown', 'gift', 'lightbulb', 'music-note', 'umbrella', 'puzzle-piece'],
  symbols: ['heart', 'star-four', 'shield', 'club', 'spade', 'hexagon', 'triangle', 'smiley'],
  halloween: ['ghost', 'skull', 'cat', 'moon-stars', 'eye', 'flask', 'broom', 'spiral'],
  christmas: ['tree-evergreen', 'gift', 'snowflake', 'star', 'bell', 'cookie', 'sparkle', 'coffee'],
  'new-year': [
    'confetti',
    'balloon',
    'clock',
    'champagne',
    'sparkle',
    'wine',
    'music-notes',
    'martini',
  ],
  easter: ['plant', 'flower-tulip', 'bird', 'egg', 'butterfly', 'basket', 'rabbit', 'flower'],
  summer: [
    'tree-palm',
    'beach-ball',
    'sailboat',
    'sun',
    'sunglasses',
    'ice-cream',
    'umbrella-simple',
    'waves',
  ],
};

export const BANK_ICON = /^bank:([a-z-]+)\/([a-z0-9-]+)$/;

/** Whether a reference names an icon of the bank, and one that exists. */
export function isBankIcon(ref: string): boolean {
  const m = BANK_ICON.exec(ref);
  return (
    !!m && (ICON_BANK[m[1] as IconGroup] as readonly string[] | undefined)?.includes(m[2]) === true
  );
}

export const bankIconUrl = (ref: string) => `/icons/bank/${ref.slice('bank:'.length)}.svg`;

/**
 * The pictures the shipped themes lay behind their steps (`public/themes`), named
 * `shipped:<file>`. A user theme inherits them, or picks one for its own background.
 */
export const SHIPPED_PICTURES = [
  'halloween.svg',
  'christmas.svg',
  'new-year.svg',
  'easter.svg',
  'summer.svg',
] as const;
export const SHIPPED_PICTURE = /^shipped:([a-z0-9-]+\.svg)$/;
export const isShippedPicture = (ref: string) =>
  (SHIPPED_PICTURES as readonly string[]).includes(SHIPPED_PICTURE.exec(ref)?.[1] ?? '');
export const shippedPictureUrl = (ref: string) => `/themes/${ref.slice('shipped:'.length)}`;

/** A reference that names no file of the theme's own: an icon of the bank, a shipped picture. */
export const isBuiltinAsset = (ref: string) => isBankIcon(ref) || isShippedPicture(ref);
