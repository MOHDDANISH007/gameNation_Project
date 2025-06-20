// app/xboxX/page.js
import { Suspense } from 'react'
import XboxXComponent from '@/components/XboxX.jsx'

export default function XboxXPage () {
  return (
    <main>
      <h1>Xbox X Games</h1>
      <Suspense fallback={<div>Loading game info...</div>}>
        <XboxXComponent />
      </Suspense>
    </main>
  )
}
