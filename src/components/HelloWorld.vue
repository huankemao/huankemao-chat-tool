<template>
  <div class="hello">
    <div class="content_box">
      <van-field v-model="name" center placeholder="请输入搜索内容">
        <template #button>
          <van-button size="small" type="primary" @click="search">搜索</van-button>
        </template>
      </van-field>

      <div class="group" @click="groupShoe">选择分组：{{ groupname }}</div>
      <van-tabs swipeable @click="tabClick" class="content">
        <van-tab
          v-for="index in classList"
          :title="index.name"
          :key="index.id"
          :name="index.id"
        >
          <van-radio-group v-model="radio">
            <van-cell-group>
              <van-cell
                center
                v-for="(item, index) in list"
                clickable
                :key="index"
                @click="CellClick(item)"
              >
                <template v-if="item.type == 1">
                  <span class="custom-title">{{ item.content }}</span>
                </template>
                <template v-else-if="item.type == 2">
                  <img :src="item.content" style="width: 50px; height: 50px" />
                  <p class="custom-title">{{ item.file_name }}</p>
                </template>
                <template v-else-if="item.type == 3">
                  <p class="custom-title">{{ item.title }}</p>
                  <img :src="item.cover" style="width: 50px; height: 50px" />
                </template>
                <template v-else-if="item.type == 5">
                  <p class="custom-title">{{ item.file_name }}</p>
                </template>
                <template v-else-if="item.type == 6">
                  <p class="custom-title">{{ item.title }}</p>
                  <img :src="item.cover" style="width: 50px; height: 50px" />
                </template>
                <template v-else-if="item.type == 7">
                  <p class="custom-title">{{ item.file_name }}</p>
                </template>
                <template v-else-if="item.type == 8">
                  <p class="custom-title">{{ item.title }}</p>
                  <img :src="item.cover" style="width: 50px; height: 50px" />
                </template>
                <template #right-icon>
                  <van-radio :name="item" />
                </template>
              </van-cell>
            </van-cell-group>
          </van-radio-group>
        </van-tab>
      </van-tabs>
    </div>

    <div class="button" @click="send()">发送</div>
    <van-popup v-model="show" round position="bottom">
      <van-picker
        show-toolbar
        :columns="columns"
        @cancel="show = false"
        @confirm="onConfirm"
      />
    </van-popup>
  </div>
</template>
<script>
import {
  Button,
  Field,
  Popup,
  Picker,
  Tab,
  Tabs,
  Cell,
  CellGroup,
  Checkbox,
  CheckboxGroup,
  RadioGroup,
  Radio,
  Toast,
} from "vant";
import axios from "axios";

