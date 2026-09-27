<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, ref, useId, watch } from 'vue'
import * as stylex from '@stylexjs/stylex'
import { X } from 'lucide-vue-next'
import IconButton from '../atoms/IconButton.vue'
import { reducedMotion } from '../../styles/shared.stylex'
import { colors, motion, spacing, typography } from '../../styles/tokens.stylex'

const props = defineProps<{
  open: boolean
  title: string
}>()

const emit = defineEmits<{
  close: []
}>()

const slots = defineSlots<{
  default: () => unknown
  footer?: () => unknown
}>()

const titleId = `drawer-title-${useId()}`
const panelRef = ref<HTMLElement | null>(null)
const closeButtonRef = ref<InstanceType<typeof IconButton> | null>(null)
let previouslyFocused: HTMLElement | null = null
let previousBodyOverflow = ''
let bodyOverflowLocked = false

const hasFooterSlot = computed(() => Boolean(slots.footer))

function releaseBodyScroll() {
  if (!bodyOverflowLocked) return
  document.body.style.overflow = previousBodyOverflow
  bodyOverflowLocked = false
}

function lockBodyScroll() {
  if (bodyOverflowLocked) return
  previousBodyOverflow = document.body.style.overflow
  document.body.style.overflow = 'hidden'
  bodyOverflowLocked = true
}

watch(
  () => props.open,
  async (open) => {
    if (open) {
      lockBodyScroll()
      window.addEventListener('keydown', onKeydown)
      previouslyFocused = document.activeElement as HTMLElement | null
      await nextTick()
      closeButtonRef.value?.$el.focus({ preventScroll: true })
      return
    }
    window.removeEventListener('keydown', onKeydown)
    releaseBodyScroll()
    previouslyFocused?.focus({ preventScroll: true })
    previouslyFocused = null
  },
  { immediate: true, flush: 'post' },
)

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'

function onKeydown(event: KeyboardEvent) {
  if (!props.open) return
  if (event.key === 'Escape') {
    event.preventDefault()
    emit('close')
    return
  }
  if (event.key !== 'Tab') return
  const focusables = Array.from(
    panelRef.value?.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR) ?? [],
  )
  if (focusables.length === 0) return
  const first = focusables[0]
  const last = focusables[focusables.length - 1]
  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault()
    last.focus()
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault()
    first.focus()
  }
}

onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKeydown)
  releaseBodyScroll()
})

const styles = stylex.create({
  root: {
    position: 'fixed',
    inset: 0,
    zIndex: 60,
    pointerEvents: 'none',
  },
  scrimBase: {
    position: 'absolute',
    inset: 0,
    backgroundColor: colors.overlay,
    transition: `opacity 240ms ${motion.easeOut}`,
  },
  scrimOpen: {
    opacity: 1,
    pointerEvents: 'auto',
  },
  scrimClosed: {
    opacity: 0,
    pointerEvents: 'none',
  },
  wrapBase: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    maxWidth: 420,
  },
  wrapOpen: {
    visibility: 'visible',
    transition: 'visibility 0s linear 0s',
    pointerEvents: 'auto',
  },
  wrapClosed: {
    visibility: 'hidden',
    transition: 'visibility 0s linear 320ms',
    pointerEvents: 'none',
  },
  panelBase: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    backgroundColor: colors.surface,
    boxShadow: `-8px 0 24px ${colors.shadow}`,
    transition: `transform 320ms ${motion.easeOut}, opacity 240ms ${motion.easeOut}`,
  },
  panelOpen: {
    transform: 'translateX(0)',
    opacity: 1,
  },
  panelClosed: {
    transform: 'translateX(100%)',
    opacity: 0,
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
    padding: `${spacing.md} ${spacing.lg}`,
    borderBottom: `1px solid ${colors.border}`,
  },
  title: {
    margin: 0,
    fontFamily: typography.fontDisplay,
    fontSize: typography.sizeXl,
    fontWeight: typography.weightBold,
    color: colors.textPrimary,
  },
  body: {
    flex: 1,
    overflowY: 'auto',
    padding: spacing.md,
  },
  footer: {
    display: 'flex',
    flexDirection: 'column',
    gap: spacing.md,
    padding: spacing.lg,
    borderTop: `1px solid ${colors.border}`,
  },
})
</script>

<template>
  <div v-bind="stylex.attrs(styles.root)">
    <div
      v-bind="
        stylex.attrs(
          styles.scrimBase,
          open ? styles.scrimOpen : styles.scrimClosed,
        )
      "
      :hidden="!open"
      aria-hidden="true"
      @click="emit('close')"
    />

    <div
      ref="panelRef"
      v-bind="
        stylex.attrs(
          styles.wrapBase,
          open ? styles.wrapOpen : styles.wrapClosed,
          reducedMotion.root,
        )
      "
    >
      <div
        v-bind="
          stylex.attrs(
            styles.panelBase,
            open ? styles.panelOpen : styles.panelClosed,
            reducedMotion.root,
          )
        "
        role="dialog"
        aria-modal="true"
        :aria-hidden="!open"
        :aria-labelledby="titleId"
      >
        <header v-bind="stylex.attrs(styles.header)">
          <h2 :id="titleId" v-bind="stylex.attrs(styles.title)">{{ title }}</h2>
          <IconButton
            ref="closeButtonRef"
            :label="`Close ${title}`"
            @click="emit('close')"
          >
            <X :size="20" aria-hidden="true" />
          </IconButton>
        </header>

        <div v-bind="stylex.attrs(styles.body)">
          <slot />
        </div>

        <footer v-if="hasFooterSlot" v-bind="stylex.attrs(styles.footer)">
          <slot name="footer" />
        </footer>
      </div>
    </div>
  </div>
</template>
