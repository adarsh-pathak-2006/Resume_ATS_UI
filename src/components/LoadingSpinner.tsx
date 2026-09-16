'use client';

import React from 'react';

export default function LoadingSpinner({ text = 'Loading...' }: { text?: string }) {
  return (
    <div className="spinner-overlay">
      <div className="spinner" />
      <span className="spinner-text">{text}</span>
    </div>
  );
}

export function SpinnerSmall() {
  return <div className="spinner spinner-sm" />;
}
