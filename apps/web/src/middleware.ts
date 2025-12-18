import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export const config = {
  matcher: ['/admin/:path*'],
}

function unauthorized() {
  return new NextResponse('Unauthorized', {
    status: 401,
    headers: {
      'WWW-Authenticate': 'Basic realm="Admin Area"',
    },
  })
}

export function middleware(req: NextRequest) {
  const auth = req.headers.get('authorization')
  if (!auth?.startsWith('Basic ')) return unauthorized()

  const base64 = auth.slice('Basic '.length)
  const decoded = Buffer.from(base64, 'base64').toString('utf8')
  const [user, pass] = decoded.split(':')

  const expectedUser = process.env.ADMIN_USER
  const expectedPass = process.env.ADMIN_PASS
  
  if (!expectedUser || !expectedPass) return unauthorized()
    if (user !== expectedUser || pass !== expectedPass) return unauthorized()
  return NextResponse.next()
}
