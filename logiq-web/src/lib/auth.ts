const API_BASE = "/api/auth";

interface LoginResponse {
  token?: string;
  user?: {
    id: string;
    name: string;
    email: string;
  };
  error?: string;
}

interface ApiResponse {
  error?: string;
  message?: string;
}

export const authApi = {
  async login(email: string, password: string): Promise<LoginResponse> {
    const res = await fetch(`${API_BASE}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    return res.json();
  },

  async register(name: string, email: string, password: string): Promise<ApiResponse> {
    const res = await fetch(`${API_BASE}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });
    return res.json();
  },

  async forgotPassword(email: string): Promise<ApiResponse> {
    const res = await fetch(`${API_BASE}/forgot-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    return res.json();
  },

  async verifyOtp(email: string, otp: string): Promise<ApiResponse> {
    const res = await fetch(`${API_BASE}/verify-otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, otp }),
    });
    return res.json();
  },

  async resendOtp(email: string): Promise<ApiResponse> {
    const res = await fetch(`${API_BASE}/resend-otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    return res.json();
  },

  async resetPassword(token: string, password: string): Promise<ApiResponse> {
    const res = await fetch(`${API_BASE}/reset-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, password }),
    });
    return res.json();
  },
};