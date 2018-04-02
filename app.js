const koa = require('koa');
const app = new koa();
const serve = require('koa-static');
const route = require('koa-route');

app.use(serve(__dirname + '/static'));

app.use(route.post('/signature', async function(ctx,next){
    ctx.body = '<p>test</p>'
}))


app.listen(3000);

console.log('listening on port 3000');