import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.dev' });
import RPCClient from '@alicloud/pop-core';

export class AlyIotService {
  private client: RPCClient;
  private regionId: string;
  private productKey: string;

  constructor(regionId: string, accessKeyId: string, accessKeySecret: string, productKey: string) {
    this.regionId = regionId;
    this.productKey = productKey;
    this.client = new RPCClient({
      endpoint: `https://iot.${regionId}.aliyuncs.com`,
      apiVersion: '2018-01-20',
      accessKeyId,
      accessKeySecret,
    });
  }

  /**
   * 调用阿里云设备属性设置（SetDeviceProperty）
   */
  async setDeviceProperty(deviceName: string, items: Record<string, any>) {
    const params = {
      RegionId: this.regionId,
      ProductKey: this.productKey,
      DeviceName: deviceName,
      Items: JSON.stringify(items),
    };
    return this.client.request('SetDeviceProperty', params, { method: 'POST' });
  }
}

// 通过环境变量初始化全局单例
export const alyIotService = new AlyIotService(
  process.env.IOT_REGION_ID || 'cn-shanghai',
  process.env.IOT_ACCESS_KEY_ID!,
  process.env.IOT_ACCESS_KEY_SECRET!,
  process.env.IOT_PRODUCT_KEY || 'ia66OXimz4V'
);
