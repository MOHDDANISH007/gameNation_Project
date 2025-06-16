import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET() {
  const token = cookies().get('token')?.value

  if (token) {
    return NextResponse.json({ authenticated: true })
  } else {
    return NextResponse.json({ authenticated: false }, { status: 401 })
  }
}
