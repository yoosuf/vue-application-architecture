<script setup lang="ts">
import { computed } from 'vue'
import * as stylex from '@stylexjs/stylex'
import { Moon, Sun } from 'lucide-vue-next'
import IconButton from './IconButton.vue'
import { reducedMotion, visuallyHidden } from '../../styles/shared.stylex'
import { colors, motion } from '../../styles/tokens.stylex'
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

const iconIn = stylex.keyframes({
  '0%': { opacity: 0.4, transform: 'scale(0.8) rotate(-30deg)' },
  '100%': { opacity: 1, transform: 'scale(1) rotate(0deg)' },
})

const styles = stylex.create({
  root: {
    display: 'inline-flex',
    alignItems: 'center',
  },
  icon: {
    display: 'flex',
    color: colors.textSecondary,
  },
  iconSwapped: {
    animationName: iconIn,
    animationDuration: motion.base,
    animationTimingFunction: motion.easeOut,
    animationIterationCount: 1,
  },
})
</script>

<template>
  <div v-bind="stylex.attrs(styles.root)">
    <IconButton :label="label" @click="emit('toggle')">
      <span
        :key="props.theme"
        v-bind="
          stylex.attrs(styles.icon, styles.iconSwapped, reducedMotion.root)
        "
      >
        <Moon v-if="props.theme === 'dark'" :size="18" aria-hidden="true" />
        <Sun v-else :size="18" aria-hidden="true" />
      </span>
    </IconButton>
    <span
      role="status"
      v-bind="stylex.attrs(visuallyHidden.root)"
      aria-live="polite"
      >{{ status }}</span
    >
  </div>
</template>
