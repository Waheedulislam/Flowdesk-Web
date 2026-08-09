import { LoaderCircle } from "lucide-react";

import { cn } from "@/lib/utils";

/**
 * A spinning loader for buttons and inline loading states.
 * Respects reduced-motion via the global stylesheet's animation reset.
 */
function Spinner({
  className,
  ...props
}: React.ComponentProps<typeof LoaderCircle>) {
  return (
    <LoaderCircle
      role="status"
      aria-label="Loading"
      className={cn("size-4 animate-spin", className)}
      {...props}
    />
  );
}

export { Spinner };
