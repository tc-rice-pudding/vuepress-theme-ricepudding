/**
 * 解析 @vuepress/plugin-container 配置项
 *
 * 自定义容器默认标题
 */
export const resolveContainerPluginOptions = (localeOptions, type) => {
    const locales = Object.entries(localeOptions.locales || {}).reduce((result, [key, value]) => {
        result[key] = {
            defaultInfo: value?.[type] ?? localeOptions[type],
        };
        return result;
    }, {});
    return {
        type,
        locales,
    };
};
