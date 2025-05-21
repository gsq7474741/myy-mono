import { AppDataSource } from '../db/orm/data-source';
import { User } from '../entity/User';
import { Context } from 'hono';
//import SmsService from '../services/sms_service';
import { generateSecureRandomCode } from '../utils/randomCodeGenerator';
import * as dotenv from 'dotenv';
import { handleErrorResponse, handleSuccessResponse } from '../utils/response';
import { And, Any, In } from 'typeorm';
import { error } from 'console';
import { UserDevMapping } from '../entity/UserDevMapping';
import * as fs from 'fs';
import { Device } from '../entity/Device';
import * as os from 'os';
import { MaintenanceOrders } from '../entity/MaintenanceOrders';
import { createModuleLogger } from '../utils/logger';
import { generateToken } from '../middleware/auth';
import path from 'path';
import ossClient from '../services/ossClient';

import { pinyin } from 'pinyin-pro';
import { DataFluctuationService } from '../utils/fluctuation/dataFluctuation.service';


//import redisClient from '../services/redisClient';

// 加载 .env 文件
dotenv.config({ path: '.env.dev' });

// JWT密钥，实际应用中应该放在环境变量中
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';


// 在类定义前添加logger
const userLogger = createModuleLogger('user_controller');

const dataFluctuationService = new DataFluctuationService();


export class UserController {
    async getWeather(c: Context) {
        // 这里实现获取天气的逻辑
        // 可能需要调用第三方天气API
        // 返回格式应与现有接口保持一致
        try {
            // 从查询参数中获取 location
            const queryParams = c.req.query();
            let location = queryParams['location'];

            // 验证 location 是否有效
            if (!location) {
                return handleErrorResponse(c, '缺少 location 参数', 400);
            }
            // 使用
            location = pinyin(location, {
                toneType: 'none', // 不带声调
                type: 'string'    // 返回字符串

            }).replace(/\s+/g, ''); // 手动去除所有空格;
            userLogger.info({ location }, '请求天气信息，location参数');


            // 这里可以添加调用天气API的逻辑
            // const weatherData = await weatherApi.get(location);
            // 调用心知天气API
            const apiKey = 'S6TcPcSG5FNZconAv'; // 你的API密钥
            const apiUrl = `https://api.seniverse.com/v3/weather/now.json?key=${apiKey}&location=${location}&language=zh-Hans&unit=c`;

            const response = await fetch(apiUrl);
            const data = await response.json();
            userLogger.debug({ data }, '天气API返回数据');

            // 处理API返回数据
            // 定义一个接口来明确 data 的类型
            interface WeatherApiResponse {
                results: any[];
            }

            // 假设 data 是 WeatherApiResponse 类型
            const typedData = data as WeatherApiResponse;
            if (!typedData.results || typedData.results.length === 0) {
                return handleErrorResponse(c, '未找到该地点的天气信息', 404);
            }

            // 前面已定义 WeatherApiResponse 接口明确 data 类型，这里使用 typedData 替代 data
            const weatherInfo = typedData.results[0];

            // 返回格式化后的天气数据
            return handleSuccessResponse(c, {
                location: weatherInfo.location.name,
                temperature: `${weatherInfo.now.temperature}°C`,
                condition: weatherInfo.now.text,
                lastUpdate: weatherInfo.last_update
            }, '天气信息获取成功', 200);

        } catch (error) {
            userLogger.error({ error }, '获取天气信息出错');
            return handleErrorResponse(c, '获取天气信息失败', 500, error);
        }
    }