export default {
  components: {
    [Button.name]: Button,
    [Field.name]: Field,
    [Popup.name]: Popup,
    [Picker.name]: Picker,
    [Tab.name]: Tab,
    [Tabs.name]: Tabs,
    [Cell.name]: Cell,
    [CellGroup.name]: CellGroup,
    [Checkbox.name]: Checkbox,
    [CheckboxGroup.name]: CheckboxGroup,
    [RadioGroup.name]: RadioGroup,
    [Radio.name]: Radio,
    [Toast.name]: Toast,
  },
  data: function () {
    return {
      name: "",
      classList: [],
      show: false,
      result: [],
      checked: "",
      columns: [],
      groupname: "所有",
      group_id: "",
      list: [],
      radio: "",
      couId: "",
      tabindex: "1",
      groupList: [],
      url: "",
      http: "../",
    };
  },
  watch: {
    $route(to, from) {
      console.log(to.path);
    },
  },
  created() {
    var code = this.getUrlCode().code;
    // this.getClass();
    if (localStorage.getItem('user_id')) {
      this.getClass()
    } else {
      if (code) {
        this.getmyId();
      } else {
        this.getAppid();
      }
    }
  },

  methods: {
    CellClick(e) {
      this.radio = e;
    },
    search() {
      axios
        .post("../admin.php/app_get_content_engine", {
          type: 3,
          content_type: this.tabindex,
          group_id: this.group_id,
          keyword: this.name,
          page: 1,
          limit: 1000,
        })
        .then((res) => {
          if (res.data.code == 200) {
            this.list = res.data.data;
            if (this.list) {
              this.list.map((item, index) => {
                var formdata = new FormData();
                if (item.type == 1) {
                  formdata.append(`arr[${index}][content_engine_title]`, item.content);
                } else if (item.type == 3 || item.type == 6) {
                  formdata.append(`arr[${index}][content_engine_title]`, item.title);
                } else {
                  formdata.append(`arr[${index}][content_engine_title]`, item.file_name);
                }
                formdata.append(
                  `arr[${index}][wx_user_id]`,
                  localStorage.getItem("user_id")
                );
                formdata.append(`arr[${index}][wx_customer_id]`, this.couId);
                formdata.append(`arr[${index}][search_name]`, this.name);
                formdata.append(
                  `arr[${index}][content_engine_group_id]`,
                  item.content_group_id
                );
                formdata.append(`arr[${index}][content_engine_type]`, item.type);
                formdata.append(`arr[${index}][content_engine_id]`, item.id);
                formdata.append(`type`, 1);
                axios
                  .post("../admin.php/content_operating", formdata, {
                    headers: {
                      "Content-Type": "application/x-www-form-urlencoded",
                    },
                  })
                  .then((res) => {
                    if (res.data.code == 200) {
                    }
                  });
              });
            }
          }
        });
    },
    getUrlCode() {
      // 截取url中的code方法
      var url = location.search;
      var theRequest = new Object();
      if (url.indexOf("?") != -1) {
        var str = url.substr(1);
        var strs = str.split("&");
        for (var i = 0; i < strs.length; i++) {
          theRequest[strs[i].split("=")[0]] = strs[i].split("=")[1];
        }
      }
      return theRequest;
    },
    getAppid() {
      axios
        .post("../admin.php/get_code_staff_user", {
          code: "",
        })
        .then((res) => {
          this.getCode(res.data.data);
        });
    },
    getCode(id) {
      // var id = 'WanQi'
      // console.log(id);
      var host = window.location.protocol + "//" + window.location.host;
      var url = encodeURI(host + "/chat-tool/index.html");
      var href = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${id}&redirect_uri=${url}&response_type=code&scope=snsapi_base&state=#wechat_redirect`;
      window.location.href = href;

      //获取内容
    },
    getmyId() {
      axios
        .post("../admin.php/get_code_staff_user", {
          code: this.getUrlCode().code,
        })
        .then((res) => {
          if (res.data.code == 200) {
            localStorage.setItem("user_id", res.data.data.user_id);
            this.getClass();
          }
        });
    },
    getClass() {
      axios
        .post(this.http + "admin.php/app_get_content_engine", {
          type: 1,
        })
        .then((res) => {
          if (res.data.code == 200) {
            this.classList = res.data.data;
            this.getGroup();
          }
        });
    },
    getGroup() {
      axios
        .post(this.http + "admin.php/app_get_content_engine", {
          type: 2,
        })
        .then((res) => {
          if (res.data.code == 200) {
            this.columns = [];
            this.groupList = res.data.data;
            this.groupList.unshift({
              name: "全部",
              id: "",
            });
            this.groupList.map((item) => {
              this.columns.push(item.name);
              this.getContent();
            });
          }
        });
    },
    getContent() {
      axios
        .post(this.http + "admin.php/app_get_content_engine", {
          type: 3,
          content_type: this.tabindex,
          group_id: this.group_id,
          keyword: this.name,
          page: 1,
          limit: 1000,
        })
        .then((res) => {
          if (res.data.code == 200) {
            this.list = res.data.data;
          }
        });
    },
    Set(data) {
    },
    //发送
    send() {
      var that = this;

      if (this.radio) {
        axios
          .post("../admin.php/get_js_sdk", {
            url: window.location.href.split("#")[0],
          })
          .then((res) => {
            if (res.data.code == 200) {
              wx.config({
                beta: true, // 必须这么写，否则wx.invoke调用形式的jsapi会有问题
                debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                appId: res.data.data.config.appId, // 必填，企业微信的corpID
                timestamp: res.data.data.config.timestamp, // 必填，生成签名的时间戳
                nonceStr: res.data.data.config.nonceStr, // 必填，生成签名的随机串
                signature: res.data.data.config.signature, // 必填，签名，见 附录-JS-SDK使用权限签名算法
                jsApiList: ["sendChatMessage", "getContext", "getCurExternalContact"], // 必填，需要使用的JS接口列表，凡是要调用的接口都需要传进来
              });
              wx.ready(function () {
                // config信息验证后会执行ready方法，所有接口调用都必须在config接口获得结果之后，config是一个客户端的异步操作，所以如果需要在页面加载时就调用相关接口，则须把相关接口放在ready函数中调用来确保正确执行。对于用户触发时才调用的接口，则可以直接调用，不需要放在ready函数中。
                that.getCon(res.data.data.agent);
              });
            }
          });
      } else {
        Toast.fail("请先选择数据");
      }
    },
    getCon(data) {
      var that = this;
      var host = window.location.protocol + "//" + window.location.host;
      that.url = encodeURI(host);
      wx.agentConfig({
        corpid: data.corpid, // 必填，企业微信的corpid，必须与当前登录的企业一致
        agentid: data.agentid, // 必填，企业微信的应用id （e.g. 1000247）
        timestamp: data.timestamp, // 必填，生成签名的时间戳
        nonceStr: data.nonceStr, // 必填，生成签名的随机串
        signature: data.signature, // 必填，签名，见附录-JS-SDK使用权限签名算法
        jsApiList: ["sendChatMessage", "getContext", "getCurExternalContact"], //必填
        success: function (res2) {
          //获取外部联系人id
          wx.invoke("getCurExternalContact", {}, function (res5) {
            console.log(res5);
            if (res5.err_msg == "getCurExternalContact:ok") {
              that.couId = res5.userId; //返回当前外部联系人userId
              wx.invoke("getContext", {}, function (res3) {
                if (res3.err_msg == "getContext:ok") {
                  var entry = res3.entry; //返回进入H5页面的入口类型，目前有normal、contact_profile、single_chat_tools、group_chat_tools
                  if (that.radio.type == "1") {
                    wx.invoke(
                      "sendChatMessage",
                      {
                        msgtype: "text", //消息类型，必填
                        text: {
                          content: that.radio.content, //文本内容
                        },
                      },
                      function (res4) {
                        if (res4.err_msg == "sendChatMessage:ok") {
                          //发送成功
                          that.sendTime(that.radio);
                        }
                      }
                    );
                  } else if (that.radio.type == "2") {
                    wx.invoke(
                      "sendChatMessage",
                      {
                        msgtype: "image", //消息类型，必填
                        image: {
                          mediaid: that.radio.media_id, //图片的素材id
                        },
                      },
                      function (res4) {
                        if (res4.err_msg == "sendChatMessage:ok") {
                          //发送成功
                          that.sendTime(that.radio);
                        }
                      }
                    );
                  } else if (that.radio.type == "3") {
                    wx.invoke(
                      "sendChatMessage",
                      {
                        msgtype: "news", //消息类型，必填
                        news: {
                          link:
                            that.url +
                            "/article-preview/huankemao_h5.html?id=" +
                            that.radio.id +
                            "&type=1&userid=" +
                            localStorage.getItem("user_id"), //H5消息页面url 必填
                          title: that.radio.title, //H5消息标题
                          desc: that.radio.summary, //H5消息摘要
                          imgUrl: that.radio.cover, //H5消息封面图片URL
                        },
                      },
                      function (res4) {
                        if (res4.err_msg == "sendChatMessage:ok") {
                          //发送成功
                          that.sendTime(that.radio);
                        }
                      }
                    );
                  } else if (that.radio.type == "5") {
                    wx.invoke(
                      "sendChatMessage",
                      {
                        msgtype: "video", //消息类型，必填
                        video: {
                          mediaid: that.radio.media_id, //视频的素材id
                        },
                      },
                      function (res4) {
                        if (res4.err_msg == "sendChatMessage:ok") {
                          //发送成功
                          that.sendTime(that.radio);
                        }
                      }
                    );
                  } else if (that.radio.type == "6") {
                    wx.invoke(
                      "sendChatMessage",
                      {
                        msgtype: "miniprogram", //消息类型，必填
                        miniprogram: {
                          appid: that.radio.applets_id, //小程序的appid
                          title: that.radio.title, //小程序消息的title
                          imgUrl: that.radio.cover, //小程序消息的封面图。必须带http或者https协议头，否则报错 $apiName$:fail invalid imgUrl
                          page: that.radio.applets_path, //小程序消息打开后的路径，注意要以.html作为后缀，否则在微信端打开会提示找不到页面
                        },
                      },
                      function (res4) {
                        // console.log(res4)
                        if (res4.err_msg == "sendChatMessage:ok") {
                          //发送成功
                          that.sendTime(that.radio);
                        }
                      }
                    );
                  } else if (that.radio.type == "7") {
                    wx.invoke(
                      "sendChatMessage",
                      {
                        msgtype: "file", //消息类型，必填
                        file: {
                          mediaid: that.radio.media_id, //文件的素材id
                        },
                      },
                      function (res4) {
                        if (res4.err_msg == "sendChatMessage:ok") {
                          //发送成功
                          that.sendTime(that.radio);
                        }
                      }
                    );
                  } else if (that.radio.type == "8") {
                    console.log(that.radio);
                    wx.invoke(
                      "sendChatMessage",
                      {
                        msgtype: "news", //消息类型，必填
                        news: {
                          link: that.radio.link, //H5消息页面url 必填
                          title: that.radio.title, //H5消息标题
                          desc: that.radio.summary, //H5消息摘要
                          imgUrl: that.radio.cover, //H5消息封面图片URL
                        },
                      },
                      function (res4) {
                        console.log(res4);
                        if (res4.err_msg == "sendChatMessage:ok") {
                          //发送成功
                          that.sendTime(that.radio);
                        }
                      }
                    );
                  }
                } else {
                  //错误处理
                }
              });
            } else {
              //错误处理
            }
          });
        },
        fail: function (err) {
          console.log(err);
        },
      });
    },
    sendTime(data) {
      var formdata = new FormData();

      if (data.type == "1") {
        formdata.append("arr[0][wx_user_id]", localStorage.getItem("user_id"));
        formdata.append("arr[0][wx_customer_id]", this.couId);
        formdata.append("arr[0][search_name]", "");
        formdata.append("arr[0][content_engine_group_id]", data.content_group_id);
        formdata.append("arr[0][content_engine_title]", data.content);
        formdata.append("arr[0][content_engine_type]", data.type);
        formdata.append("arr[0][content_engine_id]", data.id);
        formdata.append("type", 2);
      } else if (data.type == 3 || data.type == 6) {
        formdata.append("arr[0][wx_user_id]", localStorage.getItem("user_id"));
        formdata.append("arr[0][wx_customer_id]", this.couId);
        formdata.append("arr[0][search_name]", "");
        formdata.append("arr[0][content_engine_group_id]", data.content_group_id);
        formdata.append("arr[0][content_engine_title]", data.title);
        formdata.append("arr[0][content_engine_type]", data.type);
        formdata.append("arr[0][content_engine_id]", data.id);
        formdata.append("type", 2);
      } else {
        formdata.append("arr[0][wx_user_id]", localStorage.getItem("user_id"));
        formdata.append("arr[0][wx_customer_id]", this.couId);
        formdata.append("arr[0][search_name]", "");
        formdata.append("arr[0][content_engine_group_id]", data.content_group_id);
        formdata.append("arr[0][content_engine_title]", data.file_name);
        formdata.append("arr[0][content_engine_type]", data.type);
        formdata.append("arr[0][content_engine_id]", data.id);
        formdata.append("type", 2);
      }

      axios
        .post("../admin.php/content_operating", formdata, {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        })
        .then((res) => {
          if (res.data.code == 200) {
            window.location.href = "about:blank";
            window.close();
          }
        });
    },
    groupShoe() {
      this.show = true;
    },
    tabClick(name, title) {
      this.tabindex = name;
      this.getContent();
    },

    onConfirm(value) {
      this.show = false;
      this.groupname = value;
      this.group_id = this.groupList.filter((item) => item.name == this.groupname)[0].id;
      this.getContent();
    },
  },
};
</script>

