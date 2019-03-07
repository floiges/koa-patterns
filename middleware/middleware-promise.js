let context = {
    data: []
};

async function middleware1(ctx, next) {
    console.log('action 1');
    ctx.data.push(1);
    await next();
    console.log('action 6');
    ctx.data.push(6);
}

async function middleware2(ctx, next) {
    console.log('action 2');
    ctx.data.push(2);
    await next();
    console.log('action 5');
    ctx.data.push(5);
}

async function middleware3(ctx, next) {
    console.log('action 3');
    ctx.data.push(3);
    await next();
    console.log('action 4');
    ctx.data.push(4);
}

Promise.resolve(middleware1(context, async () => {
    return Promise.resolve(middleware2(context, async () => {
        return Promise.resolve(middleware3(context, async () => {
            return Promise.resolve();
        }));
    }));
})).then(() => {
    console.log('end');
    console.log('context = ', context);
});