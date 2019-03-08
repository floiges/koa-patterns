/** 
 * 原生的Node.js实现纯回调的中间件HTTP服务
 * 内置中间件队列
 * 中间件遍历机制
 * 异常处理机制
*/

const http = require('http');
const Emitter = require('events');

class WebServer extends Emitter {
    constructor() {
        super();
        this.middleware = [];
        this.context = Object.create({});
    }

    /** 
     * 服务事件监听
    */
    listen(...args) {
        const server = http.createServer(this.callback());
        return server.listen(...args);
    }

    /** 
     * 注册使用中间件
    */
    use(fn) {
        if (typeof fn === 'function') {
            this.middleware.push(fn);
        }
    }

    /** 
     * 中间件总回掉方法
    */
    callback() {
        let that = this;
        if (this.listeners('error').length === 0) {
            this.on('error', this.onerror);
        }

        const handleRequest = (req, res) => {
            let context = that.createContext(req, res);
            that.middleware.forEach((cb, idx) => {
                try {
                    cb(context);
                } catch(err) {
                    that.onerror(err);
                }

                if (idx + 1 >= that.middleware.length) {
                    if (res && typeof res.end === 'function') {
                        res.end();
                    }
                }
            });
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

module.exports = WebServer;

const app = new WebServer();
const PORT = 3001;

app.use(ctx => {
    ctx.res.write('<p>line 1</p>');
});

app.use(ctx => {
    ctx.res.write('<p>line 1</p>');
});

app.use(ctx => {
    ctx.res.write('<p>line 1</p>');
}); 

app.listen(PORT, () => {
    console.log(`the web server is starting at port ${PORT}`);
});
