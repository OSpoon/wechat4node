import { EggAppConfig, EggAppInfo, PowerPartial } from 'egg';

export default (appInfo: EggAppInfo) => {
  const config = {} as PowerPartial<EggAppConfig>;

  // override config from framework / plugin
  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1658752229125_4741';

  // add your egg config in here
  config.middleware = [];

  // add your special config in here
  const bizConfig = {
    sourceUrl: `https://github.com/eggjs/examples/tree/master/${appInfo.name}`,
  };

  // 跨域配置
  config.security = {
    // 关闭csrf
    csrf: {
      enable: false, // 这里不进行开启操作，日后配置鉴权
    },
    // 跨域白名单
    domainWhiteList: [ 'http://127.0.0.1:5500' ],
  };

  config.cors = {
    origin: '*',
    allowMethods: 'GET, PUT, POST,DELETE, PATCH',
  };

  // the return config will combines to EggAppConfig
  return {
    ...config,
    ...bizConfig,
  };
};
