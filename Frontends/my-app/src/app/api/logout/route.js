import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'


export async function POST() {
  const response = NextResponse.json({ message: 'Logged out successfully' })
  console.log("Response is : ", response)

  // Delete cookie using same options used when setting it
  const cookieStore = cookies()
  const getCookiesFromStore = cookieStore.getAll()
  console.log("Cookie Store is : ", cookieStore)

  console.log("Cookies From Store is : ", getCookiesFromStore)
  response.cookies.set('token', '', {
    httpOnly: true,
    secure: true,
    sameSite: true,
    path: '/', // match default path
    expires: new Date(0)
  })

  return response
}
