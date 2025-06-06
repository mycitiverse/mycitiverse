// src/components/card.jsx

import React from 'react';

export const Card = ({ children }) => (
  <div className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
    {children}
  </div>
);

export const CardHeader = ({ children }) => (
  <div className="p-4 border-b bg-gray-50">{children}</div>
);

export const CardTitle = ({ children }) => (
  <h3 className="text-xl font-bold text-gray-800 mb-2">{children}</h3>
);

export const CardContent = ({ children }) => (
  <div className="p-4 text-gray-700 text-sm">{children}</div>
);

export const CardDescription = ({ children, className = "" }) => (
  <p className={`text-sm text-muted-foreground ${className}`}>{children}</p>
);
