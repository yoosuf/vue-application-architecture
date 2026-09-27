<script setup lang="ts">
import { computed, ref } from 'vue'
import { useId } from 'vue'
import * as stylex from '@stylexjs/stylex'
import { focusRing, reducedMotion } from '../../styles/shared.stylex'
import {
  colors,
  motion,
  radii,
  spacing,
  typography,
} from '../../styles/tokens.stylex'

const props = withDefaults(
  defineProps<{
    labels: readonly string[]
    modelValue?: number
    label?: string
  }>(),
  {
    label: 'Tabs',
  },
)

const emit = defineEmits<{
  'update:modelValue': [index: number]
  change: [index: number]
}>()

const baseId = `tabs-${useId()}`
const panelId = `${baseId}-panel`

const internalActive = ref(props.modelValue ?? 0)

function clamp(index: number) {
  if (props.labels.length === 0) return 0
  return Math.min(Math.max(index, 0), props.labels.length - 1)
}

const activeIndex = computed(() =>
  clamp(props.modelValue ?? internalActive.value),
)

function activate(index: number) {
  const bounded = clamp(index)
  internalActive.value = bounded
  emit('update:modelValue', bounded)
  emit('change', bounded)
}

const tabRefs = ref<(HTMLElement | null)[]>([])

function onTablistKeydown(event: KeyboardEvent) {
  if (props.labels.length === 0) return
  let next = activeIndex.value
  if (event.key === 'ArrowRight') next += 1
  else if (event.key === 'ArrowLeft') next -= 1
  else if (event.key === 'Home') next = 0
  else if (event.key === 'End') next = props.labels.length - 1
  else return
  event.preventDefault()
  const bounded = (next + props.labels.length) % props.labels.length
  activate(bounded)
  tabRefs.value[bounded]?.focus()
}

const styles = stylex.create({
  root: {
    display: 'flex',
    flexDirection: 'column',
    gap: spacing.sm,
  },
  tablist: {
    display: 'flex',
    alignItems: 'flex-end',
    gap: spacing.xs,
    overflowX: 'auto',
    borderBottom: `1px solid ${colors.border}`,
  },
  tab: {
    appearance: 'none',
    background: 'none',
    border: 'none',
    marginBottom: -1,
    paddingInline: spacing.sm,
    paddingBlock: spacing.sm,
    borderRadius: `${radii.sm} ${radii.sm} 0 0`,
    cursor: 'pointer',
    whiteSpace: 'nowrap',
    fontFamily: typography.fontSans,
    fontSize: typography.sizeBase,
    fontWeight: typography.weightMedium,
    lineHeight: typography.leadingTight,
    color: colors.textSecondary,
    borderBottom: `2px solid transparent`,
    transition: `color ${motion.base} ${motion.easeOut}, border-color ${motion.base} ${motion.easeOut}`,
    ':hover': {
      color: colors.textPrimary,
    },
  },
  tabActive: {
    color: colors.accent,
    borderBottomColor: colors.accent,
    ':hover': {
      color: colors.accent,
    },
  },
  panel: {
    paddingBlock: spacing.sm,
  },
})
</script>

<template>
  <div v-bind="stylex.attrs(styles.root, reducedMotion.root)">
    <div
      role="tablist"
      :aria-label="props.label"
      v-bind="stylex.attrs(styles.tablist)"
      @keydown="onTablistKeydown"
    >
      <button
        v-for="(tabLabel, index) in props.labels"
        :id="`${baseId}-tab-${index}`"
        :key="tabLabel"
        :ref="(element) => (tabRefs[index] = element as HTMLElement | null)"
        type="button"
        role="tab"
        :aria-selected="index === activeIndex ? 'true' : 'false'"
        :aria-controls="panelId"
        :tabindex="index === activeIndex ? 0 : -1"
        v-bind="
          stylex.attrs(
            styles.tab,
            index === activeIndex ? styles.tabActive : false,
            focusRing.visible,
          )
        "
        @click="activate(index)"
      >
        {{ tabLabel }}
      </button>
    </div>

    <div
      v-if="props.labels.length > 0"
      :id="panelId"
      role="tabpanel"
      tabindex="0"
      :aria-labelledby="`${baseId}-tab-${activeIndex}`"
      v-bind="stylex.attrs(styles.panel)"
    >
      <slot
        :index="activeIndex"
        :label="props.labels[activeIndex]"
        :active="true"
      />
    </div>
  </div>
</template>
