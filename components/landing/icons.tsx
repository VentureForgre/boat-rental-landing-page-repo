import type { ReactNode, SVGProps } from "react";

export type IconProps = SVGProps<SVGSVGElement> & {
  title?: string;
};

type BaseIconProps = IconProps & {
  children: ReactNode;
};

function BaseIcon({ children, title, ...props }: BaseIconProps) {
  return (
    <svg
      aria-hidden={title ? undefined : true}
      fill="none"
      role={title ? "img" : "presentation"}
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.8}
      viewBox="0 0 24 24"
      {...props}
    >
      {title ? <title>{title}</title> : null}
      {children}
    </svg>
  );
}

export function BadgeIcon(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <path d="m12 3.5 2.6 2.1 3.3.4.8 3.2 2.3 2.4-1.6 2.9.2 3.3-3.1 1.1-2 2.6-3.1-1.1-3.1 1.1-2-2.6-3.1-1.1.2-3.3L1.7 12l2.3-2.4.8-3.2 3.3-.4L12 3.5Z" />
      <path d="m9.5 12.4 1.7 1.7 3.6-4" />
    </BaseIcon>
  );
}

export function CalendarIcon(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <path d="M7 3.5v3" />
      <path d="M17 3.5v3" />
      <path d="M4 7.5h16" />
      <rect height="14" rx="2.5" width="18" x="3" y="5.5" />
      <path d="M8 11.5h3" />
      <path d="M13 11.5h3" />
      <path d="M8 15.5h3" />
      <path d="M13 15.5h3" />
    </BaseIcon>
  );
}

export function CameraIcon(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <path d="M6.5 7.5h2l1.5-2h4l1.5 2h2A2.5 2.5 0 0 1 20 10v7A2.5 2.5 0 0 1 17.5 19h-11A2.5 2.5 0 0 1 4 17v-7a2.5 2.5 0 0 1 2.5-2.5Z" />
      <circle cx="12" cy="13" r="3.5" />
    </BaseIcon>
  );
}

export function GlobeIcon(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M3.8 12h16.4" />
      <path d="M12 3.5c2.4 2.2 3.8 5.2 3.8 8.5S14.4 18.3 12 20.5c-2.4-2.2-3.8-5.2-3.8-8.5S9.6 5.7 12 3.5Z" />
    </BaseIcon>
  );
}

export function LocationIcon(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <path d="M12 20.5s6-5.4 6-10.2a6 6 0 1 0-12 0c0 4.8 6 10.2 6 10.2Z" />
      <circle cx="12" cy="10.2" r="2.2" />
    </BaseIcon>
  );
}

export function MailIcon(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <rect height="13" rx="2.5" width="18" x="3" y="5.5" />
      <path d="m4.5 7 7.5 5.5L19.5 7" />
    </BaseIcon>
  );
}

export function SailingIcon(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <path d="M11 4.5v12" />
      <path d="M11 5 6 13h5" />
      <path d="M11 6.5 19 14h-8" />
      <path d="M4 18c1 .9 2.2 1.5 3.5 1.5S10 18.9 11 18c1 .9 2.2 1.5 3.5 1.5S17 18.9 18 18c.9.9 2 1.5 3 1.5" />
    </BaseIcon>
  );
}

export function SearchIcon(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <circle cx="11" cy="11" r="5.5" />
      <path d="m15.5 15.5 4 4" />
    </BaseIcon>
  );
}

export function ShareIcon(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <circle cx="18" cy="5.5" r="2.5" />
      <circle cx="6" cy="12" r="2.5" />
      <circle cx="18" cy="18.5" r="2.5" />
      <path d="m8.3 10.8 7.4-3.9" />
      <path d="m8.3 13.2 7.4 3.9" />
    </BaseIcon>
  );
}

export function SparklesIcon(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <path d="m12 4.5 1.2 3.3 3.3 1.2-3.3 1.2L12 13.5l-1.2-3.3-3.3-1.2 3.3-1.2L12 4.5Z" />
      <path d="m18.5 13.5.8 2.2 2.2.8-2.2.8-.8 2.2-.8-2.2-2.2-.8 2.2-.8.8-2.2Z" />
      <path d="m6 14.5.9 2.5 2.6.9-2.6.9L6 21.5l-.9-2.7-2.6-.9 2.6-.9.9-2.5Z" />
    </BaseIcon>
  );
}

export function VerifiedIcon(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <path d="M12 3.5 5.5 6v5.3c0 4.2 2.7 7.9 6.5 9.2 3.8-1.3 6.5-5 6.5-9.2V6L12 3.5Z" />
      <path d="m9.4 12.1 1.8 1.8 3.5-3.8" />
    </BaseIcon>
  );
}

export const landingIcons = {
  badge: BadgeIcon,
  calendar: CalendarIcon,
  camera: CameraIcon,
  globe: GlobeIcon,
  location: LocationIcon,
  mail: MailIcon,
  sailing: SailingIcon,
  search: SearchIcon,
  share: ShareIcon,
  sparkles: SparklesIcon,
  verified: VerifiedIcon,
} as const;
