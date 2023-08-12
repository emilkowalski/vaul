import { MutableRefObject } from 'react';

type RGB = [string, string, string];

function extractRGBA(str: string): [number, number, number, number] {
  const match = str.match(/rgba?\((\d+),\s*(\d+),\s*(\d+),\s*(\d*(?:\.\d+)?)\)/);
  if (!match) throw new Error('Invalid color string');
  return [Number(match[1]), Number(match[2]), Number(match[3]), Number(match[4])];
}

// If the overlay is rgba(0, 0, 0, 0.4), we can't just use this value as the theme-color, as it will be pure black instead of grey-ish.
// Instead, we assume the background is white (or black depending on the theme) and calculate the result of putting the overlay color on top of it.
function getNonTrasparentOverlayColor(rgbaStr: string, background: RGB): string {
  const [r, g, b, a] = extractRGBA(rgbaStr);

  const rgb = [
    Math.round(a * r + (1 - a) * Number(background[0])),
    Math.round(a * g + (1 - a) * Number(background[1])),
    Math.round(a * b + (1 - a) * Number(background[2])),
  ];

  return `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`;
}

export function useSafariThemeColor(overlay: MutableRefObject<HTMLDivElement>, isOpen: boolean) {
  requestAnimationFrame(() => {
    if (overlay.current) {
      let metaThemeColor = document.querySelector('meta[name="theme-color"]');
      const overlayColor = getComputedStyle(overlay.current).getPropertyValue('background-color');
      const backgroundColor = getComputedStyle(document.documentElement)
        .getPropertyValue('--vaul-theme-color')
        .split(',');
      const nonTrasparentOverlayColor = getNonTrasparentOverlayColor(overlayColor, backgroundColor as unknown as RGB);

      if (!metaThemeColor) {
        metaThemeColor = document.createElement('meta');
        // @ts-ignore
        metaThemeColor.name = 'theme-color';
        document.getElementsByTagName('head')[0].appendChild(metaThemeColor);
      }

      metaThemeColor.setAttribute('content', nonTrasparentOverlayColor);
    }
  });
}
