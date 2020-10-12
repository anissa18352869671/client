<template >
  <!-- 账户信息弹框 -->
  <div class="userInfo pwd">
    <eHeader :title="title"></eHeader>
    <div class="dialog-content nodrag">
      <el-form
        :model="passwordChange"
        status-icon
        :rules="rules"
        ref="passwordChange"
        label-width="100px"
      >
        <el-form-item
          label="原密码"
          prop="oldpassword"
        >
          <el-input
            type="password"
            v-model="passwordChange.oldpassword"
            autocomplete="off"
            placeholder="请输入原密码"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="新密码"
          prop="newpassword"
        >
          <el-input
            type="password"
            v-model="passwordChange.newpassword"
            autocomplete="off"
            placeholder="请输入6～20位密码"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="确认新密码"
          prop="confirmPassword"
        >
          <el-input
            type="password"
            v-model="passwordChange.confirmPassword"
            autocomplete="off"
            placeholder="再次输入密码"
          ></el-input>
        </el-form-item>
        <span style="color:red">{{responseMsg}}</span>
        <el-form-item>
          <el-button type="primary"  @click="submit">保存</el-button>
          <el-button @click="close">取消</el-button>
        </el-form-item>
      </el-form>

    </div>
  </div>
</template>
<script>
const electron = require("electron");
const remote = electron.remote;
import { ipcRenderer } from "electron";
import axios from "axios";
import eHeader from "../Header/Header";
import {updateUserPwd} from "../../../../api/login/login";
import {getNowToken} from "../../../../api/login/loginDao";
export default {
  components: {
    eHeader
  },
  methods: {
    close() {
      const browserWindow = remote.getCurrentWindow();
      browserWindow.close();
    },
    submit() {
      let _this = this;
      getNowToken().then(token => {
        updateUserPwd(
          {Authorization: "Bearer " + token},
          _this.passwordChange.oldpassword,
          _this.passwordChange.newpassword).then(response => {
            if (response.data.code === 200) {
              _this.responseMsg="修改成功";
            } else {
              _this.responseMsg=response.data.msg;
            }
        });
      })
    }
  },
  data() {
    var validatePass = (rule, value, callback) => {
      var reg = /^\w{6,20}$/i;
      var isValid = reg.test(value);
      if (value === "") {
        callback(new Error("请输入密码"));
      } else if (!isValid) {
        callback(new Error("请输入6-20位密码"));
      } else {
        if (this.passwordChange.repassword !== "") {
          this.$refs.passwordChange.validateField("repassword");
        }
        callback();
      }
    };
    var validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.passwordChange.newpassword) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    return {
      responseMsg: "",
      title: "修改密码",
      passwordChange: {
        oldpassword: "",
        newpassword: "",
        confirmPassword: ""
      },
      rules: {
        // oldpassword: [{ validator: validatePass, trigger: "blur" }],
        newpassword: [{ validator: validatePass, trigger: "blur" }],
        confirmPassword: [{ validator: validatePass2, trigger: "blur" }]
      }
    };
  }
};
</script>
<style lang="scss">
.pwd.userInfo {
  .el-form {
    padding-left: 70px;

    .el-form-item:last-child div {
      margin-top: 30px;
    }
  }
}
</style>
