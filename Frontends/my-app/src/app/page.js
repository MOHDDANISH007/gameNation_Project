import { Suspense } from 'react'
import MyComponent from '@/components/HomeContent' // or whatever the component is called
import './globals.css'
export default function Home() {
  return (
    <main>
      <Suspense fallback={<div>Loading...</div>}>
        <MyComponent />
      </Suspense>
    </main>
  )
}
