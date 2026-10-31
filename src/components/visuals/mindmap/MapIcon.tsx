"use client";

import { createElement, type SVGProps } from "react";
import { getIcon } from "./icons";

type MapIconProps = {
  name?: string;
} & SVGProps<SVGSVGElement>;

/**
 * Renders a registry icon by name. `createElement` keeps the resolved
 * component out of a render-time local (react-hooks/static-components).
 */
export function MapIcon({ name, ...props }: MapIconProps) {
  if (!name) return null;
  return createElement(getIcon(name), props);
}
