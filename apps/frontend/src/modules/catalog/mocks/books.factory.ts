import { faker } from '@faker-js/faker'
import type {
  Book,
  BookCategory,
} from '@vue-application-architecture/types/book'

export const CATEGORIES: BookCategory[] = [
  'Fiction',
  'Science',
  'Technology',
  'History',
  'Business',
  'Biography',
]

export function createBook(index = 0): Book {
  const id = faker.string.uuid()
  const priceCents = faker.number.int({ min: 1200, max: 4200 })
  const coverUrl = `https://picsum.photos/seed/${id}/400/600`

  return {
    id,
    title: faker.book.title(),
    author: faker.person.fullName(),
    description: faker.lorem.sentences(3),
    category: faker.helpers.arrayElement(CATEGORIES),
    year: faker.number.int({ min: 1990, max: new Date().getFullYear() }),
    rating: faker.number.float({ min: 3, max: 5, fractionDigits: 1 }),
    pages: faker.number.int({ min: 120, max: 900 }),
    priceCents,
    listPriceCents:
      Math.floor(
        (priceCents + faker.number.int({ min: 300, max: 2200 })) / 100,
      ) *
        100 +
      99,
    coverUrl,
    galleryUrls: [
      coverUrl,
      `https://picsum.photos/seed/${id}-back/400/600`,
      `https://picsum.photos/seed/${id}-detail/400/600`,
      `https://picsum.photos/seed/${id}-reading/400/600`,
    ],
    featured: index === 0,
  }
}

export function createBooks(count: number): Book[] {
  return Array.from({ length: count }, (_, index) => createBook(index))
}
