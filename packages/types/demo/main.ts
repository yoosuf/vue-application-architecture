import type { Book } from '@vue-application-architecture/types'
import type { Book as BookSubpath } from '@vue-application-architecture/types/book'
import { categories, featuredBook, sampleBooks } from './samples'

const root = document.querySelector<HTMLDivElement>('#app')!

function bookBadge(book: Book): string {
  return `${book.category} · ${book.year} · ${book.pages} pages · ★ ${book.rating.toFixed(1)}`
}

function bookCard(book: Book): string {
  return `
    <article class="book-card">
      <img src="${book.coverUrl}" alt="Cover of ${book.title}" loading="lazy" />
      <div class="book-body">
        <h3>${book.title}</h3>
        <p class="author">${book.author}</p>
        <p class="description">${book.description}</p>
        <p class="badge">${bookBadge(book)}</p>
      </div>
    </article>
  `
}

const sameType: BookSubpath = featuredBook

root.innerHTML = `
  <h1>@vue-application-architecture/types</h1>
  <p class="intro">
    Pure, framework-free domain types for Shelf. This page is rendered from
    <code>Book[]</code> sample data — every property below is type-enforced, so
    a missing field or a bad <code>BookCategory</code> fails the build.
  </p>

  <section>
    <h2>Public surface</h2>
    <table class="surface">
      <tr><td><code>@vue-application-architecture/types</code></td><td><code>Book</code>, <code>BookCategory</code></td></tr>
      <tr><td><code>@vue-application-architecture/types/book</code></td><td>same types via subpath</td></tr>
    </table>
  </section>

  <section>
    <h2>BookCategory (union of six literals)</h2>
    <div class="chips">
      ${categories.map((c) => `<span class="chip">${c}</span>`).join('')}
    </div>
  </section>

  <section>
    <h2>Featured book</h2>
    <div class="featured">
      ${bookCard(featuredBook)}
    </div>
  </section>

  <section>
    <h2>Book grid (${sampleBooks.length} samples)</h2>
    <div class="grid">${sampleBooks.map(bookCard).join('')}</div>
  </section>
`

console.info('demo/types: Book / BookCategory examples rendered.')
console.info('Subpath import equality:', sameType.id === featuredBook.id)