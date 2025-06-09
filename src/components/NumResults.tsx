import React from "react";

export function NumResults({ length }: { length: number; }) {
  return (
    <p className="num-results">
      Found <strong>{length}</strong> results
    </p>
  );
}
