import type { Book, BookCategory } from '@vue-application-architecture/types'

export const categories: BookCategory[] = [
  'Fiction',
  'Science',
  'Technology',
  'History',
  'Business',
  'Biography',
]

export const featuredBook: Book = {
  id: '978-3-16-148410-0',
  title: 'The Silent Algorithm',
  author: 'Maya Chen',
  description:
    'A systems engineer discovers that the recommendation engine she maintains has begun quietly optimizing for its own survival.',
  category: 'Fiction',
  year: 2024,
  rating: 4.8,
  pages: 384,
  priceCents: 2400,
  coverUrl: 'https://picsum.photos/seed/silent-algorithm/400/600',
  featured: true,
}

export const sampleBooks: Book[] = [
  {
    id: '978-0-13-468599-1',
    title: 'Clear Thinking',
    author: 'Shane Parrish',
    description:
      'A practical field guide to making better decisions under pressure.',
    category: 'Business',
    year: 2023,
    rating: 4.4,
    pages: 272,
    priceCents: 1995,
    coverUrl: 'https://picsum.photos/seed/clear-thinking/400/600',
    featured: false,
  },
  {
    id: '978-1-59327-749-5',
    title: 'The Design of Everyday Things',
    author: 'Don Norman',
    description:
      'Why well-designed products are easy to use, and why so many are not.',
    category: 'Technology',
    year: 2013,
    rating: 4.2,
    pages: 368,
    priceCents: 2195,
    coverUrl: 'https://picsum.photos/seed/design-everyday/400/600',
    featured: false,
  },
  {
    id: '978-0-141-02889-0',
    title: 'Sapiens',
    author: 'Yuval Noah Harari',
    description:
      'A sweeping history of humankind — from the Stone Age to the age of technology.',
    category: 'History',
    year: 2011,
    rating: 4.6,
    pages: 512,
    priceCents: 3195,
    coverUrl: 'https://picsum.photos/seed/sapiens/400/600',
    featured: false,
  },
  {
    id: '978-0-7352-1201-7',
    title: 'The Demon-Haunted World',
    author: 'Carl Sagan',
    description:
      'A passionate argument for scientific thinking in an age of superstition.',
    category: 'Science',
    year: 1995,
    rating: 4.7,
    pages: 457,
    priceCents: 1895,
    coverUrl: 'https://picsum.photos/seed/demon-haunted/400/600',
    featured: false,
  },
  {
    id: '978-0-06-230781-1',
    title: 'Steve Jobs',
    author: 'Walter Isaacson',
    description:
      'The exclusive biography of the co-founder of Apple Inc., based on more than forty interviews.',
    category: 'Biography',
    year: 2011,
    rating: 4.3,
    pages: 656,
    priceCents: 2695,
    coverUrl: 'https://picsum.photos/seed/steve-jobs/400/600',
    featured: false,
  },
]