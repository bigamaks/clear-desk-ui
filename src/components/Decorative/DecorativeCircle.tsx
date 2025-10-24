interface DecorativeCircleProps {
  position: "top-right" | "bottom-left" | "top-left" | "bottom-right";
  size?: "sm" | "md" | "lg";
  className?: string;
}

const DecorativeCircle = ({ position, size = "lg", className = "" }: DecorativeCircleProps) => {
  const sizeClasses = {
    sm: "w-32 h-32 md:w-48 md:h-48",
    md: "w-48 h-48 md:w-64 md:h-64",
    lg: "w-64 h-64 md:w-96 md:h-96",
  };

  const positionClasses = {
    "top-right": "-top-16 -right-16 md:-top-24 md:-right-24",
    "bottom-left": "-bottom-16 -left-16 md:-bottom-24 md:-left-24",
    "top-left": "-top-16 -left-16 md:-top-24 md:-left-24",
    "bottom-right": "-bottom-16 -right-16 md:-bottom-24 md:-right-24",
  };

  return (
    <div
      className={`absolute ${positionClasses[position]} ${sizeClasses[size]} rounded-full bg-gradient-to-br from-primary/20 to-primary/5 blur-3xl pointer-events-none ${className}`}
      aria-hidden="true"
    />
  );
};

export default DecorativeCircle;
