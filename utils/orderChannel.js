import dns from "node:dns/promises";
import net from "node:net";

const MAX_REDIRECTS = 5;
const REQUEST_TIMEOUT = 5000;

const WHATSAPP_HOSTS = new Set([
  "wa.me",
  "api.whatsapp.com",
  "web.whatsapp.com",
  "whatsapp.com",
]);

const isWhatsAppHost = (hostname) => {
  const host = hostname.toLowerCase().replace(/\.$/, "");

  if (WHATSAPP_HOSTS.has(host)) {
    return true;
  }

  return host.endsWith(".whatsapp.com");
};

const isPrivateIp = (ip) => {
  const version = net.isIP(ip);

  if (version === 4) {
    const parts = ip.split(".").map(Number);

    const [a, b] = parts;

    if (a === 0) return true;

    if (a === 10) return true;

    if (a === 127) return true;

    if (a === 169 && b === 254) {
      return true;
    }

    if (a === 172 && b >= 16 && b <= 31) {
      return true;
    }

    if (a === 192 && b === 168) {
      return true;
    }

    if (a === 100 && b >= 64 && b <= 127) {
      return true;
    }

    return false;
  }

  if (version === 6) {
    const normalized = ip.toLowerCase();

    if (normalized === "::1") {
      return true;
    }

    if (normalized === "::") {
      return true;
    }

    if (
      normalized.startsWith("fc") ||
      normalized.startsWith("fd")
    ) {
      return true;
    }

    if (
      normalized.startsWith("fe8") ||
      normalized.startsWith("fe9") ||
      normalized.startsWith("fea") ||
      normalized.startsWith("feb")
    ) {
      return true;
    }

    return false;
  }

  return true;
};

const assertSafeUrl = async (value) => {
  let parsed;

  try {
    parsed = new URL(value);
  } catch {
    throw new Error("INVALID_URL");
  }

  if (!["http:", "https:"].includes(parsed.protocol)) {
    throw new Error("UNSUPPORTED_PROTOCOL");
  }

  const hostname = parsed.hostname.toLowerCase();

  if (
    hostname === "localhost" ||
    hostname.endsWith(".localhost") ||
    hostname.endsWith(".local") ||
    hostname.endsWith(".internal")
  ) {
    throw new Error("PRIVATE_HOST");
  }

  if (net.isIP(hostname)) {
    if (isPrivateIp(hostname)) {
      throw new Error("PRIVATE_IP");
    }

    return parsed;
  }

  const addresses = await dns.lookup(hostname, {
    all: true,
  });

  if (!addresses.length) {
    throw new Error("DNS_RESOLUTION_FAILED");
  }

  for (const address of addresses) {
    if (isPrivateIp(address.address)) {
      throw new Error("PRIVATE_IP");
    }
  }

  return parsed;
};

const fetchRedirectDestination = async (initialUrl) => {
  let currentUrl = initialUrl;

  for (
    let redirectCount = 0;
    redirectCount <= MAX_REDIRECTS;
    redirectCount++
  ) {
    const safeUrl = await assertSafeUrl(currentUrl);

    const controller = new AbortController();

    const timeout = setTimeout(() => {
      controller.abort();
    }, REQUEST_TIMEOUT);

    let response;

    try {
      response = await fetch(safeUrl, {
        method: "HEAD",
        redirect: "manual",
        signal: controller.signal,
        headers: {
          "User-Agent":
            "Mozilla/5.0 (compatible; OrderChannelDetector/1.0)",
        },
      });
    } catch {
      response = await fetch(safeUrl, {
        method: "GET",
        redirect: "manual",
        signal: controller.signal,
        headers: {
          "User-Agent":
            "Mozilla/5.0 (compatible; OrderChannelDetector/1.0)",
        },
      });
    } finally {
      clearTimeout(timeout);
    }

    const location = response.headers.get("location");

    if (
      [301, 302, 303, 307, 308].includes(response.status) &&
      location
    ) {
      currentUrl = new URL(
        location,
        safeUrl,
      ).toString();

      continue;
    }

    return {
      finalUrl: safeUrl.toString(),
      status: response.status,
    };
  }

  throw new Error("TOO_MANY_REDIRECTS");
};

export const detectOrderChannel = async (inputUrl) => {
  const url = String(inputUrl || "").trim();

  if (!url) {
    return {
      orderChannel: null,
      finalUrl: null,
    };
  }

  let parsed;

  try {
    parsed = new URL(url);
  } catch {
    return {
      orderChannel: "external",
      finalUrl: url,
    };
  }

  if (isWhatsAppHost(parsed.hostname)) {
    return {
      orderChannel: "whatsapp",
      finalUrl: parsed.toString(),
    };
  }

  try {
    const result = await fetchRedirectDestination(
      parsed.toString(),
    );

    const finalParsed = new URL(result.finalUrl);

    if (isWhatsAppHost(finalParsed.hostname)) {
      return {
        orderChannel: "whatsapp",
        finalUrl: finalParsed.toString(),
      };
    }

    return {
      orderChannel: "external",
      finalUrl: finalParsed.toString(),
    };
  } catch (error) {
    console.warn(
      "ORDER CHANNEL DETECTION WARNING:",
      error.message,
    );

    return {
      orderChannel: "external",
      finalUrl: url,
    };
  }
};