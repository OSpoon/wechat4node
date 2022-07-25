import { Controller } from 'egg';

export default class HomeController extends Controller {
  public async index() {
    const { ctx } = this;
    ctx.body = '';
  }

  public async checkOrigin() {
    const { ctx } = this;
    const { signature, timestamp, nonce, echostr } = ctx.query;
    const result = await ctx.service.weChat.checkSignature(
      signature,
      timestamp,
      nonce,
    );
    ctx.body = result ? echostr : '';
  }

  public async token() {
    const { ctx } = this;
    ctx.body = await ctx.service.weChat.getToken();
  }

  public async ticket() {
    const { ctx } = this;
    ctx.body = await ctx.service.weChat.getTicket();
  }

  public async signature() {
    const { ctx } = this;
    const { url } = ctx.request.body;
    console.log('[ url ] >', url);
    ctx.body = await ctx.service.weChat.genSignature(url);
  }
}
