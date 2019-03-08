/** 
 * 请求拦截
*/

const Koa = require('koa');
let app = new Koa();

const middleware = async function(ctx, next) {
    const reqPath = ctx.request.path;
    if (reqPath.indexOf('/path/') !== 0) {
        ctx.throw(500);
    }
    await next();
}

const page = async function(ctx, next) {
    ctx.body = `
        <html>
            <head></head>
            <body>
                <h1>${ctx.request.path}</h1>
            </body>
        </html>
    `; 
}

app.use(middleware);
app.use(page);

app.listen(3000);
