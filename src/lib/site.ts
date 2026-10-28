export const site = {
  name: "Graftsoft",
  url: "https://www.graftsoft.com/",
  domain: "www.graftsoft.com",
  telegram: "https://t.me/pluswhale",
  telegramHandle: "t.me/pluswhale",
} as const;

export function absoluteUrl(path = "/") {
  return new URL(path, site.url).toString();
}
