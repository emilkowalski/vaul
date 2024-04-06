import { DrawerDirection } from './types';

interface Style {
  [key: string]: string;
}

const cache = new WeakMap();

export function isInView(el: HTMLElement): boolean {
  const rect = el.getBoundingClientRect();

  if (!window.visualViewport) return false;

  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    // Need + 40 for safari detection
    rect.bottom <= window.visualViewport.height - 40 &&
    rect.right <= window.visualViewport.width
  );
}

export function set(el?: Element | HTMLElement | null, styles?: Style, ignoreCache = false) {
  if (!el || !(el instanceof HTMLElement) || !styles) return;
  let originalStyles: Style = {};

  Object.entries(styles).forEach(([key, value]: [string, string]) => {
    if (key.startsWith('--')) {
      el.style.setProperty(key, value);
      return;
    }

    originalStyles[key] = (el.style as any)[key];
    (el.style as any)[key] = value;
  });

  if (ignoreCache) return;

  cache.set(el, originalStyles);
}

export function reset(el: Element | HTMLElement | null, prop?: string) {
  if (!el || !(el instanceof HTMLElement)) return;
  let originalStyles = cache.get(el);

  if (!originalStyles) {
    return;
  }

  if (prop) {
    (el.style as any)[prop] = originalStyles[prop];
  } else {
    Object.entries(originalStyles).forEach(([key, value]) => {
      (el.style as any)[key] = value;
    });
  }
}

export const isVertical = (direction: DrawerDirection) => {
  switch (direction) {
    case 'top':
    case 'bottom':
      return true;
    case 'left':
    case 'right':
      return false;
    default:
      return direction satisfies never;
  }
};

export function getTranslate(element: HTMLElement, direction: DrawerDirection): number | null {
  if (!element) {
    return null;
  }
  const style = window.getComputedStyle(element);
  const transform =
    // @ts-ignore
    style.transform || style.webkitTransform || style.mozTransform;
  let mat = transform.match(/^matrix3d\((.+)\)$/);
  if (mat) {
    // https://developer.mozilla.org/en-US/docs/Web/CSS/transform-function/matrix3d
    return parseFloat(mat[1].split(', ')[isVertical(direction) ? 13 : 12]);
  }
  // https://developer.mozilla.org/en-US/docs/Web/CSS/transform-function/matrix
  mat = transform.match(/^matrix\((.+)\)$/);
  return mat ? parseFloat(mat[1].split(', ')[isVertical(direction) ? 5 : 4]) : null;
}

export function dampenValue(v: number) {
  return 8 * (Math.log(v + 1) - 2);
}

export function updateRgbaAlpha(rgbaColor: string, newAlpha: number): string {
  // Ensure newAlpha is between 0 and 1
  newAlpha = Math.max(0, Math.min(1, newAlpha));

  // Extract the RGB values from the RGBA string
  const rgbaParts = RegExp(/rgba?\((\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3})(?:,\s*([\d.]+))?\)/).exec(rgbaColor);

  if (!rgbaParts) {
    throw new Error(`Invalid RGBA color value: ${rgbaColor}`);
  }

  // Reconstruct the RGBA color with the new alpha value
  const updatedRgbaColor = `rgba(${rgbaParts[1]}, ${rgbaParts[2]}, ${rgbaParts[3]}, ${newAlpha})`;

  return updatedRgbaColor;
}

function parseRgba(rgba: string): [number, number, number, number] {
  const match = rgba.match(/rgba?\((\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3}),?\s*([\d.]+)?\)/);
  if (!match) {
    throw new Error('Invalid RGBA color value');
  }
  return [
    parseInt(match[1], 10),
    parseInt(match[2], 10),
    parseInt(match[3], 10),
    match[4] !== undefined ? parseFloat(match[4]) : 1, // Default alpha to 1 if not provided
  ];
}
