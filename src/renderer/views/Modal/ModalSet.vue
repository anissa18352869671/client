<template >
  <!-- 账户信息弹框 -->
  <div class="userInfo">
    <eHeader :title="title"></eHeader>
    <div class="dialog-content nodrag">
      <el-tabs tab-position="left">
        <el-tab-pane label="系统消息">
          <div class="msg">
            <div class="header">消息提醒</div>
            <div class="msgContent">
              <span>
                <i class="el-icon-message-solid"></i>
              </span>
              <div>
                <p>您有一条新的通知待查看，请及时查收</p>
                <a>立即查看</a>
              </div>
            </div>
          </div>
        </el-tab-pane>

        <el-tab-pane label="任务消息">
          <div class="msg">
            <div class="header">消息提醒</div>
          </div>
        </el-tab-pane>
      </el-tabs>

    </div>
  </div>
</template>
<script>
const electron = require("electron");
const remote = electron.remote;
import { ipcRenderer } from "electron";
import axios from "axios";
import eHeader from "./Header/Header";
export default {
  components: {
    eHeader
  },
  data() {
    return {
      title: "系统信息"
    };
  }
};
</script>
