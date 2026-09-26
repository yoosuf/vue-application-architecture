<script setup lang="ts">
import * as stylex from '@stylexjs/stylex'
import { colors, radii, spacing, typography } from '../../styles/tokens.stylex'

const props = withDefaults(
  defineProps<{
    legend: string
  }>(),
  {},
)

const styles = stylex.create({
  fieldset: {
    margin: 0,
    padding: 0,
    border: 'none',
    minWidth: 0,
  },
  legend: {
    fontFamily: typography.fontDisplay,
    fontSize: typography.sizeXl,
    fontWeight: typography.weightBold,
    color: colors.textPrimary,
    marginBottom: spacing.md,
    marginInlineStart: 0,
    paddingInlineStart: 0,
  },
  card: {
    display: 'flex',
    flexDirection: 'column',
    gap: spacing.md,
    padding: spacing.lg,
    backgroundColor: colors.surface,
    border: `1px solid ${colors.border}`,
    borderRadius: radii.md,
    minWidth: 0,
  },
})
</script>

<template>
  <fieldset v-bind="stylex.attrs(styles.fieldset)">
    <legend v-bind="stylex.attrs(styles.legend)">{{ props.legend }}</legend>
    <div v-bind="stylex.attrs(styles.card)">
      <slot />
    </div>
  </fieldset>
</template>
