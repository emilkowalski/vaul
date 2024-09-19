export function Logo({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 300 300" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g clipPath="url(#clip0_22_64)">
        <path
          d="M52.8887 0C23.6791 0 0 23.8341 0 53.2349V207.6H300V53.2349C300 23.8341 276.321 0 247.111 0H52.8887Z"
          fill="url(#paint0_radial_22_64)"
        />
        <path
          opacity="0.1"
          fillRule="evenodd"
          clipRule="evenodd"
          d="M62 0H60V56L0 56V58L60 58V114H0V116H60V165H62V116L120 116V165H122V116H180V165H182V116L240 116V165H242V116H301V114H242V58L301 58V56L242 56V0H240V56H182V0H180V56L122 56V0H120V56H62V0ZM240 114V58H182V114L240 114ZM180 114V58L122 58V114H180ZM120 114V58H62V114L120 114Z"
          fill="black"
        />
        <g filter="url(#filter0_dd_22_64)">
          <path
            d="M247.111 111.6H52.8887C23.6791 111.6 0 135.392 0 164.742H300C300 135.392 276.321 111.6 247.111 111.6Z"
            fill="url(#paint1_radial_22_64)"
            fillOpacity="0.01"
            shapeRendering="crispEdges"
          />
        </g>
        <g filter="url(#filter1_i_22_64)">
          <path
            d="M247.111 111.6H52.8887C23.6791 111.6 0 135.393 0 164.743V246.858C0 276.207 23.6791 300 52.8887 300H247.111C276.321 300 300 276.207 300 246.858V164.743C300 135.393 276.321 111.6 247.111 111.6Z"
            fill="url(#paint2_radial_22_64)"
          />
        </g>
        <g filter="url(#filter2_di_22_64)">
          <rect x="110" y="128" width="80" height="14" rx="7" fill="#999999" />
        </g>
      </g>
      <defs>
        <filter
          id="filter0_dd_22_64"
          x="-14"
          y="85.5996"
          width="328"
          height="81.1426"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset dy="-2" />
          <feGaussianBlur stdDeviation="2" />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
          <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_22_64" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset dy="-12" />
          <feGaussianBlur stdDeviation="7" />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.15 0" />
          <feBlend mode="normal" in2="effect1_dropShadow_22_64" result="effect2_dropShadow_22_64" />
          <feBlend mode="normal" in="SourceGraphic" in2="effect2_dropShadow_22_64" result="shape" />
        </filter>
        <filter
          id="filter1_i_22_64"
          x="0"
          y="111.6"
          width="300"
          height="192.4"
          filterUnits="userSpaceOnUse"
          colorInterpolation="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset dy="4" />
          <feGaussianBlur stdDeviation="2" />
          <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
          <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 1 0" />
          <feBlend mode="normal" in2="shape" result="effect1_innerShadow_22_64" />
        </filter>
        <filter
          id="filter2_di_22_64"
          x="106"
          y="126"
          width="88"
          height="22"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset dy="2" />
          <feGaussianBlur stdDeviation="2" />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 1 0" />
          <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_22_64" />
          <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_22_64" result="shape" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset dy="2" />
          <feGaussianBlur stdDeviation="2" />
          <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
          <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
          <feBlend mode="normal" in2="shape" result="effect2_innerShadow_22_64" />
        </filter>
        <radialGradient
          id="paint0_radial_22_64"
          cx="0"
          cy="0"
          r="1"
          gradientUnits="userSpaceOnUse"
          gradientTransform="translate(150 111.5) rotate(-90) scale(116 257)"
        >
          <stop stopColor="#8D8D8D" />
          <stop offset="1" stopColor="#2F2F2F" />
        </radialGradient>
        <radialGradient
          id="paint1_radial_22_64"
          cx="0"
          cy="0"
          r="1"
          gradientUnits="userSpaceOnUse"
          gradientTransform="translate(150 112) rotate(90) scale(188 345)"
        >
          <stop stopColor="white" />
          <stop offset="1" stopColor="#D2D2D2" />
        </radialGradient>
        <radialGradient
          id="paint2_radial_22_64"
          cx="0"
          cy="0"
          r="1"
          gradientUnits="userSpaceOnUse"
          gradientTransform="translate(150 112) rotate(90) scale(188 345)"
        >
          <stop stopColor="white" />
          <stop offset="1" stopColor="#D2D2D2" />
        </radialGradient>
        <clipPath id="clip0_22_64">
          <rect width="300" height="300" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
}
