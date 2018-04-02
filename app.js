const koa = require('koa');
const app = new koa();
const serve = require('koa-static');
const route = require('koa-route');
const axios = require('axios');
const sha1 = require('sha1');

function getNonceStr () {
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for(var i = 0; i < 16; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}

const wx = {
	appId: 'wxccccf3983420e246',
	appsecret: 'e2b31f5c67da0f77fe048188a28467f5',
	timestamp: '',
	nonceStr: '',
	signature: '',
	access_token: '',
	api_ticket: '',
	url:'http://claire.free.ngrok.cc/index.html'
}
async function getToken (id) {
  return axios.get('https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid='+id+'&secret='+wx.appsecret)
}
async function getTicket (token) {
	return axios.get('https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token='+token+'&type=wx_card')
}


app.use(serve(__dirname + '/static'));

app.use(route.post('/signature', async function(ctx,next){
	const token = await getToken(wx.appId);
	wx.access_token = token.data.access_token;
	const ticket = await getTicket(wx.access_token);
	wx.api_ticket = token.data.ticket;
	wx.timestamp = Math.floor(Date.now()/1000) + '';
	wx.nonceStr = getNonceStr();
	const string = 'jsapi_ticket='+wx.api_ticket+'&noncestr='+wx.nonceStr+'&timestamp='+wx.timestamp+'&url='+wx.url;
	wx.signature = sha1(string);
    ctx.body = wx;
}))


app.listen(80);

console.log('listening on port 80');