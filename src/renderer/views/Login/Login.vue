<template>
  <div
    class="login"
    style="-webkit-app-region:drag"
  >
    <div class="img">
      <el-image :src="img"></el-image>
    </div>
    <div
      class="close"
      @click="winControl"
    >
      <i class="iconfont icon-close"></i>
    </div>
    <el-form
      class="loginBox"
      :model="loginForm"
      :rules="rules"
      ref="loginForm"
      label-width="100px"
    >
      <ul>

        <li>
          <i class="iconfont icon-user"></i>
          <el-form-item
            label=""
            prop="username"
          >
            <el-input
              type="text"
              v-model="loginForm.username"
              autocomplete="off"
              placeholder="请输入账号"
              ref="enter1"
              @keyup.enter.native="onSubmit(1)"
            ></el-input>
          </el-form-item>
        </li>

        <li>
          <i class="iconfont icon-password"></i>
          <el-form-item
            label=""
            prop="password"
          >

            <el-input
              type="password"
              v-model="loginForm.password"
              autocomplete="off"
              ref="enter2"
              placeholder="请输入密码"
              @keyup.enter.native="onSubmit(2)"
            ></el-input>
          </el-form-item>
          <!-- <i
            class="iconfont icon-login"
            @click="validate('loginForm')"
            :loading="loadingSubmit"
          ></i> -->
          <i
            class="iconfont icon-login"
            ref="enter"
            @click="showShadow(true)"
            :loading="loadingSubmit"
          ></i>
        </li>
        <!-- <li>
          <i class="iconfont icon-user"></i>
          <el-form-item
            label=""
            prop="code"
          >
            <el-input
              type="text"
              v-model="loginForm.code"
              autocomplete="off"
            ></el-input>
          </el-form-item>
          <span class="code"><img
              :src="imgBase"
              style="width:100px;"
              @click="getCode"
            ></span>
        </li> -->
        <li class="last">
          <el-checkbox v-model="loginForm.checked">记住密码</el-checkbox>
          <el-link
            href=""
            target="_blank"
          >忘记密码？</el-link>
        </li>
        <div
          class="error"
          v-model="ShowLoginErrMsg"
        > {{ loginErrMsg }}</div>
      </ul>
    </el-form>
    <!-- <div
      class="codeBox"
      v-if="isCode"
    >
      <div class="codetitle">请输入验证码<span
          class="close"
          @click="showShadow(false)"
        ><i class="iconfont icon-close"></i></span></div>
      <span class="code"><img
          :src="imgBase"
          @click="getCode"
        ></span>
      <div class="text">
        <input
          type="text"
          v-for="(item,index) in inputList"
          v-if="index<3"
          v-model="item.val"
          class="border-input"
          @keyup="nextFocus($event,index)"
        />
        <input
          type="text"
          v-for="(item,index) in inputList"
          v-model="inputList[3].val"
          class="border-input"
          @keyup.enter="submit($event,index)"
        />
        <input
          type="text"
          v-for="(item,index) in inputList"
          v-model="item.val"
          class="border-input"
          @keyup.enter="submit($event,index)"
        />

      </div>
      <el-input  placeholder="昵称" @keyup.enter.native="submit"></el-input>

    </div> -->
  </div>