    /**
     * 根据 user_id 查询所有匹配的订单信息
     * @param c - 请求上下文
     */
    async getOrdersByUserId(c: Context) {
        try {
            // 从查询参数中获取 user_id
            const queryParams = c.req.query();
            const user_id = queryParams['user_id'];

            // 验证 user_id 是否有效（不能为空且必须为数字）
            if (!user_id || isNaN(parseInt(user_id, 10))) {
                return handleErrorResponse(c, '无效或缺失的 user_id 参数', 400);
            }

            // 获取 MaintenanceOrders 表的 Repository
            const ordersRepository = AppDataSource.getRepository(MaintenanceOrders);

            // 查询所有 user_id 匹配的订单信息
            const orders = await ordersRepository.find({
                where: { user_id: parseInt(user_id, 10) }, // 确保 user_id 是数字类型
            });

            // 如果没有找到任何订单，返回空数组
            if (orders.length === 0) {
                return handleSuccessResponse(c, [], '未找到该用户的订单信息', 200);
            }

            // 返回成功响应，包含查询到的订单信息
            return handleSuccessResponse(c, orders, '订单信息查询成功', 200);
        } catch (error) {
            userLogger.error({ error }, '查询订单信息时出错');
            return handleErrorResponse(c, '查询订单信息失败', 500, error);
        }
    }
    //发起养护请求
    async maintenance_tree(c: Context) {
        try {
            // 解析请求体
            const requestBody = await c.req.json();

            const { user_id, dev_id, maintenance_categories } = requestBody;

            // 验证输入参数
            if (!user_id || !dev_id || !maintenance_categories) {
                return handleErrorResponse(c, 'Missing or invalid user_id or dev_id or maintenance_categories', 400);

            }

            // 获取 MaintenanceOrders 表的仓库
            const ordersRepository = AppDataSource.getRepository(MaintenanceOrders);

            // 创建新记录
            const newMaintenanceOrder = new MaintenanceOrders();

            newMaintenanceOrder.user_id = parseInt(user_id, 10); // 确保 user_id 是数字
            newMaintenanceOrder.dev_id = parseInt(dev_id, 10);   // 确保 dev_id 是数字
            newMaintenanceOrder.maintenance_categories = parseInt(maintenance_categories, 10);

            newMaintenanceOrder.create_time = new Date();        // 设置创建时间
            newMaintenanceOrder.is_completion = 0;               // 初始状态为未完成

            // 保存到数据库
            const savedOrder = await ordersRepository.save(newMaintenanceOrder);

            // 返回成功响应
            return handleSuccessResponse(c, savedOrder, 'Maintenance order created successfully', 200);
        } catch (error) {
            userLogger.error({ error }, '创建养护订单时出错');
            return handleErrorResponse(c, 'Failed to create maintenance order', 500, error);
        }
    }

    //上传工单 转人工
    async upload_work_order(c: Context) {
        try {
            // 解析请求体（假设是 JSON 格式）
            const body = await c.req.json();
            userLogger.info({ body }, '上传工单请求体');

            // 获取 order_id
            const orderId = body['order_id'];
            if (!orderId) {
                return handleErrorResponse(c, 'Invalid or missing order_id', 400);
            }

            // 获取维护订单的 Repository
            const ordersRepository = AppDataSource.getRepository(MaintenanceOrders);

            // 根据 order_id 查找现有记录
            const existingOrder = await ordersRepository.findOne({
                where: { id: orderId },
            });

            if (!existingOrder) {
                return handleErrorResponse(c, 'Order not found', 404);
            }

            // 创建新记录并复制现有数据
            const newOrder = new MaintenanceOrders();

            // 手动赋值现有字段（避免直接使用 Object.assign）
            newOrder.user_id = existingOrder.user_id;

            newOrder.dev_id = existingOrder.dev_id;

            newOrder.maintenance_categories = 1; // 修改为新的维护类别
            newOrder.create_time = new Date(); // 设置新的创建时间
            newOrder.completion_time = null; // 初始值为 null
            newOrder.is_completion = 0; // 初始值为未完成
            newOrder.user_images = existingOrder.user_images; // 复制图片信息
            newOrder.consultation_description = existingOrder.consultation_description; // 复制描述信息
            newOrder.model_advice = existingOrder.model_advice; // 复制模型建议
            newOrder.manual_advice = existingOrder.manual_advice; // 复制人工建议

            // 插入新记录到数据库
            const savedOrder = await ordersRepository.save(newOrder);

            // 返回成功响应
            return handleSuccessResponse(c, { newOrder: savedOrder }, 'Work order created successfully', 200);
        } catch (error) {
            userLogger.error({ error }, '上传工单出错');
            return handleErrorResponse(c, 'Failed to upload work order', 500, error);
        }

    }

