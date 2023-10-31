import { onMounted } from 'vue';
import cssVars from '../styles/_variables.module.scss';

export var DeviceType;
(function (DeviceType) {
    DeviceType["MOBILE"] = "mobile";
})(DeviceType || (DeviceType = {}));

const DeviceTypeMap = { [DeviceType.MOBILE]: Number.parseInt(cssVars.mobile?.replace('px', ''), 10) };


/**
 * 添加侦听器以通过设备类型检测屏幕
 */
export const useUpdateDeviceStatus = (deviceType, callback) => {
    const width = DeviceTypeMap[deviceType];
    if (!Number.isInteger(width)) {
        if (__VUEPRESS_DEV__) throw new Error('设备宽度必须是整数！');
        return;
    }
    onMounted(() => {
        callback(width);
        window.addEventListener('resize', () => callback(width), false);
        window.addEventListener('orientationchange', () => callback(width), false);
    });
};