</template>
<script>
const electron = require("electron");
const remote = electron.remote;
import { ipcRenderer } from "electron";
import osInfo from "~/api/os";
import {
  captchaImage,
  captchaStr,
  loginTest,
  register,
  getRegister,
  logOff,
  cLogin,
} from "~/api/login/login";
import { initConfig } from "~/utils/initData";
import {
  insertSession,
  deleteTable,
  searchSn,
  getToken,
} from "~/api/login/loginDao";
import { cp_version } from "~/utils/func/compareVersion";
import { saveVersion, getVersion } from "~/api/update/updateDao";
export default {
  data() {
    var validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入用户名"));
      } else if (value.length < 3) {
        callback(new Error("用户名不能小于三个字符"));
      } else {
        callback();
      }
    };
    var validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else {
        callback();
      }
    };
    return {
      img: "static/img/LOGO1.png",
      focusIndex: 0,
      input: "",
      checked: false,
      loadingSubmit: false,
      ShowLoginErrMsg: false,
      loginErrMsg: "",
      loginForm: {
        username: "",
        password: "",
        code: "",
        uuid: "",
      },
      token: {
        Authorization: "",
      },
      register: {
        clientMac: osInfo.getMac(),
        userName: "",
      },
      insertUserinfo: {
        userid: 1,
        usersn: "adas",
        username: "awsqas",
        uuid: 2,
        token: {},
        phonenumber: "",
        email: "",
        sex: "",
        avatar: "",
        nick_name: "",
        unit_name: "",
        dept_name: "",
      },
      getToken: {
        username: "",
        uuid: "",
        user_sn: "",
      },
      imgBase: "",
      isCode: false,
      rules: {
        username: [{ validator: validatePass, trigger: "change" }],
        password: [{ validator: validatePass2, trigger: "change" }],
      },
      inputList: [{ val: "" }, { val: "" }, { val: "" }, { val: "" }],
    };
  },
  computed: {},
  methods: {
    winControl() {
      const browserWindow = remote.getCurrentWindow();
      browserWindow.close();
    },
    calVal() {
      for (let i = 0; i < this.inputList.length; i++) {
        this.loginForm.code += this.inputList[i].val;
      }
    },
    //获取二维码图片
    getCode() {
      let _this = this;
      // captchaImage().then(function(res) {
      //   _this.imgBase = "data:image/gif;base64," + res.data.img;
      //   _this.loginForm.uuid = res.data.uuid;
      // });
      let _getToken = [];

      captchaImage().then(function (result) {
        _this.loginForm.uuid = result.data.uuid;
        loginTest(_this.loginForm).then(function (res1) {
          let _token = res1.data.token;
          _this.token.Authorization = "Bearer " + _token;
          if (res1.data.code == 200) {
            _this.register.userName = _this.loginForm.username;
            //注销账户
            // logOff(_this.token).then(function(res) {
            //   console.log(res);
            // });

            searchSn().then(function (resSearchSn) {
              //若未注册，则向平台注册，获取sn
              if (resSearchSn.length < 1) {
                register(_this.register, _this.token).then(function (
                  resRegister
                ) {
                  if (resRegister.data.code == 200) {
                    let data = resRegister.data.data;
                    _this.insertUserinfo.userid = data.userId;
                    _this.insertUserinfo.usersn = data.userSn;
                    _this.insertUserinfo.username = _this.loginForm.username;
                    _this.insertUserinfo.uuid = _this.loginForm.uuid;
                    _this.insertUserinfo.token = _token;
                    _this.insertUserinfo.unit_name = data.unitname;
                    _this.insertUserinfo.nick_name = data.nickname;
                    _this.insertUserinfo.dept_name = data.deptname;
                    _this.insertUserinfo.avatar = data.avatar;
                    _this.insertUserinfo.sex = data.sex;
                    _this.insertUserinfo.email = data.email;
                    _this.insertUserinfo.phonenumber = data.phonenumber;
                    insertSession(_this.insertUserinfo);
                    initConfig();
                    ipcRenderer.send("openMainWindow", "init");

                    //已注册就获取注册信息，更新到session表中
                  } else if (resRegister.data.code == 500) {
                    getRegister(_this.token).then(function (res2) {
                      _this.insertUserinfo.userid = res2.data.data.userId;
                      _this.insertUserinfo.usersn = res2.data.data.userSn;
                      _this.insertUserinfo.username = _this.loginForm.username;
                      _this.insertUserinfo.uuid = _this.loginForm.uuid;
                      _this.insertUserinfo.token = _token;
                      _this.insertUserinfo.unit_name = res2.data.data.unitname;
                      _this.insertUserinfo.nick_name = res2.data.data.nickname;
                      _this.insertUserinfo.dept_name = res2.data.data.deptname;
                      _this.insertUserinfo.avatar = res2.data.data.avatar;
                      _this.insertUserinfo.sex = res2.data.data.sex;
                      _this.insertUserinfo.email = res2.data.data.email;
                      _this.insertUserinfo.phonenumber =
                        res2.data.data.phonenumber;
                      insertSession(_this.insertUserinfo);
                      initConfig();
                      ipcRenderer.send("openMainWindow", "init");

                      //
                    });
                  }
                });
              } else {
                _this.insertUserinfo.userid = resSearchSn.userid;
                _this.insertUserinfo.usersn = resSearchSn.usersn;
                _this.insertUserinfo.username = _this.loginForm.username;
                _this.insertUserinfo.uuid = _this.loginForm.uuid;
                _this.insertUserinfo.token = _token;
                insertSession(_this.insertUserinfo);
                initConfig();
                ipcRenderer.send("openMainWindow", "init");
              }
            });
          } else {
            _this.loginErrMsg = res1.data.msg;
            _this.ShowLoginErrMsg = true;
          }
        });
      });
    },
    //打开二维码弹框
    showShadow(isCode) {
      this.getCode();
    },
    onSubmit(num) {
      if (num == 1) {
        this.$refs.enter2.focus();
      } else if (num == 2) {
        this.$refs.enter.click();
      }
    },
  },
  watch: {},
  mounted() {
    let _this = this;
    searchSn().then(function (res) {
      if (res[0] && res[0].usersn) {
        ipcRenderer.send("openMainWindow", "init");
      }
    });
  },
};
</script>
<style lang="scss" >
.el-notification {
  width: auto;

  .el-notification__title {
    font-weight: normal;
    font-size: 14px;
    color: #999999;
  }

  .notification__group {
    margin-left: 0;
  }

  .codeBox {
    position: relative;
    padding: 10px 0;

    .code {
      // width: 80px;
      display: inline-block;
      height: 30px;
      background: #c2c2c2;
    }
  }
}
</style>