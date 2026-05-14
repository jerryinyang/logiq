export const userRole = ["user", "creator", "admin"] as const;

export type UserRole = (typeof userRole)[number];