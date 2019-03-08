/** 
 * 通过上下文赋值可代替 res.end()
 * 洋葱模型的中间件机制
 * 最简 koa 实现
*/

const http = require('http');
const Emitter = require('events');
const compose = require('./compose');

/** 
 * 通用上下文
*/
const context = {
    _body: null,

    get body() {
        return this._body;
    },

    set body(val) {
        this._body = val;
        this.res.end(this._body);
    }
};

class SimpleKoa extends Emitter {
    constructor() {
        super();
        this.middleware = [];
        this.context = Object.create(context);
    }

    /** 
     * 服务事件监听
    */
    listen(...args) {
        const server = http.createServer(this.callback());
        return server.listen(...args);
    }

    /** 
     * 中间件注册
    */
    use(fn) {
        if (typeof fn === 'function') {
            this.middleware.push(fn);
        }
    }

    /** 
     * 中间件总回调
    */
    callback() {
        if (this.listeners('error').length === 0) {
            this.on('error', this.onerror);
        }

        const handleRequest = (req, res) => {
            let context = this.createContext(req, res);
            let middleware = this.middleware;

            // 执行中间件
            compose(middleware)(context).catch(err => this.onerror(err));
        };
        return handleRequest;
    }

    /** 
     * 异常处理
    */
    onerror(err) {
        console.log(err);
    }

    /** 
     * 创建通用上下文
    */
    createContext(req, res) {
        let context = Object.create(this.context);
        context.req = req;
        context.res = res;
        return context;
    }
}

module.exports = SimpleKoa;

const app = new SimpleKoa();
const PORT = 3001;

app.use(async ctx => {
    ctx.body = '<p>this is a body</p>';
});

app.listen(PORT, () => {
    console.log(`the web server is starting at port ${PORT}`);
});