// app/ps5/page.js
import { Suspense } from 'react'
import Ps5Component from '@/components/Ps5Content.jsx'

export default function Ps5Page() {
  return (
    <main>
      <h1>Welcome to PS5</h1>
      <Suspense fallback={<div>Loading model...</div>}>
        <Ps5Component />
      </Suspense>
    </main>
  )
}
