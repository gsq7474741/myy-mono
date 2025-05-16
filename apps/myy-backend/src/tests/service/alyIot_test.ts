import { alyIotService } from '../../services/alyIot';

async function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

(async () => {
  const deviceName = 'nanhai_test_2';
  try {
    // 先开
    const resOpen = await alyIotService.setDeviceProperty(deviceName, { WaterOutletSwitch: 1 });
    console.log('开关打开结果:', resOpen);
    // 等待3秒
    await delay(3000);
    // 再关
    const resClose = await alyIotService.setDeviceProperty(deviceName, { WaterOutletSwitch: 0 });
    console.log('开关关闭结果:', resClose);
  } catch (err) {
    console.error('属性下发失败:', err);
  }
})();
