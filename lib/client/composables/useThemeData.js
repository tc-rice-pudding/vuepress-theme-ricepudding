import { useThemeData as _useThemeData, useThemeLocaleData as _useThemeLocaleData, } from '@vuepress/plugin-theme-data/client';
export const useThemeData = () => _useThemeData(); // 返回主题数据的 Ref 对象
export const useThemeLocaleData = () => _useThemeLocaleData(); // 返回当前 locale 下主题数据的 Ref 对象
