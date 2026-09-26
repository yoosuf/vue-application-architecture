<script setup lang="ts">
import { computed } from 'vue'
import * as stylex from '@stylexjs/stylex'
import { Moon, Sun } from 'lucide-vue-next'
import IconButton from './IconButton.vue'
import { visuallyHidden } from '../../styles/shared.stylex'
import type { Theme } from '../../theme'

const props = defineProps<{
  theme: Theme
}>()

const emit = defineEmits<{
  toggle: []
}>()

const label = computed(() =>
  props.theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme',
)

const status = computed(() =>
  props.theme === 'dark' ? 'Dark theme enabled' : 'Light theme enabled',
)

const styles = stylex.create({
  root: {
    display: 'inline-flex',
    alignItems: 'center',
  },
})
</script>

<template>
  <div v-bind="stylex.attrs(styles.root)">
    <IconButton :label="label" @click="emit('toggle')">
      <Moon v-if="props.theme === 'dark'" :size="18" aria-hidden="true" />
      <Sun v-else :size="18" aria-hidden="true" />
    </IconButton>
    <span
      role="status"
      v-bind="stylex.attrs(visuallyHidden.root)"
      aria-live="polite"
      >{{ status }}</span
    >
  </div>
</template>
