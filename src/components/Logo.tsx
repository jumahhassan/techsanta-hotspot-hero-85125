import { Wifi } from "lucide-react";

const Logo = () => {
  return (
    <div className="relative inline-flex items-center justify-center">
      {/* Wi-Fi signal icon */}
      <div className="relative flex h-10 w-10 items-center justify-center rounded-lg gradient-hero shadow-glow">
        <Wifi className="h-6 w-6 text-primary-foreground" />
      </div>
      {/* Santa hat overlay - positioned at top right */}
      <div className="absolute -top-1 -right-1">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Santa hat */}
          <path
            d="M12 3L6 12h12L12 3z"
            fill="hsl(var(--primary))"
            stroke="hsl(var(--primary-foreground))"
            strokeWidth="0.5"
          />
          {/* Hat brim */}
          <ellipse cx="12" cy="12" rx="7" ry="2" fill="hsl(var(--primary-foreground))" />
          {/* Pom-pom */}
          <circle cx="12" cy="3" r="2" fill="hsl(var(--primary-foreground))" />
        </svg>
      </div>
    </div>
  );
};

export default Logo;
