import * as React from "react";

import { cn, getInitials } from "@/lib/utils";

interface AvatarProps extends React.ComponentProps<"span"> {
  /** Image source; falls back to initials when absent or on load error. */
  src?: string;
  /** Full name, used for initials and the accessible label. */
  name: string;
}

/**
 * Lightweight avatar with a graceful initials fallback.
 * Kept dependency-free (no next/image) so it drops in anywhere.
 */
function Avatar({ src, name, className, ...props }: AvatarProps) {
  const [errored, setErrored] = React.useState(false);
  const showImage = src && !errored;

  return (
    <span
      className={cn(
        "relative flex size-9 shrink-0 select-none items-center justify-center overflow-hidden rounded-full bg-accent text-accent-foreground",
        className,
      )}
      role="img"
      aria-label={name}
      {...props}
    >
      {showImage ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={name}
          className="size-full object-cover"
          onError={() => setErrored(true)}
        />
      ) : (
        <span className="text-xs font-semibold tracking-wide">
          {getInitials(name)}
        </span>
      )}
    </span>
  );
}

export { Avatar };