    //上传问诊
    async upload_consultations(c: Context) {
        try {
            const ordersRepository = AppDataSource.getRepository(MaintenanceOrders);
            userLogger.info({ headers: c.req.header() }, '上传问诊请求头');
            // 解析请求体，启用 all 选项以支持多个文件
            const body = await c.req.parseBody();
            userLogger.info({ body }, '上传问诊请求体')
            // 获取 user_id 和 files
            const userId = body['user_id'] as string | null;
            const files = body['images[]'];
            const consultationDescription = body['consultation_description'] as string | null;

            const devId = body['dev_id'] as string | null;

            userLogger.info({ userId }, '上传问诊用户ID')
            userLogger.info({ files }, '上传问诊文件列表');
            userLogger.info({ consultationDescription }, '上传问诊描述')
            // 提取文件字段（支持单文件或多文件）

            const fileList = Array.isArray(files) ? files : [files]; // 确保是数组

            if (!userId || !devId) {
                return handleErrorResponse(c, "缺少user_id或者dev_id", 400, error)

            }
            if (!fileList || !Array.isArray(fileList)) {
                return handleErrorResponse(c, "没有上传有效文件", 401)
            }

            // 确保 files 是一个数组
            const imageUrls = await Promise.all(
                fileList.map(async (file) => {
                    // 检查 file 是否是 File 对象
                    if (!(file instanceof File)) {
                        return handleErrorResponse(c, "上传文件不正确", 400, error)
                    }

                    // 创建临时目录（如果不存在）
                    const tmpDir = os.tmpdir();
                    if (!fs.existsSync(tmpDir)) {
                        fs.mkdirSync(tmpDir);
                    }
                    // 创建临时文件路径
                    const tempFilePath = path.join(tmpDir, `${Date.now()}-${file.name}`);
                    const buffer = Buffer.from(await file.arrayBuffer());

                    // 将文件保存到临时目录
                    fs.writeFileSync(tempFilePath, buffer);

                    // 生成唯一的文件名，并加入 images/{user_id} 文件夹
                    const uniqueFileName = `images/${userId}/${Date.now()}-${Math.random().toString(36).substring(7)}${path.extname(file.name)}`;
                    // 上传到 OSS
                    const result = await ossClient.put(uniqueFileName, tempFilePath);

                    // 删除临时文件
                    fs.unlinkSync(tempFilePath);

                    // 返回文件的访问 URL
                    return result.url;
                })
            );
            // 插入数据到 maintenance_orders 表
            const maintenanceOrderRepository = AppDataSource.getRepository(MaintenanceOrders);
            const newMaintenanceOrder = new MaintenanceOrders();


            newMaintenanceOrder.user_id = parseInt(userId, 10); // 确保 user_id 是数字
            newMaintenanceOrder.dev_id = parseInt(devId, 10); // 确保 user_id 是数字
            newMaintenanceOrder.maintenance_categories = 0; // 0 表示问诊
            newMaintenanceOrder.create_time = new Date(); // 当前时间
            newMaintenanceOrder.completion_time = new Date(); // 初始值为 null
            newMaintenanceOrder.is_completion = 0; // 初始值为 0（未完成）
            newMaintenanceOrder.user_images = imageUrls; // 图片 URL 数组
            newMaintenanceOrder.consultation_description = consultationDescription || null; // 描述信息            const result = '调用大模型接口的返回';//这边准备上传图片和描述 大模型返回一个结果
            const result = "大模型返回的信息 你的树木是缺水了";//大模型接口 传描述和图片信息
            newMaintenanceOrder.model_advice = result;
            // 返回上传结果

            // 保存到数据库
            const savedOrder = await maintenanceOrderRepository.save(newMaintenanceOrder);
            return handleSuccessResponse(c, savedOrder, "上传成功", 200)
        } catch (error) {
            userLogger.error({ error }, '上传问诊出错');
            return handleErrorResponse(c, "上传失败", 500, error)
        }
    }
    //获取一个树木的订单养护列表
    async getTaskList(c: Context) {
        const ordersRepository = AppDataSource.getRepository(MaintenanceOrders);
        const { id } = c.req.param();
        userLogger.info({ id }, '获取任务列表，树木ID');
        // 验证 id 是否有效（例如，是否为数字）
        if (!id || isNaN(parseInt(id, 10))) {
            return handleErrorResponse(c, 'Invalid or missing user_id parameter', 400);
        }
        try {
            const oreders = await ordersRepository.find({
                where: { id: parseInt(id, 10) },
            });
            return handleSuccessResponse(c, oreders);
        } catch (error) {
            console.error('Error fetching users:', error); // 添加日志输出
            return handleErrorResponse(c, '查找失败', 500, error);
        }
    }
    async getUsers(c: Context) {
        const userRepository = AppDataSource.getRepository(User);
        try {

            const users = await userRepository.find();
            return handleSuccessResponse(c, users);
        } catch (error) {
            console.error('Error fetching users:', error); // 添加日志输出
            return handleErrorResponse(c, '查找失败', 500, error);
        }
    }
    async getMyDev(c: Context) {
        const userDevMappingRepository = AppDataSource.getRepository(UserDevMapping);
        const devRepository = AppDataSource.getRepository(Device);
        try {
            // 从请求参数中获取 user_id
            const user_id = c.req.query('user_id');
            userLogger.info({ user_id }, '获取用户设备，用户ID');
            if (!user_id || isNaN(parseInt(user_id, 10))) {
                return handleErrorResponse(c, 'Invalid or missing user_id parameter', 400);
            }
            // dataFluctuationService.updateWithFluctuation();
            // 查找用户设备映射表中的记录
            // console.log("到这儿了吗？");
            const parsedUserId = parseInt(user_id, 10);
            userLogger.info({ parsedUserId }, '解析后用户ID');
            const userDevMappings = await userDevMappingRepository.find({
                where: { user_id: parsedUserId },
            });
            userLogger.debug({ userDevMappings }, '用户设备映射');
            // 提取所有的 dev_id
            const devIds = userDevMappings.map(mapping => mapping.dev_id);
            userLogger.debug({ devIds }, '用户设备ID列表');
            // 根据 dev_id 查询设备表
            const devices = await devRepository.find({
                where: { id: In(devIds) }, // 使用 In 操作符查找多个 dev_id
            });
            userLogger.debug({ devices }, '用户设备列表');
            return handleSuccessResponse(c, devices);
        }
        catch (error) {
            userLogger.error({ error }, '获取设备列表出错');
            return handleErrorResponse(c, 'Failed to fetch devices', 500, error);
        }
    }
    async getMyDevHealth(c: Context) {
        const devRepository = AppDataSource.getRepository(Device);
        try {
            const device_id = c.req.query('device_id');
            if (!device_id || isNaN(parseInt(device_id, 10))) {
                return handleErrorResponse(c, 'Invalid or missing device_id parameter', 400);
            }
            const devIdNum = parseInt(device_id, 10);
            const device = await devRepository.findOneBy({ id: devIdNum });
            if (!device) {
                return handleErrorResponse(c, 'Device not found', 404);
            }
            let status = '健康';
            if (device.SoilHumidity > 50) {
                status = '积水';
            } else if (device.SoilHumidity < 15) {
                status = '干旱';
            } else {
                const timeMs = device.time.toString().length === 10 ? device.time * 1000 : device.time;
                const date = new Date(timeMs);
                const hourInShanghai = parseInt(date.toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai', hour12: false, hour: '2-digit' }), 10);
                if (device.LightLux < 1500 && hourInShanghai < 18) {
                    status = '缺光照';
                }
            }
            return handleSuccessResponse(c, { dev_id: device.id, status }, '设备健康状态获取成功', 200);
        } catch (error) {
            userLogger.error({ error }, '获取设备健康信息出错');
            return handleErrorResponse(c, 'Failed to fetch device health', 500, error);
        }
    }

async postMyDevWaterSwitch(c: Context) {
    userLogger.info({ params: c.req.param() }, '[postMyDevWaterSwitch] 请求收到');
    try {
        const { id } = c.req.param(); // 用户id
        userLogger.info({ id }, '[postMyDevWaterSwitch] 用户id');
        const userRepository = AppDataSource.getRepository(User);
        const userDevMappingRepository = AppDataSource.getRepository(UserDevMapping);
        const deviceRepository = AppDataSource.getRepository(Device);
        const parsedUserId = parseInt(id, 10);
        if (isNaN(parsedUserId)) {
            userLogger.warn({ id }, '[postMyDevWaterSwitch] 用户id不是数字');
            return handleErrorResponse(c, 'Invalid or missing user_id parameter', 400);
        }
        // 1. 查用户
        const user = await userRepository.findOneBy({ id: id });
        if (!user) {
            return handleErrorResponse(c, '没找到该用户', 404);
        }
        // 2. 读取前端传来的设备ID和开关状态
        const body = await c.req.json();
        const { deviceId, switch: switchStatus } = body;
        userLogger.info({ deviceId, switchStatus }, '[postMyDevWaterSwitch] deviceId与switch参数');
        const parsedDeviceId = parseInt(deviceId, 10);
        if (isNaN(parsedDeviceId)) {
            userLogger.warn({ deviceId }, '[postMyDevWaterSwitch] deviceId不是数字');
            return handleErrorResponse(c, 'deviceId参数错误', 400);
        }
        if (typeof switchStatus !== 'number' || ![0, 1].includes(switchStatus)) {
            userLogger.warn({ switchStatus }, '[postMyDevWaterSwitch] switch参数错误');
            return handleErrorResponse(c, 'switch参数错误，只能为0或1', 400);
        }
        // 3. 校验设备是否属于该用户
        const mapping = await userDevMappingRepository.findOneBy({ user_id: parsedUserId, dev_id: parsedDeviceId });
        userLogger.debug({ mapping }, '[postMyDevWaterSwitch] 设备和用户绑定关系');
        if (!mapping) {
            return handleErrorResponse(c, '该设备未绑定到该用户', 403);
        }
        // 4. 查设备
        const device = await deviceRepository.findOneBy({ id: parsedDeviceId });
        userLogger.debug({ device }, '[postMyDevWaterSwitch] 查到的设备');
        if (!device) {
            return handleErrorResponse(c, '设备不存在', 404);
        }
        // 5. 调用阿里云物模型下发
        const { alyIotService } = await import('../services/alyIot');
        userLogger.info({ deviceName: device?.deviceName, switchStatus }, '[postMyDevWaterSwitch] 即将调用阿里云物模型下发');
        try {
            const res = await alyIotService.setDeviceProperty(device.deviceName, { WaterOutletSwitch: switchStatus });
            userLogger.info({ res }, '[postMyDevWaterSwitch] 阿里云下发返回');
            // 6. 更新本地数据库设备状态
            device.WaterOutletSwitch = switchStatus;
            await deviceRepository.save(device);
            userLogger.info({ device }, '[postMyDevWaterSwitch] 本地数据库设备状态已更新');
            return handleSuccessResponse(c, res, '下发成功', 200);
        } catch (iotErr) {
            userLogger.error({ iotErr }, '[postMyDevWaterSwitch] 阿里云下发异常');

            return handleErrorResponse(c, '阿里云下发失败', 500, iotErr);
        }
    } catch (error) {
        userLogger.error({ error }, '[postMyDevWaterSwitch] 执行异常');
        return handleErrorResponse(c, '出错了', 500, error);
    }
}


    async getUserById(c: Context) {
        try {
            const { id } = c.req.param();
            const userRepository = AppDataSource.getRepository(User);
            const user = await userRepository.findOneBy({ id: id });
            if (!user) {
                return handleErrorResponse(c, '没找到该用户', 404, error)
            }

            return handleSuccessResponse(c, user)
        } catch (error) {
            userLogger.error({ error }, '获取用户信息出错');
            return handleErrorResponse(c, '出错了', 404, error)
        }
    }
    // //实现发送验证码的功能
    // async getVerifaction(phone: string) {
    //     try {
    //         const smsService = new SmsService();

    //         // 从环境变量中读取 signName 和 templateCode
    //         const signName = process.env.SIGN_NAME;
    //         const templateCode = process.env.TEMPLATE_CODE;
    //         const code = generateSecureRandomCode(6); // 示例验证码，可以随机生成


    //         if (!signName || !templateCode) {
    //             throw new Error('Missing required environment variables for SMS service');
    //         }

    //         const result = await smsService.sendVerificationCode(phone, code, signName, templateCode);

    //         if (result.success) {
    //             console.log('验证码发送成功');
    //         } else {
    //             console.error('验证码发送失败');
    //         }
    //     } catch (error) {
    //         if (error instanceof Error) { // 进行类型检查和断言
    //             console.error('处理过程中发生错误:', error.message);
    //         } else {
    //             console.error('处理过程中发生未知错误:', error);
    //         }
    //     }
    // }

    // //实现发送验证码的功能
    // async register(c: Context) {
    //     try {
    //         const requestBody = await c.req.json();
    //         const { phone, verificationCode } = requestBody;

    //         if (!phone || !verificationCode) {
    //             return handleErrorResponse(c, 'Phone number and verification code are required', 400);
    //         }

    //         // 从 Redis 获取验证码
    //         const storedVerificationCode = await redisClient.get(`verification:${phone}`);

    //         if (!storedVerificationCode) {
    //             return handleErrorResponse(c, 'No verification code found for this phone number', 400);
    //         }

    //         if (storedVerificationCode !== verificationCode) {
    //             return handleErrorResponse(c, 'Invalid verification code', 400);
    //         }

    //         // 清除已验证的验证码
    //         await redisClient.del(`verification:${phone}`);

    //         // 执行注册逻辑，例如保存用户信息到数据库
    //         const userRepository = AppDataSource.getRepository(User);
    //         const newUser = new User();
    //         newUser.phone = phone;

    //         // 设置其他必要的用户属性
    //         await userRepository.save(newUser);

    //         return handleSuccessResponse(c, null, 'User registered successfully', 200);
    //     } catch (error) {
    //         console.error('Error during registration:', error);
    //         return handleErrorResponse(c, 'Internal Server Error', 500, error);
    //     }
    // }
    //登录的逻辑实现
    async login(c: Context) {
        try {
            const requestBody = await c.req.json();
            const { user_name, password, phone, verificationCode } = requestBody;

            if (user_name && password) {
                // 用户名和密码登录
                userLogger.info({ user_name }, '用户名密码登录请求');
                let result = await this.loginByUsernameAndPassword(user_name, password);

                // 生成 JWT token
                const token = await generateToken(
                    {
                        id: result.user.id,
                        user_name: result.user.user_name,
                        phone: result.user.phone,
                        exp: Math.floor(Date.now() / 1000) + 31536000, // Token expires in 1 year

                        // 添加其他你想要包含在 token 中的用户信息
                    }
                );
                userLogger.info({ token }, '登录成功，生成token');

                // 返回用户信息和 token
        return handleSuccessResponse(c, { id: result.user.id, username: result.user.user_name, token }, "登录成功", 200);
            } else if (phone && verificationCode) {
                // 手机号和验证码登录逻辑保持不变
                return handleErrorResponse(c, '暂不支持验证码登录', 400);
            } else {
                return handleErrorResponse(c, 'Invalid parameters', 400);
            }
        } catch (error) {
            userLogger.error({ error }, '登录时发生异常');
            return handleErrorResponse(c, 'Internal Server Error', 500, error);
        }
    }
    //根据用户名和密码登录
    private async loginByUsernameAndPassword(username: string, password: string) {
        const userRepository = AppDataSource.getRepository(User);
        const user = await userRepository.findOne({ where: { user_name: username } });
        userLogger.debug({ user }, '登录时查到用户');
        if (!user) {
            throw new Error('User not found');
        }
        let isPasswordValid = false;
        if (password === user.password) {
            userLogger.info('密码校验通过');
            isPasswordValid = true;
        }
        else {
            isPasswordValid = false;
        }

        if (!isPasswordValid) {
            throw new Error('Invalid password');
        }

        // 登录成功，返回用户信息或生成 token 等操作
        return { success: true, user };
    }
    // //根据电电话号码和验证码登录
    // private async loginByPhoneAndVerificationCode(phone: string, verificationCode: string) {
    //     const userRepository = AppDataSource.getRepository(User);
    //     const user = await userRepository.findOne({ where: { phone } });

    //     if (!user) {
    //         throw new Error('User not found');
    //     }

    //     // 从 Redis 获取验证码
    //     const storedVerificationCode = await redisClient.get(`verification:${phone}`);

    //     if (!storedVerificationCode) {
    //         throw new Error('No verification code found for this phone number');
    //     }

    //     if (storedVerificationCode !== verificationCode) {
    //         throw new Error('Invalid verification code');
    //     }

    //     // 清除已验证的验证码
    //     await redisClient.del(`verification:${phone}`);

    //     // 登录成功，返回用户信息或生成 token 等操作
    //     return { success: true, user };
    // }


}
