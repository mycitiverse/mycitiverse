import React from "react";

export function Input({
  type = "text",
  placeholder,
  value,
  onChange,
  className = "",
  name,
  id,
  ...rest
}) {
  return (
    <input
      type={type}
      id={id}
      name={name}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className={`px-4 py-2 border rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
      {...rest}
    />
  );
}
