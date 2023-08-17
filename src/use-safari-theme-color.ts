import React, { useCallback } from 'react';
import { bezier } from './bezier-easing';
import { isIOS, isSafari } from './use-prevent-scroll';

const bezierEasing = bezier(0.32, 0.72, 0, 1);

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

function easing(t: number): number {
  return bezierEasing(t);
}

function interpolateColor(color1: number[], color2: number[], factor: number, linear: boolean) {
  if (arguments.length < 3) {
    factor = 0.5;
  }
  let result = color1.slice();
  for (let i = 0; i < 3; i++) {
    const delta = color2[i] - color1[i];
    const newColorComponent = linear ? color1[i] + factor * delta : color1[i] + easing(factor) * delta;
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
    interpolatedColorArray.push(interpolateColor(color1, color2, stepFactor * i, Boolean(linear)));
  }

  return interpolatedColorArray;
}
export function useSafariThemeColor(
  drawer: React.MutableRefObject<HTMLDivElement>,
  overlay: React.MutableRefObject<HTMLDivElement>,
  isOpen: boolean,
  shouldAnimate: boolean,
) {
  const [backgroundColor, setBackgroundColor] = React.useState<RGB | null>([255, 255, 255]);
  const [overlayColor, setOverlayColor] = React.useState<RGB | null>([153, 153, 153]);
  const [releaseExit, setReleaseExit] = React.useState<boolean>(false);
  const [initialMetaThemeColor, setInitialMetaThemeColor] = React.useState<string | null>(null);
  const [metaElement, setMetaElement] = React.useState<HTMLMetaElement | null>(null);
  const shouldRun = React.useMemo(() => isIOS() && isSafari() && shouldAnimate, [shouldAnimate]);

  const interpolatedColorsEnter = React.useMemo(
    () => (backgroundColor && overlayColor ? interpolateColors(backgroundColor, overlayColor, 50) : null),
    [overlayColor, backgroundColor],
  );

  const interpolatedColorsExit = React.useMemo(
    () => (backgroundColor && overlayColor ? interpolateColors(overlayColor, backgroundColor, 50) : null),
    [overlayColor, backgroundColor],
  );

  const interpolatedColorsLinear = React.useMemo(
    () => (backgroundColor && overlayColor ? interpolateColors(overlayColor, backgroundColor, 50, true) : null),
    [overlayColor, backgroundColor],
  );

  React.useEffect(() => {
    if (!shouldRun) return;
    const documentElementStyle = getComputedStyle(document.documentElement);
    const backgroundColor = documentElementStyle
      .getPropertyValue('--vaul-overlay-background')
      .split(',')
      .map((c) => Number(c));

    const overlayColor = documentElementStyle.getPropertyValue('--vaul-overlay-background-end');

    const nonTransparentOverlayColor = getNonTrasparentOverlayColor(overlayColor, backgroundColor as RGB);

    setBackgroundColor(backgroundColor as RGB);
    setOverlayColor(nonTransparentOverlayColor);
  }, [shouldRun]);

  React.useEffect(() => {
    if (!shouldRun) return;

    if (!initialMetaThemeColor) {
      let metaThemeColor: HTMLMetaElement | null = document.querySelector('meta[name="theme-color"]');

      if (metaThemeColor) {
        setInitialMetaThemeColor(metaThemeColor.getAttribute('content'));
      } else {
        metaThemeColor = document.createElement('meta');
        metaThemeColor.name = 'theme-color';
        document.getElementsByTagName('head')[0].appendChild(metaThemeColor);
      }
      setMetaElement(metaThemeColor);
    }
  }, [initialMetaThemeColor, shouldRun]);

  const animate = useCallback(
    (colors: number[][]): number => {
      let start: number;
      let frameId: number;

      function draw(timeStamp: number) {
        if (!start) start = timeStamp;
        const elapsed = timeStamp - start;
        // dividing by 10 will give us a total time of 500.
        const index = Math.floor(elapsed / 10);

        if (overlay.current && colors && !releaseExit) {
          if (
            drawer.current.style.transform === 'translateY(0px)' &&
            drawer.current.getAttribute('vaul-clicked-outside') !== 'true'
          ) {
            // It's resetting, so don't apply these styles
            return;
          }

          if (index < colors.length) {
            const currentColor = colors[index];
            metaElement?.setAttribute('content', `rgb(${currentColor.join(',')})`);

            if (index === colors.length - 1 && initialMetaThemeColor && !isOpen) {
              metaElement?.setAttribute('content', initialMetaThemeColor as string);
            }

            frameId = requestAnimationFrame(draw);
          }
        }
      }

      frameId = requestAnimationFrame(draw);
      return frameId;
    },
    [drawer, isOpen, metaElement, releaseExit, initialMetaThemeColor, overlay],
  );

  React.useEffect(() => {
    if (!shouldRun || !interpolatedColorsEnter || !interpolatedColorsExit) return;

    const frameId = animate(isOpen ? interpolatedColorsEnter : interpolatedColorsExit);

    if (isOpen) {
      setReleaseExit(false);
    }

    return () => {
      if (frameId) cancelAnimationFrame(frameId);
    };
  }, [isOpen, shouldRun, animate, interpolatedColorsEnter, interpolatedColorsExit]);

  function onDrag(percentageDragged: number) {
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (!shouldRun || !metaThemeColor || !interpolatedColorsLinear) return;

    // Calculate the index of the color array by mapping the proportion to the array length
    let colorIndex = Math.floor(percentageDragged * interpolatedColorsLinear.length);

    // Ensure colorIndex is between 0 and array length - 1
    colorIndex = Math.max(0, Math.min(interpolatedColorsLinear.length - 1, colorIndex));

    // Get the color
    const color = interpolatedColorsLinear[colorIndex];

    // Set the meta theme color
    metaThemeColor.setAttribute('content', `rgb(${color.join(',')})`);
  }

  function onRelease(isOpen: boolean) {
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (!metaThemeColor || !shouldRun) return;
    setReleaseExit(true);

    // Get the current meta theme color and create color steps from it to overlayColor with non-linear interpolation to ensure same easing as overlay.
    const rgbValues = metaThemeColor.getAttribute('content').match(/\d+/g).map(Number);

    let colorSteps = interpolateColors(rgbValues, overlayColor as RGB, 50);

    if (!isOpen && backgroundColor) {
      colorSteps = interpolateColors(rgbValues, backgroundColor, 50);
    }

    animate(colorSteps);
  }

  return { onDrag, onRelease };
}
