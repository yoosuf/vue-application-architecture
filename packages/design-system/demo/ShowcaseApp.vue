<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import * as stylex from '@stylexjs/stylex'
import { Heart } from 'lucide-vue-next'
import AppButton from '../src/ui/atoms/AppButton.vue'
import IconButton from '../src/ui/atoms/IconButton.vue'
import Loader from '../src/ui/atoms/Loader.vue'
import Rating from '../src/ui/atoms/Rating.vue'
import SearchField from '../src/ui/atoms/SearchField.vue'
import ThemeToggle from '../src/ui/atoms/ThemeToggle.vue'
import EmptyState from '../src/ui/molecules/EmptyState.vue'
import SearchBar from '../src/ui/molecules/SearchBar.vue'
import { darkTheme, lightTheme } from '../src/styles/themes.stylex'
import { colors, motion, radii, spacing, typography } from '../src/styles/tokens.stylex'

const theme = ref<'light' | 'dark'>('light')
const themeClass = computed(() => (theme.value === 'dark' ? darkTheme : lightTheme))
const query = ref('')

function toggleTheme() {
  theme.value = theme.value === 'dark' ? 'light' : 'dark'
  document.documentElement.dataset.dsTheme = theme.value
}

onMounted(() => {
  document.documentElement.dataset.dsTheme = theme.value
})

const swatches = [
  { name: 'accent', value: 'var(--ds-color-accent)' },
  { name: 'surface', value: 'var(--ds-color-surface)' },
  { name: 'favorite', value: 'var(--ds-color-favorite)' },
  { name: 'border', value: 'var(--ds-color-border)' },
]

const styles = stylex.create({
  page: {
    minHeight: '100vh',
    padding: spacing.xxl,
    backgroundColor: colors.background,
    color: colors.textPrimary,
    fontFamily: typography.fontSans,
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.md,
    marginBottom: spacing.xl,
  },
  title: {
    fontFamily: typography.fontDisplay,
    fontSize: typography.size2xl,
    fontWeight: typography.weightBold,
    margin: 0,
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
    gap: spacing.md,
    marginBottom: spacing.xxl,
  },
  card: {
    display: 'flex',
    flexDirection: 'column',
    gap: spacing.sm,
    padding: spacing.lg,
    backgroundColor: colors.surface,
    border: `1px solid ${colors.border}`,
    borderRadius: radii.md,
  },
  cardLabel: {
    fontSize: typography.sizeSm,
    fontWeight: typography.weightMedium,
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    margin: 0,
  },
  row: {
    display: 'flex',
    alignItems: 'center',
    gap: spacing.sm,
    flexWrap: 'wrap',
  },
  sectionTitle: {
    fontSize: typography.sizeXl,
    fontWeight: typography.weightBold,
    marginBottom: spacing.md,
  },
  panel: {
    padding: spacing.lg,
    border: `1px solid ${colors.border}`,
    borderRadius: radii.md,
    backgroundColor: colors.surface,
    marginBottom: spacing.xxl,
  },
  swatches: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
    gap: spacing.md,
  },
  swatch: {
    display: 'flex',
    alignItems: 'center',
    gap: spacing.sm,
    fontSize: typography.sizeSm,
    color: colors.textSecondary,
  },
  swatchDot: {
    width: 20,
    height: 20,
    borderRadius: radii.circle,
    border: `1px solid ${colors.border}`,
  },
  note: {
    fontSize: typography.sizeSm,
    lineHeight: typography.leadingNormal,
    color: colors.textSecondary,
    marginTop: spacing.md,
  },
})
</script>

<template>
  <main :class="themeClass" v-bind="stylex.attrs(styles.page)">
    <header v-bind="stylex.attrs(styles.header)">
      <h1 v-bind="stylex.attrs(styles.title)">@vue-application-architecture/design-system</h1>
      <ThemeToggle :theme="theme" @toggle="toggleTheme" />
    </header>

    <h2 v-bind="stylex.attrs(styles.sectionTitle)">Atoms</h2>
    <div v-bind="stylex.attrs(styles.grid)">
      <section v-bind="stylex.attrs(styles.card)">
        <p v-bind="stylex.attrs(styles.cardLabel)">AppButton</p>
        <div v-bind="stylex.attrs(styles.row)">
          <AppButton variant="primary" @click="() => undefined">Primary</AppButton>
          <AppButton variant="secondary" @click="() => undefined">Secondary</AppButton>
          <AppButton variant="primary" size="sm" disabled>Disabled</AppButton>
        </div>
      </section>

      <section v-bind="stylex.attrs(styles.card)">
        <p v-bind="stylex.attrs(styles.cardLabel)">IconButton</p>
        <div v-bind="stylex.attrs(styles.row)">
          <IconButton label="Favorite" pressed>
            <Heart :size="18" aria-hidden="true" fill="currentColor" />
          </IconButton>
          <IconButton label="Inactive">
            <Heart :size="18" aria-hidden="true" />
          </IconButton>
        </div>
      </section>

      <section v-bind="stylex.attrs(styles.card)">
        <p v-bind="stylex.attrs(styles.cardLabel)">Rating</p>
        <Rating :value="4.5" />
      </section>

      <section v-bind="stylex.attrs(styles.card)">
        <p v-bind="stylex.attrs(styles.cardLabel)">Loader</p>
        <Loader :size="28" label="Loading demo" />
      </section>
    </div>

    <h2 v-bind="stylex.attrs(styles.sectionTitle)">Molecules</h2>
    <div v-bind="stylex.attrs(styles.grid)">
      <section v-bind="stylex.attrs(styles.card)">
        <p v-bind="stylex.attrs(styles.cardLabel)">SearchField</p>
        <SearchField v-model="query" placeholder="Search the design system…" />
      </section>

      <section v-bind="stylex.attrs(styles.card)">
        <p v-bind="stylex.attrs(styles.cardLabel)">SearchBar</p>
        <SearchBar v-model="query" placeholder="Search the design system…" />
      </section>

      <section v-bind="stylex.attrs(styles.card)">
        <p v-bind="stylex.attrs(styles.cardLabel)">EmptyState</p>
        <EmptyState title="Nothing to show" message="This panel renders the molecule as a card." />
      </section>
    </div>

    <h2 v-bind="stylex.attrs(styles.sectionTitle)">Plain-CSS tokens</h2>
    <section v-bind="stylex.attrs(styles.panel)" :data-ds-theme="theme">
      <div v-bind="stylex.attrs(styles.swatches)">
        <div
          v-for="swatch in swatches"
          :key="swatch.name"
          v-bind="stylex.attrs(styles.swatch)"
        >
          <span v-bind="stylex.attrs(styles.swatchDot)" :style="{ backgroundColor: swatch.value }" />
          <code>{{ swatch.name }}</code>
        </div>
      </div>
      <p v-bind="stylex.attrs(styles.note)">
        These swatches read <code>--ds-*</code> variables from
        <code>tokens.css</code> (imported in <code>main.ts</code>), so they flip
        with <code>data-ds-theme</code> exactly like the StyleX themes above.
        Motion (<code>{{ motion.base }}</code>), radii
        (<code>{{ radii.md }}</code>) and spacing
        (<code>{{ spacing.md }}</code>) come from the same files.
      </p>
    </section>
  </main>
</template>