import { defineClientConfig } from '@vuepress/client';
import { h } from 'vue';
import { Badge, CodeGroup, CodeGroupItem } from './components/global/index.js';
import { setupDarkMode, setupSidebarItems, useScrollPromise, } from './composables/index.js';
import Layout from './layouts/Layout.vue';
import NotFound from './layouts/NotFound.vue';
import './styles/index.scss';

// 客户端配置
export default defineClientConfig({
    /**
     * 会在客户端应用创建后被调用，可以对 Vue 应用添加各种能力
     *
     * app: Vue 应用实例
     * router: 路由实例
     * siteData: 用户配置生成的 Ref 对象，包含 base, lang, title, description, head 和 locales
     */
    enhance({ app, router }) {
        // 注册 Vue 全局组件 Badge
        app.component('Badge', Badge);
        app.component('CodeGroup', CodeGroup);
        app.component('CodeGroupItem', CodeGroupItem);
        // compat with @vuepress/plugin-external-link-icon
        app.component('AutoLinkExternalIcon', () => {
            const ExternalLinkIcon = app.component('ExternalLinkIcon');
            if (ExternalLinkIcon) {
                return h(ExternalLinkIcon);
            }
            return null;
        });
        // compat with @vuepress/plugin-docsearch and @vuepress/plugin-search
        app.component('NavbarSearch', () => {
            const SearchComponent = app.component('Docsearch') || app.component('SearchBox');
            if (SearchComponent) {
                return h(SearchComponent);
            }
            return null;
        });
        
        // handle scrollBehavior with transition
        const scrollBehavior = router.options.scrollBehavior;
        router.options.scrollBehavior = async (...args) => {
            await useScrollPromise().wait();
            return scrollBehavior(...args);
        };
    },
    setup() {
        setupDarkMode();
        setupSidebarItems();
    },
    layouts: {
        Layout,
        NotFound,
    },
});
