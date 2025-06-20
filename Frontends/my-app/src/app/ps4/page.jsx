// app/ps4/page.js
import { Suspense } from 'react'
import Ps4Content from '@/components/Ps4Content.jsx'
export default function Ps4Page () {
  return (
    <main>
      <h1>PS4 Section</h1>
      <Suspense fallback={<div>Loading model info...</div>}>
        <Ps4Content />
      </Suspense>
    </main>
  )
}
