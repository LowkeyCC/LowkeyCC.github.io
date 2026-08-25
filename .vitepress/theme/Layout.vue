<template>
  <template v-if="isHome">
    <HomeLayout />
  </template>
  <DefaultLayout v-else />
  <AdminBar />
</template>

<script setup>
import { computed } from 'vue'
import { useData } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import HomeLayout from './HomeLayout.vue'
import AdminBar from './AdminBar.vue'

const { Layout: DefaultLayout } = DefaultTheme
const { frontmatter } = useData()

const isHome = computed(() => frontmatter.value?.layout === 'home')
</script>
