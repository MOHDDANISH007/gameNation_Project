// app/products/page.js
import { Suspense } from 'react'
import ProductContent from '@/components/ProductContent'

export default function ProductsPage() {
  return (
    <main>
      <h1>Products</h1>
      <Suspense fallback={<div>Loading filters...</div>}>
        <ProductContent />
      </Suspense>
    </main>
  )
}
