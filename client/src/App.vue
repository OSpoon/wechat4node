<script setup>
import { ref } from "vue";
import axios from "axios";
const message = ref("");
const status = ref("");
axios
  .post(`http://t2fzbb.natappfree.cc/signature`, {
    url: location.href.split("#")[0],
  })
  .then((res) => {
    const { appId, nonceStr, signature, timestamp } = res.data;
    console.log("[ res ] >", appId, nonceStr, signature, timestamp);
    wx.config({
      debug: true, // 开启调试模式,调用的所有 api 的返回值会在客户端 alert 出来，若要查看传入的参数，可以在 pc 端打开，参数信息会通过 log 打出，仅在 pc 端时才会打印。
      appId, // 必填，公众号的唯一标识
      timestamp, // 必填，生成签名的时间戳
      nonceStr, // 必填，生成签名的随机串
      signature, // 必填，签名
      jsApiList: ["updateAppMessageShareData"], // 必填，需要使用的 JS 接口列表
    });
    wx.error((res) => {
      message.value = res.errMsg;
    });
    wx.ready(() => {
      wx.checkJsApi({
        jsApiList: ["updateAppMessageShareData"], // 需要检测的 JS 接口列表，所有 JS 接口列表见附录2,
        success: (res) => {
          wx.updateAppMessageShareData({
            title: "我的掘金", // 分享标题
            desc: "我在掘金输出前端知识~", // 分享描述
            link: "https://juejin.cn/user/3966693685871694", // 分享链接，该链接域名或路径必须与当前页面对应的公众号 JS 安全域名一致
            imgUrl:
              "https://p9-passport.byteacctimg.com/img/user-avatar/71ca4682501063257d8413ff726105a0~300x300.images", // 分享图标
            success: function () {
              status.value = "设置成功";
            },
          });
        },
      });
    });
  });
</script>

<template>
  <h3 v-if="message">{{ message }}</h3>
  <h3 v-else>
    点击右上角=>分享给朋友
    <h5>{{ status }}</h5>
  </h3>
</template>

<style scoped>
</style>
