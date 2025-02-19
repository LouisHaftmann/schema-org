<script setup lang="ts">
import { computed, ref, useContent } from '#imports'

const { page } = useContent()

const fallbackValue = (value: string, fallback = true) => {
  if (typeof page.value?.[value] !== 'undefined') {
    return page.value[value]
  }

  return fallback
}

const toc = computed(() => fallbackValue('toc', true))

const header = computed(() => fallbackValue('header', true))

const aside = computed(() => fallbackValue('aside', true))

const bottom = computed(() => fallbackValue('bottom', true))

const isOpen = ref(false)
</script>

<template>
<div class="container mx-auto lg:px-20 relative flex flex-col-reverse lg:grid lg:grid-cols-12 lg:gap-12">
  <!-- Aside -->
  <aside
    v-if="aside"
    class="lg:top-header hidden overflow-y-auto overflow-x-hidden pb-8 lg:sticky lg:col-span-2 lg:-mt-8 lg:block lg:max-h-[calc(100vh-var(--header-height))] lg:self-start lg:pt-8"
  >
    <DocsAside />
  </aside>

  <!-- Page Body -->
  <div
    class="relative flex flex-1 flex-col pt-8 pb-8 lg:mt-0"
    :class="{
        'lg:col-span-12': !aside && !toc,
        'lg:col-span-10': (!toc || !aside) && !(!aside && !toc),
        'lg:col-span-8': toc && aside,
        'pt-12 lg:pt-8 mx-10': toc,
      }"
  >
    <DocsPageHeader v-if="page && header" />

    <slot />

    <DocsPageBottom v-if="page && bottom" />

    <ProseHr v-if="page && bottom" />

    <DocsPrevNext v-if="page && bottom" />
  </div>

  <!-- TOC -->
  <div
    v-if="toc"
    :class="{
        'flex items-center lg:block': !isOpen,
      }"
    class="toc top-header lg:max-h-page sticky -mx-4 -mt-8 flex items-center px-4 sm:-mx-6 sm:px-6 lg:col-span-2 lg:mx-0 lg:self-start lg:bg-transparent lg:px-0 lg:pt-8 lg:backdrop-blur-none"
  >
    <div class="w-full cursor-pointer sm:cursor-auto" @click="isOpen = !isOpen">
      <button class="flex items-center gap-1 py-3 lg:hidden">
        <span class="text-xs font-semibold">Table of Contents</span>
        <Icon name="heroicons-outline:chevron-right" class="h-4 w-4 transform transition-transform duration-100" :class="[isOpen ? 'rotate-90' : 'rotate-0']" />
      </button>

      <DocsToc class="mb-4 lg:mt-0" :class="[isOpen ? 'lg:block' : 'hidden lg:block']" @move="isOpen = false" />
    </div>
  </div>
</div>
</template>

<style lang="postcss" scoped>
.toc {
&:before {
   content: ' ';
   width: 100%;
   right: 0;
   @apply absolute top-0 z-[-1] block h-full bg-white/95 backdrop-blur dark:bg-black/95;
 }
}

@screen lg {
  .toc {
&:before {
   display: none;
 }
}
}
</style>
