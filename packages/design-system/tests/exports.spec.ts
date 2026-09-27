import { readdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'
import * as root from '../src/index'
import * as atoms from '../src/ui/atoms'
import * as molecules from '../src/ui/molecules'

const componentNames = (dir: string) =>
  readdirSync(fileURLToPath(new URL(dir, import.meta.url)))
    .filter((file) => file.endsWith('.vue'))
    .map((file) => file.replace(/\.vue$/, ''))
    .sort()

describe('public exports', () => {
  it('exports every atom from the atoms barrel', () => {
    expect(Object.keys(atoms).sort()).toEqual(componentNames('../src/ui/atoms'))
  })

  it('exports every molecule from the molecules barrel', () => {
    expect(Object.keys(molecules).sort()).toEqual(
      componentNames('../src/ui/molecules'),
    )
  })

  it('re-exports every component from the root barrel', () => {
    const components = componentNames('../src/ui/atoms')
      .concat(componentNames('../src/ui/molecules'))
      .sort()
    expect(Object.keys(root).sort()).toEqual(components)
  })
})
