const Badge = ({ children, variant = "outline", className = "" }) => {
  const baseStyle =
    "inline-block text-xs font-medium px-2 py-0.5 rounded-full";

  const variants = {
    outline: "border border-gray-300 text-gray-700 bg-white",
    solid: "bg-blue-600 text-white",
    subtle: "bg-gray-100 text-gray-700",
  };

  return (
    <span className={`${baseStyle} ${variants[variant] || ""} ${className}`}>
      {children}
    </span>
  );
};

export default Badge;
