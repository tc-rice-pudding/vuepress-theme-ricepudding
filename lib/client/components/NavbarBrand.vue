<template>
	<RouterLink :to="navbarBrandLink">
		<!-- logo -->
		<NavbarBrandLogo />

		<!-- 网站标题 -->
		<template v-if="navbarBrandTitle">
			<span class="site-name" :class="{ 'can-hide': navbarBrandLogo }">{{ navbarBrandTitle }}</span>
			<span class="home-icon"><i class="iconfont icon-home"></i></span>
		</template>

	</RouterLink>
</template>

<script setup lang="ts">
import { ClientOnly, useRouteLocale, useSiteLocaleData, withBase } from '@vuepress/client';
import { computed, h } from 'vue';
import type { FunctionalComponent } from 'vue';
import { useDarkMode, useThemeLocaleData } from '../composables/index.js';

const routeLocale = useRouteLocale(); // 获取网站前缀 => /
const siteLocale = useSiteLocaleData(); // 站点配置
const themeLocale = useThemeLocaleData(); // 主题配置
const isDarkMode = useDarkMode();

// 首页 url
const navbarBrandLink = computed(() => themeLocale.value.home || routeLocale.value);
// 首页 title
const navbarBrandTitle = computed(() => siteLocale.value.title);
// 首页 logo url（白天/黑夜）
const navbarBrandLogo = computed(() => {
	if (isDarkMode.value && themeLocale.value.logoDark !== undefined) {
		return themeLocale.value.logoDark;
	}
	return themeLocale.value.logo;
});
// 根据 logo 生成组件
const NavbarBrandLogo: FunctionalComponent = () => {
	if (!navbarBrandLogo.value) return null;
	const img = h('img', {
		class: 'logo',
		src: withBase(navbarBrandLogo.value),
		alt: navbarBrandTitle.value,
	});
	if (themeLocale.value.logoDark === undefined) {
		return img;
	}
	// 用＜ClientOnly＞包装 logo 标志以避免 ssr 不匹配
  	// 在黑暗模式下使用其他 logo
	return h(ClientOnly, () => img);
};
</script>
