import { useResolveRouteWithRedirect } from './useResolveRouteWithRedirect.js';
/**
 * 解析 NavLink
 * 
 * @example
 * - Input: '/README.md'
 * - Output: { text: 'Home', link: '/' }
 */
export const useNavLink = (item) => {
    // vue 路由路径是url编码的，希望用户使用主题配置中的非url编码字符串，因此需要对其进行url编码正确解析
    const resolved = useResolveRouteWithRedirect(encodeURI(item));
    return {
        text: resolved.meta.title || item,
        link: resolved.name === '404' ? item : resolved.fullPath,
    };
};
