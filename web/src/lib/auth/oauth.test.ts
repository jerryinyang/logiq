import { describe, it, expect, vi, beforeEach } from "vitest"
import {
  getAuthorizationUrl,
  exchangeCode,
  fetchProfile,
  encryptAccessToken,
  getOAuthProviders,
  validateState,
  generateState,
} from "./oauth"

const originalEnv = process.env

beforeEach(() => {
  vi.restoreAllMocks()
  process.env = { ...originalEnv }
  process.env.GITHUB_CLIENT_ID = "test-github-client"
  process.env.GITHUB_CLIENT_SECRET = "test-github-secret"
  process.env.GOOGLE_CLIENT_ID = "test-google-client"
  process.env.GOOGLE_CLIENT_SECRET = "test-google-secret"
  process.env.NEXT_PUBLIC_APP_URL = "http://localhost:3000"
})

describe("getAuthorizationUrl", () => {
  it("should generate authorization URL for GitHub", () => {
    const result = getAuthorizationUrl("github")

    expect(result.url).toContain("https://github.com/login/oauth/authorize")
    expect(result.url).toContain("client_id=test-github-client")
    expect(result.url).toContain("redirect_uri=" + encodeURIComponent("http://localhost:3000/api/auth/oauth/github/callback"))
    expect(result.url).toContain("scope=user%3Aemail")
    expect(result.url).toContain("response_type=code")
    expect(result.state).toBeDefined()
    expect(result.stateHash).toBeDefined()
    expect(result.state).not.toBe(result.stateHash)
    expect(result.cookieName).toBe("github_oauth_state")
  })

  it("should generate authorization URL for Google", () => {
    const result = getAuthorizationUrl("google")

    expect(result.url).toContain("https://accounts.google.com/o/oauth2/v2/auth")
    expect(result.url).toContain("client_id=test-google-client")
    expect(result.url).toContain("scope=email+profile")
    expect(result.cookieName).toBe("google_oauth_state")
  })

  it("should throw for unknown provider", () => {
    expect(() => getAuthorizationUrl("unknown")).toThrow("Unknown OAuth provider: unknown")
  })
})

describe("validateState", () => {
  it("should validate correct state", () => {
    const { state, hash } = generateState()
    expect(validateState(state, hash)).toBe(true)
  })

  it("should reject incorrect state", () => {
    const { state } = generateState()
    const wrongHash = "0".repeat(64)
    expect(validateState(state, wrongHash)).toBe(false)
  })
})

describe("exchangeCode", () => {
  it("should throw for unknown provider", async () => {
    await expect(exchangeCode("unknown", "code")).rejects.toThrow("Unknown OAuth provider: unknown")
  })

  it("should exchange code for tokens successfully", async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        access_token: "test-access-token",
        refresh_token: "test-refresh-token",
        expires_in: 3600,
      }),
    })

    const result = await exchangeCode("github", "test-code")

    expect(result.access_token).toBe("test-access-token")
    expect(result.refresh_token).toBe("test-refresh-token")
    expect(result.expires_in).toBe(3600)

    expect(globalThis.fetch).toHaveBeenCalledWith(
      "https://github.com/login/oauth/access_token",
      expect.objectContaining({
        method: "POST",
        headers: expect.objectContaining({
          "Content-Type": "application/x-www-form-urlencoded",
          Accept: "application/json",
        }),
      }),
    )
  })

  it("should handle OAuth error response", async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        error: "bad_verification_code",
        error_description: "The code passed is incorrect or expired.",
      }),
    })

    await expect(exchangeCode("github", "bad-code")).rejects.toThrow(
      "OAuth error: The code passed is incorrect or expired.",
    )
  })

  it("should handle non-ok response", async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 401,
      text: async () => "Unauthorized",
    })

    await expect(exchangeCode("github", "code")).rejects.toThrow(
      "Token exchange failed: 401 Unauthorized",
    )
  })
})

describe("fetchProfile", () => {
  it("should throw for unknown provider", async () => {
    await expect(fetchProfile("unknown", "token")).rejects.toThrow("Unknown OAuth provider: unknown")
  })

  it("should fetch GitHub profile with email", async () => {
    globalThis.fetch = vi.fn()
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ id: 12345, login: "testuser", name: "Test User", email: null }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => [{ email: "test@example.com", primary: true, verified: true }],
      })

    const profile = await fetchProfile("github", "test-token")

    expect(profile.id).toBe("12345")
    expect(profile.email).toBe("test@example.com")
    expect(profile.displayName).toBe("Test User")
  })

  it("should fetch GitHub profile without email API access", async () => {
    globalThis.fetch = vi.fn()
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ id: 12345, login: "testuser", name: "Test User", email: "test@example.com" }),
      })
      .mockResolvedValueOnce({
        ok: false,
        status: 404,
        text: async () => "Not Found",
      })

    const profile = await fetchProfile("github", "test-token")

    expect(profile.id).toBe("12345")
    expect(profile.email).toBe("test@example.com")
    expect(profile.displayName).toBe("Test User")
  })

  it("should fetch Google profile", async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ id: "67890", email: "user@gmail.com", name: "Google User" }),
    })

    const profile = await fetchProfile("google", "test-token")

    expect(profile.id).toBe("67890")
    expect(profile.email).toBe("user@gmail.com")
    expect(profile.displayName).toBe("Google User")
  })

  it("should handle profile fetch failure", async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 403,
      text: async () => "Forbidden",
    })

    await expect(fetchProfile("github", "bad-token")).rejects.toThrow(
      "Profile fetch failed: 403 Forbidden",
    )
  })
})

describe("encryptAccessToken", () => {
  it("should produce deterministic encryption for same input", () => {
    const token = "my-secret-token"
    const encrypted1 = encryptAccessToken(token)
    const encrypted2 = encryptAccessToken(token)
    expect(encrypted1).toBe(encrypted2)
  })

  it("should produce different output for different tokens", () => {
    const encrypted1 = encryptAccessToken("token-1")
    const encrypted2 = encryptAccessToken("token-2")
    expect(encrypted1).not.toBe(encrypted2)
  })

  it("should produce hex string of expected length", () => {
    const encrypted = encryptAccessToken("test-token")
    expect(encrypted).toMatch(/^[a-f0-9]{64}$/)
  })
})

describe("getOAuthProviders", () => {
  it("should have GitHub provider with correct URLs", () => {
    const providers = getOAuthProviders()
    const github = providers.github
    expect(github.authorizationUrl).toBe("https://github.com/login/oauth/authorize")
    expect(github.tokenUrl).toBe("https://github.com/login/oauth/access_token")
    expect(github.profileUrl).toBe("https://api.github.com/user")
    expect(github.scope).toBe("user:email")
  })

  it("should have Google provider with correct URLs", () => {
    const providers = getOAuthProviders()
    const google = providers.google
    expect(google.authorizationUrl).toBe("https://accounts.google.com/o/oauth2/v2/auth")
    expect(google.tokenUrl).toBe("https://oauth2.googleapis.com/token")
    expect(google.profileUrl).toBe("https://www.googleapis.com/oauth2/v2/userinfo")
    expect(google.scope).toBe("email profile")
  })

  it("should have client ids from environment", () => {
    const providers = getOAuthProviders()
    expect(providers.github.clientId).toBe("test-github-client")
    expect(providers.google.clientId).toBe("test-google-client")
  })
})
