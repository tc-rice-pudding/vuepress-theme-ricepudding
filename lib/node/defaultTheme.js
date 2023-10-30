import { activeHeaderLinksPlugin } from '@vuepress/plugin-active-header-links';
import { backToTopPlugin } from '@vuepress/plugin-back-to-top';
import { containerPlugin } from '@vuepress/plugin-container';
import { externalLinkIconPlugin } from '@vuepress/plugin-external-link-icon';
import { gitPlugin } from '@vuepress/plugin-git';
import { mediumZoomPlugin } from '@vuepress/plugin-medium-zoom';
import { nprogressPlugin } from '@vuepress/plugin-nprogress';
import { palettePlugin } from '@vuepress/plugin-palette';
import { prismjsPlugin } from '@vuepress/plugin-prismjs';
import { themeDataPlugin } from '@vuepress/plugin-theme-data';
import { fs, getDirname, path } from '@vuepress/utils';
import { assignDefaultLocaleOptions, resolveContainerPluginOptions, } from './utils/index.js';
const __dirname = getDirname(import.meta.url);

// 主题默认配置
export const defaultTheme = ({ themePlugins = {}, ...localeOptions } = {}) => {
    assignDefaultLocaleOptions(localeOptions);
    return {
        // 主题名称
        name: '@vuepress/theme-ricepudding',

        // 指定构建时使用的 HTML 模板
        templateBuild: path.resolve(__dirname, '../../templates/build.html'),

        // 别名 => @theme/Home.vue: 绝对路径、......
        alias: {
            ...Object.fromEntries(fs
                .readdirSync(path.resolve(__dirname, '../client/components'))
                .filter((file) => file.endsWith('.vue'))
                .map((file) => [
                `@theme/${file}`,
                path.resolve(__dirname, '../client/components', file),
            ])),
        },

        // Hooks 开发，会在生命周期的准备文件时处理
        clientConfigFile: path.resolve(__dirname, '../client/config.js'),

        // 该 Hook 可以用来在 Page 对象上添加额外的属性，或修改现有的属性
        extendsPage: (page) => {
            // 将相对文件路径保存到页面数据中以生成编辑链接
            page.data.filePathRelative = page.filePathRelative;
            // 将标题保存到路由元数据中以生成导航栏和侧边栏
            page.routeMeta.title = page.title;
        },

        // 主题中要使用的插件
        plugins: [
            // @vuepress/plugin-active-header-link
            themePlugins.activeHeaderLinks !== false
                ? activeHeaderLinksPlugin({
                    headerLinkSelector: 'a.sidebar-item',
                    headerAnchorSelector: '.header-anchor',
                    // should greater than page transition duration
                    delay: 300,
                })
                : [],
            // @vuepress/plugin-back-to-top
            themePlugins.backToTop !== false ? backToTopPlugin() : [],
            // @vuepress/plugin-container
            themePlugins.container?.tip !== false
                ? containerPlugin(resolveContainerPluginOptions(localeOptions, 'tip'))
                : [],
            themePlugins.container?.warning !== false
                ? containerPlugin(resolveContainerPluginOptions(localeOptions, 'warning'))
                : [],
            themePlugins.container?.danger !== false
                ? containerPlugin(resolveContainerPluginOptions(localeOptions, 'danger'))
                : [],
            themePlugins.container?.details !== false
                ? containerPlugin({
                    type: 'details',
                    before: (info) => `<details class="custom-container details">${info ? `<summary>${info}</summary>` : ''}\n`,
                    after: () => '</details>\n',
                })
                : [],
            themePlugins.container?.codeGroup !== false
                ? containerPlugin({
                    type: 'code-group',
                    before: () => `<CodeGroup>\n`,
                    after: () => '</CodeGroup>\n',
                })
                : [],
            themePlugins.container?.codeGroupItem !== false
                ? containerPlugin({
                    type: 'code-group-item',
                    before: (info) => `<CodeGroupItem title="${info}">\n`,
                    after: () => '</CodeGroupItem>\n',
                })
                : [],
            // @vuepress/plugin-external-link-icon
            themePlugins.externalLinkIcon !== false
                ? externalLinkIconPlugin({
                    locales: Object.entries(localeOptions.locales || {}).reduce((result, [key, value]) => {
                        result[key] = {
                            openInNewWindow: value.openInNewWindow ?? localeOptions.openInNewWindow,
                        };
                        return result;
                    }, {}),
                })
                : [],
            // @vuepress/plugin-git
            themePlugins.git !== false
                ? gitPlugin({
                    createdTime: false,
                    updatedTime: localeOptions.lastUpdated !== false,
                    contributors: localeOptions.contributors !== false,
                })
                : [],
            // @vuepress/plugin-medium-zoom
            themePlugins.mediumZoom !== false
                ? mediumZoomPlugin({
                    selector: '.theme-default-content > img, .theme-default-content :not(a) > img',
                    zoomOptions: {},
                    // should greater than page transition duration
                    delay: 300,
                })
                : [],
            // @vuepress/plugin-nprogress
            themePlugins.nprogress !== false ? nprogressPlugin() : [],
            // @vuepress/plugin-palette
            palettePlugin({ preset: 'sass' }),
            // @vuepress/plugin-prismjs
            themePlugins.prismjs !== false ? prismjsPlugin() : [],
            // @vuepress/plugin-theme-data
            themeDataPlugin({ themeData: localeOptions }),
        ],
    };
};
