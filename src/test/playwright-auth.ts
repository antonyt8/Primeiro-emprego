import type { Page } from "@playwright/test";

export interface PlaywrightAuthCredentials {
  email: string;
  password: string;
}

const backendBaseUrl = "http://localhost:8000";

const apiHeaders = {
  Accept: "application/json",
  "Content-Type": "application/json",
};

export async function tokenLogin(page: Page, credentials: PlaywrightAuthCredentials) {
  const loginResponse = await page.request.post(`${backendBaseUrl}/api/auth/login`, {
    data: credentials,
    headers: apiHeaders,
  });

  const { token } = (await loginResponse.json()) as { token: string };
  return token;
}

export async function tokenLogout(page: Page, token: string) {
  await page.request.post(`${backendBaseUrl}/api/auth/logout`, {
    headers: {
      ...apiHeaders,
      Authorization: `Bearer ${token}`,
    },
  });
}
