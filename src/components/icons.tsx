type IconProps = {
  className?: string
}

export function ArrowUpRight({ className }: IconProps) {
  return (
    <svg
      className={className}
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.25"
      strokeLinecap="square"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M4.25 11.75 11.75 4.25M5.75 4.25h6v6" />
    </svg>
  )
}

export function ArrowUp({ className }: IconProps) {
  return (
    <svg
      className={className}
      width="12"
      height="12"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.25"
      strokeLinecap="square"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M8 13.25V2.75M3.25 7.25 8 2.5l4.75 4.75" />
    </svg>
  )
}

export function Lock({ className }: IconProps) {
  return (
    <svg
      className={className}
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
      aria-hidden="true"
      focusable="false"
    >
      <rect x="2.25" y="5.25" width="7.5" height="5" />
      <path d="M4 5.25V3.75a2 2 0 0 1 4 0v1.5" />
    </svg>
  )
}