<style lang="less">
body {
  margin: 0;
  padding: 0;
}

.hello {
  // height: 100%-50px;
  width: 100%;
  height: 100%;
  overflow-x: hidden;

  // box-sizing: border-box;
  .content_box {
    position: relative;
    width: 100%;

    padding: 10px 10px 55px 10px;
    box-sizing: border-box;

    /deep/.van-field__control {
      height: 32px;
    }

    /deep/.van-tab--active {
      color: #6881ec !important;
      font-weight: bold;
    }

    /deep/.van-cell:after {
      left: 0;
      right: 0;
    }

    .van-button {
      background: #6881ec;
      border: 1px solid #6881ec;
    }

    .van-tab {
      justify-content: flex-start;
      padding: 0 20px 0 0;
    }

    /deep/.van-tabs__nav--complete {
      padding: 0 0 15px 0;
    }

    .van-tabs__line {
      display: none;
    }

    .van-radio__icon .van-icon {
      width: 1rem;
      height: 1rem;
      font-size: 0.7em;
    }
  }

  .content {
    p {
      margin: 0;
    }
  }

  .button {
    position: fixed;
    bottom: 0;
    width: 100%;
    height: 50px;
    background-color: #6881ec;
    text-align: center;
    line-height: 50px;
    color: #fff;

    .van-checkbox {
      position: absolute;
      left: 30px;
      top: 30%;

      .van-checkbox__label {
        color: #fff;
      }
    }

    p {
      color: #fff;
      position: absolute;
      left: 50%;
    }
  }

  .van-cell {
    padding: 10px 0;
  }

  .van-field__control {
    background-color: rgb(243, 243, 243);
    color: #000;
  }

  .group {
    margin: 10px 0;
    font-size: 14px;
    color: #333;
  }

  .custom-title {
    display: block;
    width: 200px !important;
    margin-right: 4px;
    overflow: hidden;
    /*超出部分隐藏*/
    white-space: nowrap;
    /*不换行*/
    text-overflow: ellipsis;
    /*超出部分文字以...显示*/
  }

  .search-icon {
    font-size: 16px;
    line-height: inherit;
  }
}
</style>
