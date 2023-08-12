import { MutableRefObject, useEffect, useMemo, useState } from 'react';

type RGB = [number, number, number];

function extractRGBA(str: string): [number, number, number, number] {
  const match = str.match(/rgba?\((\d+),\s*(\d+),\s*(\d+),\s*(\d*(?:\.\d+)?)\)/);
  if (!match) throw new Error('Invalid color string');
  return [Number(match[1]), Number(match[2]), Number(match[3]), Number(match[4])];
}

// If the overlay is rgba(0, 0, 0, 0.4), we can't just use this value as the theme-color, as it will be pure black instead of grey-ish.
// Instead, we assume the background is white (or black depending on the theme) and calculate the result of putting the overlay color on top of it.
function getNonTrasparentOverlayColor(rgbaStr: string, background: RGB): RGB {
  const [r, g, b, a] = extractRGBA(rgbaStr);

  const rgb: RGB = [
    Math.round(a * r + (1 - a) * Number(background[0])),
    Math.round(a * g + (1 - a) * Number(background[1])),
    Math.round(a * b + (1 - a) * Number(background[2])),
  ];

  return rgb;
}

function easeOutExpo(t: number): number {
  return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
}

function interpolateColor(color1: number[], color2: number[], factor: number, linear: boolean) {
  if (arguments.length < 3) {
    factor = 0.5;
  }
  let result = color1.slice();
  for (let i = 0; i < 3; i++) {
    const delta = color2[i] - color1[i];
    const newColorComponent = linear ? color1[i] + factor * delta : color1[i] + easeOutExpo(factor) * delta;
    result[i] = Math.round(newColorComponent);
    if (result[i] < 0) result[i] = 0;
    if (result[i] > 255) result[i] = 255;
  }
  return result;
}

function interpolateColors(color1: number[], color2: number[], steps: number, linear?: boolean): number[][] {
  let stepFactor = 1 / (steps - 1),
    interpolatedColorArray = [];

  for (let i = 0; i < steps; i++) {
    interpolatedColorArray.push(interpolateColor(color1, color2, stepFactor * i, linear));
  }

  return interpolatedColorArray;
}
export function useSafariThemeColor(overlay: MutableRefObject<HTMLDivElement>, isOpen: boolean) {
  const [backgroundColor, setBackgroundColor] = useState<RGB | null>(null);
  const [nonTransparentOverlayColor, setNonTransparentOverlayColor] = useState<RGB | null>(null);

  const interpolatedColorsEnter = useMemo(
    () =>
      backgroundColor && nonTransparentOverlayColor
        ? interpolateColors(backgroundColor, nonTransparentOverlayColor, 50)
        : null,
    [nonTransparentOverlayColor, backgroundColor],
  );

  const interpolatedColorsExit = useMemo(
    () =>
      backgroundColor && nonTransparentOverlayColor
        ? interpolateColors(nonTransparentOverlayColor, backgroundColor, 50)
        : null,
    [nonTransparentOverlayColor, backgroundColor],
  );

  const linearInterpolation = useMemo(
    () =>
      backgroundColor && nonTransparentOverlayColor
        ? interpolateColors(nonTransparentOverlayColor, backgroundColor, 50, true)
        : null,
    [nonTransparentOverlayColor, backgroundColor],
  );

  useEffect(() => {
    requestAnimationFrame(() => {
      if (overlay.current) {
        const overlayColor = getComputedStyle(overlay.current).getPropertyValue('background-color');
        const backgroundColor = getComputedStyle(document.documentElement)
          .getPropertyValue('--vaul-theme-color')
          .split(',')
          .map((c) => Number(c));
        const nonTransparentOverlayColor = getNonTrasparentOverlayColor(overlayColor, backgroundColor as RGB);
        setBackgroundColor(backgroundColor as RGB);
        setNonTransparentOverlayColor(nonTransparentOverlayColor);
      }
    });
  }, [isOpen]);

  useEffect(() => {
    if (overlay.current && interpolatedColorsEnter && interpolatedColorsExit) {
      let metaThemeColor = document.querySelector('meta[name="theme-color"]');

      if (!metaThemeColor) {
        metaThemeColor = document.createElement('meta');
        // @ts-ignore
        metaThemeColor.name = 'theme-color';
        document.getElementsByTagName('head')[0].appendChild(metaThemeColor);
      }

      for (let i = 0; i < interpolatedColorsEnter.length; i++) {
        setTimeout(() => {
          const currentColor = isOpen ? interpolatedColorsEnter[i] : interpolatedColorsExit[i];
          metaThemeColor.setAttribute('content', `rgb(${currentColor.join(',')})`);
        }, i * 5);
      }
    }
  }, [isOpen, interpolatedColorsEnter, interpolatedColorsExit]);

  function changeThemeColorOnDrag(percentageDragged: number) {
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (!metaThemeColor) return;

    // Calculate the index of the color array by mapping the proportion to the array length
    let colorIndex = Math.floor(percentageDragged * linearInterpolation.length);

    // Ensure colorIndex is between 0 and array length - 1
    colorIndex = Math.max(0, Math.min(linearInterpolation.length - 1, colorIndex));

    // Get the color
    const color = linearInterpolation[colorIndex];

    // Set the meta theme color
    metaThemeColor.setAttribute('content', `rgb(${color.join(',')})`);
  }

  return { changeThemeColorOnDrag };
}
