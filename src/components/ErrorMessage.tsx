import React from "react";

export function ErrorMessage({ message }: { message: string; }) {
  return (
    <p className="error">
      {message}
    </p>
  );
}
