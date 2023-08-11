import { MutableRefObject } from 'react';

type RGB = [number, number, number];

function extractRGBA(str: string): [number, number, number, number] {
  const match = str.match(/rgba?\((\d+),\s*(\d+),\s*(\d+),\s*(\d*(?:\.\d+)?)\)/);
  if (!match) throw new Error('Invalid color string');
  return [Number(match[1]), Number(match[2]), Number(match[3]), Number(match[4])];
}

function getNonTrasparentOverlayColor(rgbaStr: string, background: RGB): string {
  const [r, g, b, a] = extractRGBA(rgbaStr);

  const rgb = [
    Math.round(a * r + (1 - a) * background[0]),
    Math.round(a * g + (1 - a) * background[1]),
    Math.round(a * b + (1 - a) * background[2]),
  ];

  return `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`;
}

export function useSafariThemeColor(overlay: MutableRefObject<HTMLDivElement>) {
  requestAnimationFrame(() => {
    if (overlay.current) {
      let metaThemeColor = document.querySelector('meta[name="theme-color"]');
      const computedStyle = getComputedStyle(overlay.current);
      const overlayColor = computedStyle.getPropertyValue('background-color');
      const nonTrasparentOverlayColor = getNonTrasparentOverlayColor(overlayColor, [255, 255, 255]);

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
