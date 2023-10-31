<template>
	<header ref="navbar" class="navbar">
		<!-- 移动端展示 -->
		<ToggleSidebarButton @toggle="$emit('toggle-sidebar')" />

    <!-- logo和网站名字 -->
		<div ref="navbarBrand" class="navbarBrand">
			<NavbarBrand />
		</div>

    <!-- 导航栏 -->
		<div class="navbar-items-wrapper" v-if="!isMobile" :style="linksWrapperStyle">
			<slot name="before" />
			<NavbarItems class="can-hide" />
			<slot name="after" />
		</div>

    <!-- 工具栏 -->
    <div class="navbarTools" ref="navbarTools">
      <!-- 主题切换按钮 -->
			<ToggleColorModeButton v-if="themeLocale.colorModeSwitch" />
			<NavbarSearch />
		</div>
	</header>
</template>

<script setup lang="ts">
import NavbarBrand from '@theme/NavbarBrand.vue';
import NavbarItems from '@theme/NavbarItems.vue';
import ToggleColorModeButton from '@theme/ToggleColorModeButton.vue';
import ToggleSidebarButton from '@theme/ToggleSidebarButton.vue';
import { computed, ref } from 'vue';
import { DeviceType, useThemeLocaleData, useUpdateDeviceStatus } from '../composables/index.js';

defineEmits<{ (e: 'toggle-sidebar'): void }>();
defineSlots<{
	before?: (props: Record<never, never>) => any;
	after?: (props: Record<never, never>) => any;
}>();


const themeLocale = useThemeLocaleData();
const navbar = ref<HTMLElement | null>(null);
const navbarBrand = ref<HTMLElement | null>(null);
const navbarTools = ref<HTMLElement | null>(null);

const linksWrapperMaxWidth = ref(0);
// 设置导航栏最大宽度
const linksWrapperStyle = computed(() => {
	if (!linksWrapperMaxWidth.value) {
		return {};
	}
	return { maxWidth: linksWrapperMaxWidth.value + 'px' };
});

// 避免 长标题 和 长导航栏链接 重叠
useUpdateDeviceStatus(DeviceType.MOBILE, (mobileDesktopBreakpoint: number): void => {
	const navbarHorizontalPadding = getCssValue(navbar.value, 'paddingLeft') + getCssValue(navbar.value, 'paddingRight');
	if (window.innerWidth < mobileDesktopBreakpoint) {
		linksWrapperMaxWidth.value = 0;
	} else {
		linksWrapperMaxWidth.value = navbar.value!.offsetWidth - navbarHorizontalPadding - (navbarTools.value?.offsetWidth || 0) - (navbarBrand.value?.offsetWidth || 0);
	}
});

/* 
 * 获取 dom 元素的 css 属性值
 */
function getCssValue(el: HTMLElement | null, property: string): number {
	const val = el?.ownerDocument?.defaultView?.getComputedStyle(el, null)?.[property];
	const num = Number.parseInt(val, 10);
	return Number.isNaN(num) ? 0 : num;
}


const isMobile = ref(false);
// 屏幕视口监听：是否是移动设备
useUpdateDeviceStatus(DeviceType.MOBILE, (mobileDesktopBreakpoint: number): void => {
	if (window.innerWidth < mobileDesktopBreakpoint) {
		isMobile.value = true;
	} else {
		isMobile.value = false;
	}
});
</script>
