export const Logo = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 100 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    {/* Rounded Rectangle Body */}
    <rect
      x="12"
      y="38"
      width="76"
      height="52"
      rx="8"
      stroke="currentColor"
      strokeWidth="6"
    />
    
    {/* Bag Handles */}
    <path
      d="M38 38C38 24 62 24 62 38"
      stroke="currentColor"
      strokeWidth="4"
      strokeLinecap="round"
      fill="none"
    />
    <path
      d="M32 38C32 16 68 16 68 38"
      stroke="currentColor"
      strokeWidth="4"
      strokeLinecap="round"
      fill="none"
    />

    {/* Center W */}
    <text
      x="50"
      y="78"
      fill="currentColor"
      fontSize="48"
      fontWeight="900"
      fontFamily="Inter, system-ui, sans-serif"
      textAnchor="middle"
    >
      W
    </text>
  </svg>
);
