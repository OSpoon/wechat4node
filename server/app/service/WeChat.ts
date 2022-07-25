import { SHA1 } from 'crypto-js';
import { Service } from 'egg';

const APPID = '';
const APPSECRET = '';
const TOKEN = 'TOKEN';

const URL_TOKEN = `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${APPID}&secret=${APPSECRET}`;
const URL_TICKET =
  'https://api.weixin.qq.com/cgi-bin/ticket/getticket?type=jsapi';

const cache: {
  token: {
    access_token: string | undefined;
    expires_in: number;
    last_time: number;
  };
  ticket: {
    ticket: string | undefined;
    expires_in: number;
    last_time: number;
  };
} = {
  token: {
    access_token: undefined,
    expires_in: 0,
    last_time: 0,
  },
  ticket: {
    ticket: undefined,
    expires_in: 0,
    last_time: 0,
  },
};

/**
 * WeChartService
 */
export default class WeChat extends Service {
  public async checkSignature(
    signature: string,
    timestamp: string,
    nonce: string,
  ) {
    const own = SHA1([ TOKEN, timestamp, nonce ].sort().join('')).toString();
    return own === signature;
  }

  public async getToken() {
    const { ctx } = this;
    const request = async () => {
      const { data } = await ctx.curl(URL_TOKEN, { dataType: 'json' });
      const { access_token, expires_in } = data;
      console.log('[ token data ] >', data);
      cache.token = {
        access_token,
        expires_in,
        last_time: Date.now() + expires_in * 1000,
      };
    };
    if (!cache.token.access_token) {
      console.log('[ token 还没有~ ] ');
      await request();
    } else {
      if (Date.now() > cache.token.last_time) {
        console.log('[ token 超时了 ] ');
        await request();
      }
    }
    return cache.token;
  }

  public async getTicket() {
    const { ctx } = this;
    const request = async () => {
      const { access_token } = await this.getToken();
      const { data } = await ctx.curl(URL_TICKET, {
        dataType: 'json',
        method: 'GET',
        data: {
          access_token,
        },
      });
      const { ticket, expires_in } = data;
      console.log('[ ticket data ] >', data);
      cache.ticket = {
        ticket,
        expires_in,
        last_time: Date.now() + expires_in * 1000,
      };
    };
    if (!cache.ticket.ticket) {
      console.log('[ ticket 还没有~ ] ');
      await request();
    } else {
      if (Date.now() > cache.ticket.last_time) {
        console.log('[ ticket 超时了 ] ');
        await request();
      }
    }
    return cache.ticket;
  }

  public async genSignature(url: string) {
    const { ticket: jsapi_ticket } = await this.getTicket();
    const noncestr = Math.random().toString(36).substr(2, 15);
    const timestamp = Date.now();
    const signature = SHA1(
      `jsapi_ticket=${jsapi_ticket}&noncestr=${noncestr}&timestamp=${timestamp}&url=${url}`,
    ).toString();
    return {
      appId: APPID,
      nonceStr: noncestr,
      timestamp,
      signature,
    };
  }
}
