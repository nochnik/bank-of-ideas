interface BarrelIconProps {
  size?: number
  color?: string
  strokeWidth?: number
  className?: string
}

export default function BarrelIcon({
  size = 16,
  color = 'currentColor',
  strokeWidth = 1.5,
  className,
}: BarrelIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M10 3a41 41 0 0 0 0 18m4-18a41 41 0 0 1 0 18" />
      <path d="M17 3a2 2 0 0 1 1.68.92a15.25 15.25 0 0 1 0 16.16A2 2 0 0 1 17 21H7a2 2 0 0 1-1.68-.92a15.25 15.25 0 0 1 0-16.16A2 2 0 0 1 7 3zM3.84 17h16.32M3.84 7h16.32" />
    </svg>
  )
}
