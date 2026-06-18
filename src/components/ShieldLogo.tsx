interface ShieldLogoProps {
  size?: number;
}

export default function ShieldLogo({ size = 36 }: ShieldLogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 36 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="ICS shield logo"
    >
      <path
        d="M18 2L4 8V20C4 27.18 10.18 33.36 18 35C25.82 33.36 32 27.18 32 20V8L18 2Z"
        fill="#F5C020"
      />
      <path
        d="M18 2L4 8V20C4 27.18 10.18 33.36 18 35C25.82 33.36 32 27.18 32 20V8L18 2Z"
        fill="none"
        stroke="#0a2240"
        strokeWidth="1.5"
      />
      <line x1="18" y1="2" x2="18" y2="35" stroke="#0a2240" strokeWidth="1.5" />
      <line x1="4" y1="18" x2="32" y2="18" stroke="#0a2240" strokeWidth="1.5" />
    </svg>
  );
}
