// src/components/Card.jsx

import React from 'react';

export const Card = ({ children }) => {
  return (
    <div className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      {children}
    </div>
  );
};

export const CardHeader = ({ image }) => {
  return image ? (
    <div className="h-48 w-full overflow-hidden">
      <img src={image} alt="Card Header" className="w-full h-full object-cover" />
    </div>
  ) : null;
};

export const CardTitle = ({ title }) => {
  return (
    <h3 className="text-xl font-bold text-gray-800 mb-2">
      {title}
    </h3>
  );
};

export const CardContent = ({ children }) => {
  return (
    <div className="p-4 text-gray-700 text-sm">
      {children}
    </div>
  );
};

export function CardDescription({ children }) {
  return <p className="text-sm text-muted-foreground">{children}</p>;
};
