import { cn } from "@/lib/utils";
import logo from "@/assets/logo.png";

interface LogoProps {
  size?: number;
  className?: string;
}

/**
 * The core TreashLedger "T" mark. 
 * Use this for standalone brand icons.
 */
export function Logo({ size = 36, className }: LogoProps) {
  return (
    <img 
      src={logo} 
      alt="TreashLedger Logo" 
      className={cn("object-contain transform transition-transform", className)}
      style={{ width: size, height: size }}
    />
  );
}

/**
 * Full Brand Identity (Logo + "TreashLedger" text).
 * Use this for Headers, Footers, and Auth screens.
 */
export function LogoWithText({ 
  size = 36, 
  textClassName = "text-lg", 
  showTextOnMobile = false,
  className 
}: LogoProps & { textClassName?: string; showTextOnMobile?: boolean }) {
  return (
    <div className={cn("flex items-center gap-2.5 group", className)}>
      <Logo size={size} className="group-hover:scale-105 active:scale-95 transition-transform" />
      <span className={cn(
        "font-black text-foreground tracking-[0.10em] uppercase transition-colors",
        textClassName,
        !showTextOnMobile && "hidden sm:inline-block"
      )}>
        TreashLedger
      </span>
    </div>
  );
}
