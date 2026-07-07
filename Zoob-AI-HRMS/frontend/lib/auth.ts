export interface AuthUser {
  name: string;
  role: string;
  email: string;
}

export function getStoredToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
}

export function getAuthUser(): AuthUser | null {
  const token = getStoredToken();
  if (!token) return null;

  const payload = token.split(".")[1];
  if (!payload) return null;

  try {
    const decoded = JSON.parse(
      atob(payload.replace(/-/g, "+").replace(/_/g, "/"))
    );

    return {
      name: decoded.full_name || decoded.email || "User",
      role: decoded.role || "employee",
      email: decoded.email || "",
    };
  } catch (error) {
    console.error("Failed to decode token", error);
    return null;
  }
}

export function getRoleDashboardPath(role: string) {
  switch (role) {
    case "admin":
      return "/admin/dashboard";
    case "hr":
      return "/hr/dashboard";
    case "manager":
      return "/manager/dashboard";
    default:
      return "/employee/dashboard";
  }
}
