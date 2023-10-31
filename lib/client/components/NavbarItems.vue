<template>
	<nav v-if="navbarLinks.length" class="navbar-items">
		<div v-for="item in navbarLinks" :key="item.text" class="navbar-item">
			<AutoLink :item="item" />
		</div>
	</nav>
</template>

<script setup lang="ts">
import AutoLink from '@theme/AutoLink.vue';
import { useRouteLocale, useSiteData, useSiteLocaleData } from '@vuepress/client';
import { isLinkHttp, isString } from '@vuepress/shared';
import { computed, ref } from 'vue';
import type { ComputedRef } from 'vue';
import { useRouter } from 'vue-router';
import {
	DeviceType,
	useNavLink,
	useThemeData,
	useThemeLocaleData,
} from '../composables/index.js';
import { resolveRepoType } from '../utils/index.js';

/**
 * 获取仓库链接的导航栏配置
 */
const useNavbarRepo = (): ComputedRef => {
	const themeLocale = useThemeLocaleData();
	const repo = computed(() => themeLocale.value.repo);
	const repoType = computed(() => (repo.value ? resolveRepoType(repo.value) : null));

	const repoLink = computed(() => {
		if (repo.value && !isLinkHttp(repo.value)) {
			return `https://github.com/${repo.value}`;
		}
		return repo.value;
	});

	const repoLabel = computed(() => {
		if (!repoLink.value) return null;
		if (themeLocale.value.repoLabel) return themeLocale.value.repoLabel;
		if (repoType.value === null) return 'Source';
		return repoType.value;
	});

	return computed(() => {
		if (!repoLink.value || !repoLabel.value) {
			return [];
		}
		return [{ text: repoLabel.value, link: repoLink.value }];
	});
};

/**
 * 解析导航栏 item，string/{}
 */
const resolveNavbarItem = (item) => {
	if (isString(item)) {
		return useNavLink(item);
	}

	if (item.children) {
		return {
			...item,
			children: item.children.map(resolveNavbarItem),
		};
	}
	return item;
};

/**
 * 获取所有导航栏 item[]
 */
const useNavbarConfig = (): ComputedRef => {
	const themeLocale = useThemeLocaleData();
	return computed(() => (themeLocale.value.navbar || []).map(resolveNavbarItem));
};


const navbarConfig = useNavbarConfig();
const navbarRepo = useNavbarRepo();
const navbarLinks = computed(() => [...navbarConfig.value, ...navbarRepo.value]);
</script>
