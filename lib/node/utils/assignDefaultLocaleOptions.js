export const DEFAULT_LOCALE_OPTIONS = {
    // color mode
    colorMode: 'auto',
    colorModeSwitch: true,

    // navbar
    navbar: [],
    logo: null,
    repo: null,
    selectLanguageText: '语言',
    selectLanguageAriaLabel: '选择语言',

    // sidebar
    sidebar: 'auto',
    sidebarDepth: 2,

    // page meta
    editLink: true,
    editLinkText: '编辑此页面',
    lastUpdated: true,
    lastUpdatedText: '上次更新时间',
    contributors: true,
    contributorsText: '贡献者',

    // 404 page messages
    notFound: [
        `这里什么都没有`,
        `怎么会变成这样?`,
        `404 了哦`,
        `看起来你不知道要去哪里`,
    ],
    backToHome: '回到首页',

    // a11y
    openInNewWindow: '打开一个新窗口',
    toggleColorMode: '切换模式',
    toggleSidebar: '切换工具栏',
};
export const DEFAULT_LOCALE_DATA = {
    // navbar
    selectLanguageName: 'English',
};
/**
 * 合并默认配置
 */
export const assignDefaultLocaleOptions = (localeOptions) => {
    if (!localeOptions.locales) {
        localeOptions.locales = {};
    }
    if (!localeOptions.locales['/']) {
        localeOptions.locales['/'] = {};
    }
    Object.assign(localeOptions, {
        ...DEFAULT_LOCALE_OPTIONS,
        ...localeOptions,
    });
    Object.assign(localeOptions.locales['/'], {
        ...DEFAULT_LOCALE_DATA,
        ...localeOptions.locales['/'],
    });
};
