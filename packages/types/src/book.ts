export type BookCategory =
  'Fiction' | 'Science' | 'Technology' | 'History' | 'Business' | 'Biography'

export interface Book {
  id: string
  title: string
  author: string
  description: string
  category: BookCategory
  year: number
  rating: number
  pages: number
  priceCents: number
  coverUrl: string
  featured: boolean
}
