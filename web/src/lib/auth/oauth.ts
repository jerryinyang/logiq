import { randomBytes, createHash, timingSafeEqual } from "crypto"

export interface OAuthProviderConfig {
  clientId: string
  clientSecret: string
  authorizationUrl: string
  tokenUrl: string
  profileUrl: string
  scope: string
  profileParser: (raw: Record<string, unknown>) => { id: string; email: string; displayName: string }
}

export interface OAuthTokenResponse {
  access_token: string
  refresh_token?: string
  expires_in?: number
}

function encryptToken(token: string): string {
  const cipher = createHash("sha256").update(token).digest("hex")
  return cipher
}

function generateState(): { state: string; hash: string } {
  const state = randomBytes(32).toString("hex")
  const hash = createHash("sha256").update(state).digest("hex")
  return { state, hash }
}

function validateState(state: string, stateHash: string): boolean {
  const computedHash = createHash("sha256").update(state).digest("hex")
  if (computedHash.length !== stateHash.length) return false
  return timingSafeEqual(Buffer.from(computedHash), Buffer.from(stateHash))
}

function getStateCookieName(provider: string): string {
  return `${provider}_oauth_state`
}

export function getOAuthProviders(): Record<string, OAuthProviderConfig> {
  return {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID ?? "",
      clientSecret: process.env.GITHUB_CLIENT_SECRET ?? "",
      authorizationUrl: "https://github.com/login/oauth/authorize",
      tokenUrl: "https://github.com/login/oauth/access_token",
      profileUrl: "https://api.github.com/user",
      scope: "user:email",
      profileParser: (raw) => ({
        id: String(raw.id),
        email: String(raw.email ?? ""),
        displayName: String(raw.name ?? raw.login ?? ""),
      }),
    },
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
      authorizationUrl: "https://accounts.google.com/o/oauth2/v2/auth",
      tokenUrl: "https://oauth2.googleapis.com/token",
      profileUrl: "https://www.googleapis.com/oauth2/v2/userinfo",
      scope: "email profile",
      profileParser: (raw) => ({
        id: String(raw.id),
        email: String(raw.email ?? ""),
        displayName: String(raw.name ?? ""),
      }),
    },
  }
}

export function getAuthorizationUrl(provider: string): {
  url: string
  state: string
  stateHash: string
  cookieName: string
} {
  const providers = getOAuthProviders()
  const config = providers[provider]
  if (!config) {
    throw new Error(`Unknown OAuth provider: ${provider}`)
  }

  const { state, hash } = generateState()
  const baseUrl = (process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000").replace(/\/+$/, "")
  const callbackUrl = `${baseUrl}/api/auth/oauth/${provider}/callback`

  const params = new URLSearchParams({
    client_id: config.clientId,
    redirect_uri: callbackUrl,
    scope: config.scope,
    state: hash,
    response_type: "code",
  })

  return {
    url: `${config.authorizationUrl}?${params.toString()}`,
    state,
    stateHash: hash,
    cookieName: getStateCookieName(provider),
  }
}

export async function exchangeCode(
  provider: string,
  code: string,
): Promise<OAuthTokenResponse> {
  const providers = getOAuthProviders()
  const config = providers[provider]
  if (!config) {
    throw new Error(`Unknown OAuth provider: ${provider}`)
  }

  const baseUrl = (process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000").replace(/\/+$/, "")
  const callbackUrl = `${baseUrl}/api/auth/oauth/${provider}/callback`

  const body = new URLSearchParams({
    client_id: config.clientId,
    client_secret: config.clientSecret,
    code,
    redirect_uri: callbackUrl,
    grant_type: "authorization_code",
  })

  const response = await fetch(config.tokenUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Accept: "application/json",
    },
    body: body.toString(),
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`Token exchange failed: ${response.status} ${errorText}`)
  }

  const data = await response.json()

  if (data.error) {
    throw new Error(`OAuth error: ${data.error_description ?? data.error}`)
  }

  return {
    access_token: data.access_token,
    refresh_token: data.refresh_token,
    expires_in: data.expires_in,
  }
}

export async function fetchProfile(
  provider: string,
  accessToken: string,
): Promise<{ id: string; email: string; displayName: string }> {
  const providers = getOAuthProviders()
  const config = providers[provider]
  if (!config) {
    throw new Error(`Unknown OAuth provider: ${provider}`)
  }

  const response = await fetch(config.profileUrl, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: "application/json",
      "User-Agent": "logiq-app",
    },
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`Profile fetch failed: ${response.status} ${errorText}`)
  }

  const raw = await response.json()

  if (provider === "github") {
    const emailResponse = await fetch("https://api.github.com/user/emails", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/json",
        "User-Agent": "logiq-app",
      },
    })
    if (emailResponse.ok) {
      const emails: Array<{ email: string; primary: boolean; verified: boolean }> = await emailResponse.json()
      const primary = emails.find((e) => e.primary && e.verified)
      if (primary) {
        raw.email = primary.email
      }
    }
  }

  return config.profileParser(raw)
}

export function encryptAccessToken(token: string): string {
  return encryptToken(token)
}

export { getStateCookieName, generateState, validateState }
