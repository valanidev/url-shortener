import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { UAParser } from "ua-parser-js"

async function getCountryFromIp(ip: string): Promise<string> {
  if (ip === "127.0.0.1" || ip === "::1") return "Inconnu"

  try {
    const response = await fetch(
      `http://ip-api.com/json/${ip}?fields=countryCode`,
      {
        signal: AbortSignal.timeout(1500),
      }
    )
    if (!response.ok) return "Inconnu"
    const data = await response.json()
    return data.countryCode || "Inconnu"
  } catch {
    return "Inconnu"
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  const { code } = await params

  const link = await prisma.link.findUnique({
    where: { shortCode: code },
  })

  if (!link) {
    return NextResponse.redirect(new URL("/404", request.url))
  }

  if (!link.isActive) {
    return NextResponse.json(
      { error: "Ce lien a été temporairement désactivé par son propriétaire" },
      { status: 403 }
    )
  }

  if (link.expiresAt !== null && new Date(link.expiresAt) < new Date()) {
    return NextResponse.redirect(new URL("/404", request.url))
  }

  const userAgent = request.headers.get("user-agent") || ""
  const parser = new UAParser(userAgent)
  const os = parser.getOS().name || "Inconnu"
  const browser = parser.getBrowser().name || "Inconnu"

  const rawIp =
    request.headers.get("x-forwarded-for")?.split(",")[0] || "127.0.0.1"

  getCountryFromIp(rawIp)
    .then((country) => {
      return prisma.click.create({
        data: {
          linkId: link.id,
          os,
          browser,
          country,
        },
      })
    })
    .catch((err) => console.error("Erreur enregistrement clic:", err))

  return NextResponse.redirect(link.originalUrl, { status: 302 })
}
