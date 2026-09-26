import { faker } from '@faker-js/faker'
import type { Book, BookCategory } from '@vue-application-architecture/types/book'

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

  return {
    id,
    title: faker.book.title(),
    author: faker.person.fullName(),
    description: faker.lorem.sentences(3),
    category: faker.helpers.arrayElement(CATEGORIES),
    year: faker.number.int({ min: 1990, max: new Date().getFullYear() }),
    rating: faker.number.float({ min: 3, max: 5, fractionDigits: 1 }),
    pages: faker.number.int({ min: 120, max: 900 }),
    coverUrl: `https://picsum.photos/seed/${id}/400/600`,
    featured: index === 0,
  }
}

export function createBooks(count: number): Book[] {
  return Array.from({ length: count }, (_, index) => createBook(index))
}
