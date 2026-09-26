<script setup lang="ts">
import * as stylex from '@stylexjs/stylex'
import {
  layout as layoutTokens,
  spacing as spacingTokens,
} from '../../styles/tokens.stylex'

const props = withDefaults(
  defineProps<{
    label?: string
    labelledby?: string
    spacing?: 'xl' | 'xxl' | 'xxxl'
    layout?: 'block' | 'column'
  }>(),
  {
    label: undefined,
    labelledby: undefined,
    spacing: 'xxl',
    layout: 'block',
  },
)

const styles = stylex.create({
  base: {
    maxWidth: layoutTokens.pageMaxWidth,
    margin: '0 auto',
    paddingInline: layoutTokens.pageGutter,
  },
  spacingXl: {
    paddingBlock: spacingTokens.xl,
  },
  spacingXxl: {
    paddingBlock: spacingTokens.xxl,
  },
  spacingXxxl: {
    paddingBlock: spacingTokens.xxxl,
  },
  column: {
    display: 'flex',
    flexDirection: 'column',
    gap: spacingTokens.lg,
  },
})
</script>

<template>
  <section
    :aria-label="props.label"
    :aria-labelledby="props.labelledby"
    v-bind="
      stylex.attrs(
        styles.base,
        props.spacing === 'xl'
          ? styles.spacingXl
          : props.spacing === 'xxxl'
            ? styles.spacingXxxl
            : styles.spacingXxl,
        props.layout === 'column' && styles.column,
      )
    "
  >
    <slot />
  </section>
</template>
