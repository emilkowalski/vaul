import * as React from 'react';
import debounce from 'lodash.debounce';

export type Options = {
  /** The id of the element to consider active by default */
  defaultActive?: string;
  /** When to consider an element "active", based on how many vh from the top of the page it is */
  vhFromTopOfPage: number;
};

/**
 * Tracks the position of the HTML elements for the given ids as the user scrolls
 * and returns the "active" element based on the element's position on the page.
 */
export const useActiveScrollElement = (
  /** List of ids referring to HTML elements on the page to track */
  ids: string[],
  options: Options = {
    defaultActive: ids[0],
    vhFromTopOfPage: 50,
  },
) => {
  const [active, setActive] = React.useState(options?.defaultActive ?? ids[0]);
  const updatesPaused = React.useRef(false);

  /** Sets the active id if updates are no paused as a result of hash changes */
  function updateActive(id: string) {
    if (!updatesPaused.current) {
      setActive(id);
    }
  }

  // Set active initially based on the URL hash when page is loaded
  React.useEffect(() => {
    if (window.location.hash) {
      setActive(window.location.hash?.slice(1));
    }
  }, []);

  // Update the active sidebar item as you scroll through different sections
  React.useEffect(() => {
    let timer: NodeJS.Timeout;
    let firstObserver = true;
    let maxScroll = Number.MAX_SAFE_INTEGER;
    const sections = ids.map((id) => document.getElementById(id)).filter((el) => !!el) as HTMLElement[];

    function observerCb(entries: IntersectionObserverEntry[]) {
      // IObserver fires once on page load, ignore it
      // Hash links are manually handled in effect above
      if (firstObserver) {
        firstObserver = false;
        return;
      }

      for (const entry of entries) {
        const { isIntersecting, target, boundingClientRect, rootBounds } = entry;
        const id = target.id;

        if (!id || !rootBounds) {
          return;
        }

        const didIntersectAtTop = rootBounds.bottom - boundingClientRect.bottom > rootBounds.bottom / 2;

        // This item just entered the viewport from the top, don't make it active until it reaches the middle of the screen
        if (didIntersectAtTop) {
          return;
        }

        // This item just passed the middle of the screen, make it active
        if (isIntersecting) {
          updateActive(id);
          return;
        }

        // Scrolling up, this item just crossed middle of the screen going down
        const index = ids.findIndex((i) => i === id);
        const previous = ids[Math.max(index - 1, 0)];
        updateActive(previous);
      }
    }

    /**
     * Detect clicks on hash links to set the active item.
     * We do this manually instead of using the `hashchange` event, because
     * clicking on a link that matches the current hash doesn't fire the event,
     * but we still want to update the active item.
     */
    function handleHash(e: MouseEvent) {
      const target = e.target as HTMLElement | null;

      if (!target) {
        return;
      }

      const anchorElement = target.closest('a');
      const href = anchorElement?.getAttribute('href');

      if (!anchorElement || !href || !href.startsWith('#')) {
        return;
      }

      const hash = href?.slice(1);

      // Ignore hash links that don't match the ids we're tracking
      if (!ids.includes(hash)) {
        return;
      }

      // Immediately set active
      setActive(hash);

      // Pause updates caused by scrolling or intersection observer for a short time
      updatesPaused.current = true;
      clearTimeout(timer);
      timer = setTimeout(() => (updatesPaused.current = false), 60);
    }

    const handleResize = debounce(() => {
      maxScroll =
        Math.max(
          document.body.scrollHeight,
          document.body.offsetHeight,
          document.documentElement.clientHeight,
          document.documentElement.scrollHeight,
          document.documentElement.offsetHeight,
        ) - window.innerHeight;
    }, 500);

    function handleScroll() {
      // If we're at the top of the page, set the first item as active
      if (window.scrollY <= 0) {
        updateActive(ids[0]);
      }

      // If we're at the bottom of the page, set the last item as active
      if (Math.round(window.scrollY) >= Math.round(maxScroll)) {
        updateActive(ids[ids.length - 1]);
      }
    }

    const scrollObserver = new IntersectionObserver(observerCb, {
      threshold: [1],
      // Some amount of vh from the top of the page
      rootMargin: `0% 0% -${options.vhFromTopOfPage}% 0%`,
    });

    const resizeObserver = new ResizeObserver(handleResize);

    handleResize();

    if (window.scrollY > 0) {
      handleScroll();
    }

    sections.forEach((heading) => scrollObserver.observe(heading));
    resizeObserver.observe(document.body);
    document.addEventListener('click', handleHash);
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      document.removeEventListener('click', handleHash);
      window.removeEventListener('scroll', handleScroll);
      resizeObserver.disconnect();
      scrollObserver.disconnect();
      clearTimeout(timer);
    };
  }, [ids, options.vhFromTopOfPage]);

  return active;
};
