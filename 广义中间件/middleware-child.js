/** 
 * 子中间件
 * 初始化中间件时，内置子中间件列表
 * 子中间件列表添加子中间件元素
 * 子中间件列表封装成间接中间件，然后被app.use()加载
 * 
*/

const Koa = require('koa');
let app = new Koa();

class Middleware {
    constructor() {
        this.stack = [];
    }

    get(path, childMiddleware) {
        this.stack.push({ path, middleware: childMiddleware });
    }

    middlewares() {
        let stack = this.stack;
        return async function(ctx, next) {
            let path = ctx.path;
            for(let i = 0; i < stack.length; i++) {
                const child = stack[i];
                if (child && child.path === path && child.middleware) {
                    await child.middleware(ctx, next);
                }
            }
            await next();
        }
    }
}

const middleware = new Middleware();
middleware.get('/page/001', async(ctx, next) => { ctx.body = 'page 001' });
middleware.get('/page/002', async(ctx, next) => { ctx.body = 'page 002' });
middleware.get('/page/003', async(ctx, next) => { ctx.body = 'page 003' });

app.use(middleware.middlewares());

app.listen(3000);

