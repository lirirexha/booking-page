export function requireAdmin(request: Request) {
  const auth = request.headers.get('authorization')
  if (!auth?.startsWith('Basic ')) throw new Error('UNAUTHORIZED')

  const decoded = Buffer.from(auth.slice(6), 'base64').toString('utf8')
  const [user, pass] = decoded.split(':')

  if (!process.env.ADMIN_USER || !process.env.ADMIN_PASS) throw new Error('UNAUTHORIZED')
  if (user !== process.env.ADMIN_USER || pass !== process.env.ADMIN_PASS) throw new Error('UNAUTHORIZED')
}
