<template>
  <el-form
    ref="accountInfo"
    :model="accountInfo"
    label-width="80px"
  >
    <el-form-item
      label="头像"
      class="avatar-content"
    >
      <img
        v-if="imageUrl"
        :src="imageUrl"
        class="avatar"
      >
      <input
        v-model="accountInfo.avatar"
        type="hidden"
        placeholder="请输入内容"
      />
      <div>
        <el-upload
          class="avatar-uploader"
          :action="uploadImgUrl"
          :headers="headers"
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload"
        >
          <span>点击上传头像</span>
        </el-upload>
        <p>支持JPG、PNG、GIF格式，小于2MB</p>
      </div>
    </el-form-item>
    <el-form-item label="账号">
      <!-- <el-input v-model="userInfo.id"></el-input> -->
      <div>{{accountInfo.username}}</div>
    </el-form-item>
    <el-form-item label="监管部门">
      <div>{{accountInfo.dept_name}}</div>
    </el-form-item>
    <el-form-item label="单位名称">
      <div>{{accountInfo.unit_name}}</div>
    </el-form-item>
    <el-form-item label="姓名">
      <el-input v-model="accountInfo.nick_name"></el-input>
    </el-form-item>
    <el-form-item label="性别">
      <el-radio-group v-model="accountInfo.sex">
        <el-radio label="0">先生</el-radio>
        <el-radio label="1">女士</el-radio>
        <el-radio label="3">不选</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item label="手机号">
      <el-input v-model="accountInfo.phonenumber"></el-input>
    </el-form-item>
    <el-form-item label="邮箱">
      <el-input v-model="accountInfo.email"></el-input>
    </el-form-item>
    <el-form-item>
      <el-button
        type="primary"
        @click="onSubmit"
      >保存</el-button>
      <!-- <el-button>取消</el-button> -->
    </el-form-item>
  </el-form>
</template>
<script>
import {
  searchAccountInfo,
  updateUserInfo,
  getNowToken
} from "~/api/login/loginDao";
import { editUserinfo } from "~/api/login/login";
import resConf from "../../../../../resources.json";
export default {
  data() {
    return {
      headers: {},
      uploadImgUrl: resConf.server.apiUrl + "/common/upload",
      imageUrl:
        "https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png",
      accountInfo: {
        avatar: "",
        user_name: "",
        nick_name: "",
        unit_name: "",
        sex: "",
        phonenumber: "",
        email: ""
      }
    };
  },
  methods: {
    onSubmit() {
      let _this = this;
      let userinfo = {
        nickname: this.accountInfo.nickname,
        avatar: this.accountInfo.avatar,
        sex: this.accountInfo.sex,
        email: this.accountInfo.email,
        phonenumber: this.accountInfo.phonenumber
      };
      updateUserInfo(userinfo);
      getNowToken().then(function(token) {
        editUserinfo({ Authorization: "Bearer " + token }, userinfo).then(
          function(result) {
            console.info(result);
          }
        );
      });
      this.$message({
        message: "保存成功",
        type: "success"
      });
    },
    getAccountInfo() {
      let _this = this;
      searchAccountInfo().then(function(res) {
        // console.info(res);
        if(res!=undefined) {
          _this.accountInfo = res;
          if (res.avatar != undefined && res.avatar != "") {
            _this.imageUrl = resConf.server.apiUrl + res.avatar;
          }
        } else {
          _this.getAccountInfo();
        }
      });
    },
    handleAvatarSuccess(res, file) {
      let _this = this;
      // _this.imageUrl = URL.createObjectURL(file.raw);
      if (res.code == 200) {
        _this.imageUrl = resConf.server.apiUrl + res.fileName;
        _this.accountInfo.avatar = res.fileName;
        _this.onSubmit();
      } else {
        console.error(res);
      }
    },
    // 上传头像格式控制
    beforeAvatarUpload(file) {
      let _this = this;
      const isJPG =
        file.type === "image/jpeg" ||
        file.type === "image/png" ||
        file.type === "image/gif";
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
    }
  },
  mounted() {
    let _this = this;
    this.getAccountInfo();
    getNowToken().then(function(token) {
      _this.headers = {
        Authorization: "Bearer " + token
      };
      console.info(token);
    });
  }
};
</script>