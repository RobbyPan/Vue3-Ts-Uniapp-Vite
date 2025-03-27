/**
 * 米转换为千米
 * @param m 米数
 */
export const mToKm = (m: number, type: 'string' | 'number' = 'string') => {
  return {
    string: `${m / 1000}公里`,
    number: m / 1000,
  }[type];
};

/**
 * uni跳转带参数
 * @param url 跳转链接
 * @param params 参数对象
 */
export const uniJump = (url: string, params?: { [key: string]: any }) => {
  let query;
  if (params) {
    query = Object.keys(params)
      .map((key) => `${key}=${params[key]}`)
      .join('&');
  }
  const URL = params ? `${url}?${query}` : url;
  uni.navigateTo({
    url: URL,
  });
};

/**
 * 检查是否是当前页面
 */
export const currentPageCheck = (route: string) => {
  const page = getCurrentPages()[0].route as string;
  return page.includes(route);
};

/**
 * 获取URL参数
 * @param path 路径
 * @param name 参数名
 */
export const getQueryString = (path: string, name: string) => {
  const reg = new RegExp('(^|\\?|&)' + name + '=([^&]*)(\\s|&|$)', 'i');
  if (reg.test(path)) {
    return unescape(RegExp.$2.replace(/\+/g, ' '));
  }
  return '';
};

import { format } from 'date-fns';
/**
 * 获取当前时间
 * @param formats 时间格式 默认：YYYY-MM-DD HH:mm:ss
 */
export const getCurrentTime = (formats: string = 'YYYY-MM-DD HH:mm:ss') => {
  return format(new Date(), 'yyyy-MM-dd HH:mm:ss');
};
