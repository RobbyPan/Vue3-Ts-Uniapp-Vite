import { request } from '@/utils/request';

/**
 * 根据configKey获取配置value
 */
export function getConfigValue(configKey: string): Promise<any> {
  return request({
    url: `/system/config/configKey/${configKey}`,
    method: 'GET',
  });
}
