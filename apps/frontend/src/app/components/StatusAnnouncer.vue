<script setup lang="ts">
import * as stylex from '@stylexjs/stylex'
import { visuallyHidden } from '../../../../../packages/design-system/src/styles/shared.stylex'

defineProps<{
  message: string
}>()
</script>

<template>
  <span
    role="status"
    v-bind="stylex.attrs(visuallyHidden.root)"
    aria-live="polite"
    >{{ message }}</span
  >
</template>
