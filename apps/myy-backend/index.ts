import "reflect-metadata"
import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { AppDataSource } from "./src/db/orm/data-source"
import { createModuleLogger } from './src/utils/logger';
// 挂载子应用
import deviceRoutes from "./src/routes/device";
import miscRoutes from "./src/routes/misc";
import authRoutes from "./src/routes/auth";
import userRoutes from "./src/routes/user_route";


const indexLogger = createModuleLogger('index');

// 开发环境加载 .env 文件
if (process.env.NODE_ENV !== 'production') {
    const { config } = await import('dotenv');
    config({ path: '.env.dev' });
    indexLogger.info(".env files loaded in development mode");
}

// 创建应用
const app = new Hono();
const apiV1 = new Hono();

app.use('*', cors())
apiV1.use('*', cors())

// 示例
app.get('/', (c) => {
    return c.text('Hello Hono!')
})

// 示例
app.get('/posts/:id', (c) => {
    const page = c.req.query('page')
    const id = c.req.param('id')
    c.header('X-Message', 'Hi!')
    return c.text(`You want see ${page} of ${id}`)
})

apiV1.route('/device', deviceRoutes);
apiV1.route('/', miscRoutes);
apiV1.route('/', authRoutes);
apiV1.route('/', userRoutes);


// 将子应用挂载到主应用的 '/api/v1' 路径上

app.route('/api/v1', apiV1);

const port = parseInt(process.env.SRV_PORT || '3090');

AppDataSource.initialize().then(() => {
    indexLogger.info("App datasource initialized")
}).catch(error => indexLogger.error(error)).then(() => {
    serve({
        fetch: app.fetch,
        port
    })
}).then(() => {
    indexLogger.info(`Server is running on port ${port}`)
})
