"use client";

import React from "react";

interface AsciiHeadingProps {
  text: string;
  className?: string;
  as?: "h1" | "h2" | "h3" | "span";
}

export const AsciiHeading: React.FC<AsciiHeadingProps> = ({
  text,
  className = "",
  as: Tag = "h1",
}) => {
  return (
    <Tag
      className={`font-ascii text-brand leading-none glitch-text ${className}`}
      data-text={text}
    >
      {text}
    </Tag>
  );
};
