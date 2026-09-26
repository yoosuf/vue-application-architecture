import { faker } from '@faker-js/faker'
import { createBooks } from './books.factory'
import type { Book } from '@vue-application-architecture/types/book'

faker.seed(2026)

export const BOOK_COUNT = 100

export const books: Book[] = createBooks(BOOK_COUNT)
