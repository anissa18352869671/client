<!--
    布局组件，在router中引用
-->
<template>
  <el-container
    class="mainContainer"
    style="overflow:auto;"
  >

    <!--左侧菜单-->
    <el-aside style="width:53px;">
      <!-- 头像 -->
      <div class="demo-basic--circle">
        <div class="block">
          <el-avatar
            :size="30"
            :src="circleUrl"
          ></el-avatar>
          <!-- 头像点击弹框 -->
          <el-popover
            placement="bottom"
            trigger="click"
            class="person"
          >
            <div class="userBox">
              <div class="userTitle">
                <el-avatar
                  :size="54"
                  :src="circleUrl1"
                ></el-avatar>
                <div class="right">
                  <h3>{{accountInfo.unit_name}}</h3>
                  <div class="editDiv">
                    <span>{{accountInfo.nick_name}}</span>
                    <i
                      class="el-icon-edit-outline"
                      @click="userClick"
                    ></i>
                  </div>
                </div>

              </div>
              <div class="popoverContent">
                <div>
                  <label>账号</label>
                  <span>{{accountInfo.username}}</span>
                </div>
                <div>
                  <label>监管部门</label>
                  <span>{{accountInfo.dept_name}}</span>
                </div>
                <div>
                  <label>手机号</label>
                  <span>{{accountInfo.phonenumber}}</span>
                </div>
                <div>
                  <label>邮箱</label>
                  <span>{{accountInfo.email}}</span>
                </div>
              </div>
              <!-- <div class="tips">
                <span v-for="item in userList">{{item}}</span>
              </div> -->
            </div>
            <el-button slot="reference"></el-button>
          </el-popover>
        </div>

      </div>
      <!-- 设置部分 -->
      <div class="userList">
        <div class="img">
          <el-image
            :src="img"
            @click="setClick"
          ></el-image>
          <!-- 消息 -->
        </div>
        <div class="img">
          <el-image
            class="img2"
            :src="img2"
            @click="set('set')"
          ></el-image>
          <!-- 设置弹框部分 -->
          <el-popover
            placement="left-end"
            trigger="click"
            class="person"
            offset="50"
            v-model="visible"
          >
            <div>
              <div class="userSetting">
                <div @click="userClick">
                  账户设置
                </div>
                <div>
                  系统设置
                </div>
                <hr>
                <div @click="changePwd">
                  修改密码
                </div>
                <hr>
                <!-- <div >
                  检查更新
                </div> -->
                <div @click="about">
                  关于我们
                </div>
                <hr>
                <div class="quit">
                  <!-- <div @click="logout"> -->
                  <template>
                    <el-popconfirm
                      popper-class="confirm"
                      title="是否退出登录？"
                      @onConfirm="onConfirm"
                      @onCancel="onCancel"
                    >
                      <el-button
                        class="quit"
                        slot="reference"
                      >退出登录</el-button>
                    </el-popconfirm>
                  </template>
                </div>

              </div>

            </div>
            <el-button slot="reference"></el-button>
          </el-popover>

        </div>

      </div>

    </el-aside>

    <!-- 主内容 -->
    <el-container :class="homeHeader">
      <eHeader></eHeader>
      <el-main>
        <router-view @getColor="change"></router-view>
      </el-main>
    </el-container>

    <!-- 账户设置弹框 -->
    <dialogH
      v-if="addOrderVisible"
      :visible.sync="addOrderVisible"
    >

    </dialogH>
    <div
      class="modal"
      :class="showModal"
    >

    </div>
  </el-container>
</template>

<script>
const electron = require("electron");
const remote = electron.remote;
import { ipcRenderer } from "electron";
import resConf from "../../../../resources.json";
import { mapActions } from "vuex";
import dialogH from "../dialog/dialog";
import eHeader from "../Header/Header";
import {
  searchAccountInfo,
  updateUserInfo,
  getNowToken,
  searchSn,
} from "~/api/login/loginDao";
export default {
  components: {
    dialogH,
    eHeader,
  },
  data: () => ({
    circleUrl:
      // resConf.server.ip + "/static/img/profile.473f5971.jpg",
      "https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png",
    circleUrl1:
      "https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg",
    img: "static/img/msg.png",
    img2: "static/img/set.png",
    dark: "",
    visible: false,
    addOrderVisible: false,
    homeHeader: "",
    userList: ["安全", "人工智能", "安全", "安全"],
    accountInfo: {
      avatar: "",
      username: "",
      nick_name: "",
      unit_name: "",
      sex: "3",
      phonenumber: "",
      email: "",
    },
    showModal: "",
  }),
  methods: {
    getAccountInfo() {
      let _this = this;
      searchAccountInfo().then(function (res) {
        // console.info(res);
        _this.accountInfo = res;
        if (res.avatar != undefined && res.avatar != "") {
          _this.circleUrl1 = resConf.server.apiUrl + res.avatar;
        }
      });
    },
    handleOpen(key, keyPath) {
      // console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      // console.log(key, keyPath);
    },
    logout() {
      ipcRenderer.send("quit");
    },
    //左侧菜单栏点击事件
    set(action) {
      switch (action) {
        case "msg":
          console.log("msg");
          break;
        case "set":
          console.log("set");
          break;
        default:
          break;
      }
    },
    change(val) {
      this.dark = val;
    },
    userClick() {
      this.visible = false;
      ipcRenderer.send("openModalWindow");
    },
    changePwd() {
      this.visible = false;
      ipcRenderer.send("openPwdWindow");
    },
    setClick() {
      this.visible = false;
      ipcRenderer.send("openSetModalWindow");
    },
    about() {
      this.visible = false;
      ipcRenderer.send("openAboutWindow");
    },
    onConfirm() {
      this.visible = false;
      ipcRenderer.send("quit");
    },
    onCancel() {
      this.visible = false;
    },
    listen() {
      ipcRenderer.on("openUpdate", (event, arg) => {
        if (arg == "close") {
          this.showModal = "";
        } else {
          this.showModal = "block";
        }
      });
    },
  },
  mounted: function () {
    this.listen();
    this.homeHeader = this.$store.state.header;
    this.getAccountInfo();
    ipcRenderer.on("sendUpdateHome", (event, obj) => {
      console.log("sendUpdateHome");
      console.log(obj);
    });
  },
  destroyed() {},
};
</script>
<style lang="scss">
.userBox {
  padding: 0 20px;
  min-width: 250px;
}
</style>