<template>
  <div
    class="theme-container"
    :class="containerClass"
    @touchstart="onTouchStart"
    @touchend="onTouchEnd"
  >

    <!-- 上面导航 -->
    <slot name="navbar">
      <Navbar v-if="shouldShowNavbar" @toggle-sidebar="toggleSidebar">
        <template #before>
          <slot name="navbar-before" />
        </template>
        <template #after>
          <slot name="navbar-after" />
        </template>
      </Navbar>
    </slot>

    <!-- 侧面导航 -->
    <div class="sidebar-mask" @click="toggleSidebar(false)" />
    <slot name="sidebar">
      <Sidebar>
        <template #top>
          <slot name="sidebar-top" />
        </template>
        <template #bottom>
          <slot name="sidebar-bottom" />
        </template>
      </Sidebar>
    </slot>


    <slot name="page">
      <Home v-if="frontmatter.home" />

      <Transition
        v-else
        name="fade-slide-y"
        mode="out-in"
        @before-enter="onBeforeEnter"
        @before-leave="onBeforeLeave"
      >
        <Page :key="page.path">
          <template #top>
            <slot name="page-top" />
          </template>
          <template #content-top>
            <slot name="page-content-top" />
          </template>
          <template #content-bottom>
            <slot name="page-content-bottom" />
          </template>
          <template #bottom>
            <slot name="page-bottom" />
          </template>
        </Page>
      </Transition>
    </slot>
  </div>
</template>


<script setup lang="ts">
import Home from '@theme/Home.vue'
import Navbar from '@theme/Navbar.vue'
import Page from '@theme/Page.vue'
import Sidebar from '@theme/Sidebar.vue'
import { usePageData, usePageFrontmatter } from '@vuepress/client'
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import {
  useScrollPromise,
  useSidebarItems,
  useThemeLocaleData,
} from '../composables/index.js'


// 声明 slots
// 获取 slots，只有声明了 slots 才能使用 useSlots 获取 slots，useSlots() 返回值与 $slots 和 setupContext.slots 等价
defineSlots<{
  'navbar'?: (props: Record<never, never>) => any
  'navbar-before'?: (props: Record<never, never>) => any
  'navbar-after'?: (props: Record<never, never>) => any
  'sidebar'?: (props: Record<never, never>) => any
  'sidebar-top'?: (props: Record<never, never>) => any
  'sidebar-bottom'?: (props: Record<never, never>) => any
  'page'?: (props: Record<never, never>) => any
  'page-top'?: (props: Record<never, never>) => any
  'page-bottom'?: (props: Record<never, never>) => any
  'page-content-top'?: (props: Record<never, never>) => any
  'page-content-bottom'?: (props: Record<never, never>) => any
}>();


const page = usePageData(); // 返回当前页面数据的 Ref 对象
const frontmatter = usePageFrontmatter(); // 返回当前页面 Frontmatter 的 Ref 对象
const themeLocale = useThemeLocaleData(); // 返回当前 locale 下主题数据的 Ref 对象


// navbar
const shouldShowNavbar = computed(
  () =>
    frontmatter.value.navbar !== false && themeLocale.value.navbar !== false,
)



// 左侧菜单栏
const sidebarItems = useSidebarItems();
const isSidebarOpen = ref(false);
const toggleSidebar = (to?: boolean): void => {
  isSidebarOpen.value = typeof to === 'boolean' ? to : !isSidebarOpen.value;
}


const touchStart = { x: 0, y: 0 };
// 手指按下事件
const onTouchStart = (e): void => {
  touchStart.x = e.changedTouches[0].clientX;
  touchStart.y = e.changedTouches[0].clientY;
}
// 手指左滑距离大于 40 则打开左侧菜单栏
const onTouchEnd = (e): void => {
  const dx = e.changedTouches[0].clientX - touchStart.x;
  const dy = e.changedTouches[0].clientY - touchStart.y;
  if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 40) {
    if (dx > 0 && touchStart.x <= 80) {
      toggleSidebar(true);
    } else {
      toggleSidebar(false);
    }
  }
}


// classes
const containerClass = computed(() => [
  {
    'no-navbar': !shouldShowNavbar.value,
    'no-sidebar': !sidebarItems.value.length,
    'sidebar-open': isSidebarOpen.value,
  },
  frontmatter.value.pageClass,
])

// close sidebar after navigation
let unregisterRouterHook
onMounted(() => {
  const router = useRouter()
  unregisterRouterHook = router.afterEach(() => {
    toggleSidebar(false)
  })
})
onUnmounted(() => {
  unregisterRouterHook()
})

// handle scrollBehavior with transition
const scrollPromise = useScrollPromise()
const onBeforeEnter = scrollPromise.resolve
const onBeforeLeave = scrollPromise.pending
</script>

