<script setup lang="ts">
import EmptyState from '@vue-application-architecture/design-system/ui/molecules/EmptyState.vue'
import AppButton from '@vue-application-architecture/design-system/ui/atoms/AppButton.vue'
import PageSection from '@vue-application-architecture/design-system/ui/molecules/PageSection.vue'
</script>

<template>
  <PageSection spacing="xxxl">
    <EmptyState
      heading-level="h1"
      title="Page not found"
      message="The page you are looking for does not exist or has moved."
    >
      <AppButton :to="{ name: 'explore' }">Back to Explore</AppButton>
    </EmptyState>
  </PageSection>
</template>
