import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function getDisplayName(user) {
  if (!user) return "Guest";
  const name = user.name?.trim();
  if (name && name.toLowerCase() !== "user") return name;
  if (user.email) return user.email.split("@")[0];
  return "Guest";
}
