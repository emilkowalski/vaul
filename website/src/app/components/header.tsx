import React, { useEffect } from 'react';
import gsap from 'gsap';
import { CustomEase } from 'gsap/CustomEase';
import { cn } from '@/app/utils';
import { SplitText } from './split-text';

// Register the CustomEase plugin
gsap.registerPlugin(CustomEase);

// Constants
const ANIMATION_DURATION = 0.5;
const DELAY_STEP = 0.5;

// Custom ease that starts fast and slows down
const CUSTOM_EASE = CustomEase.create('custom', '0.5,0.1,0.5,1');

const AnimatedHeader: React.FC = () => {
  useEffect(() => {
    const elements = {
      vaul: ['vaul-3', 'vaul-2', 'vaul-1', 'vaul-0'],
      modal: ['modal-3', 'modal-2', 'modal-1', 'modal-0'],
      colon: 'colon',
      headerFirst: 'header-first',
      headerSecond: 'header-second',
    };

    const animateElement = (id: string, keyframes: gsap.TweenVars[]) => {
      const element = document.getElementById(id);
      if (element) {
        gsap.set(element, keyframes[0]);
        keyframes.slice(1).forEach((keyframe, index) => {
          gsap.to(element, {
            ...keyframe,
            duration: ANIMATION_DURATION,
            delay: index * DELAY_STEP,
            ease: index === keyframes.length - 1 ? 'power2.out' : CUSTOM_EASE, // Slower ease for the last animation
          });
        });
      }
    };

    // Initial setup
    [...elements.vaul, ...elements.modal].forEach((id) => {
      animateElement(id, [{ x: 0, y: '-200%', opacity: 1 }]);
    });
    animateElement(elements.colon, [{ x: 0, y: '0%', opacity: 1 }]);

    // Define animation sequences with rotationZ
    const createAnimationSequence = (yValues: string[], initialRotation: number) =>
      yValues.map((y, index) => {
        let rotation;
        if (y === '0%') {
          rotation = 0;
        } else if (index < yValues.indexOf('0%')) {
          rotation = initialRotation;
        } else {
          rotation = -initialRotation;
        }
        return { y, rotationZ: rotation };
      });

      const vaulRotation = -20;
    const vaulAnimationSequences = [
      createAnimationSequence(['-120%', '0%', '120%', '200%', '200%'], vaulRotation),
      createAnimationSequence(['-200%', '-200%', '0%', '120%', '200%', '200%'], vaulRotation),
      createAnimationSequence(['-200%', '-200%', '-120%', '0%', '120%', '200%'], vaulRotation),
      createAnimationSequence(['-200%', '-200%', '-200%', '-120%', '0%', '0%', '0%', '120%'], vaulRotation),
    ];

    const modalRotation = 20;
    const modalAnimationSequences = [
      createAnimationSequence(['-120%', '0%', '120%', '200%', '200%'], modalRotation),
      createAnimationSequence(['-200%', '-200%', '0%', '120%', '200%', '200%'], modalRotation),
      createAnimationSequence(['-200%', '-200%', '-120%', '0%', '120%', '200%'], modalRotation),
      createAnimationSequence(['-200%', '-200%', '-200%', '-120%', '0%', '0%', '0%', '120%'], modalRotation),
    ];

    const colonAnimationSequence = [
      { y: '0%' },
      { y: '0%' },
      { y: '0%' },
      { y: '0%' },
      { y: '0%' },
      { y: '0%' },
      { y: '0%' },
      { y: '100%' },
    ];

    // Animate vaul and modal elements in parallel
    elements.vaul.forEach((id, index) => {
      animateElement(id, vaulAnimationSequences[index]);
    });

    elements.modal.forEach((id, index) => {
      animateElement(id, modalAnimationSequences[index]);
    });

    // Animate colon
    animateElement(elements.colon, colonAnimationSequence);

    // Animate header text
    const animateHeaderText = (id: string, rotationZ = 0) => {
      const element = document.getElementById(id);
      if (element) {
        gsap.set(element.children, { x: 0, y: '-120%', opacity: 1, rotationZ: rotationZ });
        gsap.to(element.children, {
          x: 0,
          y: '0%',
          rotationZ: 0,
          duration: ANIMATION_DURATION * 1.5, // Slightly longer duration for header text
          delay: (colonAnimationSequence.length - 1.75) * DELAY_STEP,
          stagger: 0.1,
          ease: 'power2.out', // Slower ease for header text
        });
      }
    };

    animateHeaderText(elements.headerFirst, vaulRotation);
    animateHeaderText(elements.headerSecond, modalRotation);
  }, []);

  const className = 'whitespace-nowrap leading-none tracking-tighter text-7xl font-semibold text-[#1b3e35]';

  return (
    <div className="h-20 w-full overflow-hidden relative flex flex-col items-center justify-center mb-4">
      <div className="flex items-end justify-center gap-4">
        <div className="flex flex-col items-end justify-center h-full">
          <span id="vaul-0" className={cn('absolute opacity-0', className)}>
            V
          </span>
          <span id="vaul-1" className={cn('absolute opacity-0', className)}>
            a
          </span>
          <span id="vaul-2" className={cn('absolute opacity-0', className)}>
            u
          </span>
          <span id="vaul-3" className={cn('absolute opacity-0', className)}>
            l
          </span>
        </div>
        <span id="colon" className={cn('pr-[35%]', className)}>
          :
        </span>
        <div className="flex flex-col items-center justify-center h-full">
          <span id="modal-0" className={cn('absolute pl-5 opacity-0', className)}>
            M
          </span>
          <span id="modal-1" className={cn('absolute opacity-0', className)}>
            o
          </span>
          <span id="modal-2" className={cn('absolute opacity-0', className)}>
            d
          </span>
          <span id="modal-3" className={cn('absolute opacity-0', className)}>
            a
          </span>
        </div>
      </div>
      <div className="absolute flex items-center justify-center gap-2">
        <SplitText id="header-first" className={cn('-translate-y-[200%]', className)}>
          Vaul :
        </SplitText>
        <SplitText id="header-second" className={cn('-translate-y-[200%]', className)}>
          Modals
        </SplitText>
      </div>
    </div>
  );
};

export default AnimatedHeader;
