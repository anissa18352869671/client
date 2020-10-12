<template >
  <!-- 账户信息弹框 -->
  <div class="userInfo fankui">
    <eHeader :title="title"></eHeader>
    <div class="dialog-content nodrag">
      <div class="fankui_title">
        主题<span>反馈：通知</span>

      </div>
      <!-- <div class=""> -->
      <!-- <div
          class="addFujian"
          @click="add"
        >
          
          
        </div> -->
      <div class="fankui_content">
        <div class="addFujian">
          <!-- :http-request="uploadFile" -->
          <el-upload
            class="upload-demo"
            drag
            :data="guid"
            ref="upload"
            :action="action"
            :file-list="fileList"
            :auto-upload="false"
            :headers="headers"
            :on-success="handleSuccess"
            :on-error="handleError"
            multiple
          >
            <span class="add">
              <i class="el-icon-plus"></i>

            </span>

            <div class="el-upload__text">添加附件</div>
          </el-upload>

        </div>
        <el-input
          type="textarea"
          class="textarea"
          placeholder="请输入内容"
          v-model="textarea"
        >
        </el-input>

      </div>
      <div class="fujian_footer">
        <button
          type="button"
          class="el-button el-button--primary"
          @click="submitUpload"
        >
          <span>立即反馈</span></button>
      </div>

    </div>
  </div>
</template>
<script>
const electron = require("electron");
const remote = electron.remote;
import { ipcRenderer } from "electron";
import axios from "axios";
import eHeader from "../Header/Header";
import { notice, upload } from "~/api/notice/noticeApi";
import { getNoticeByGuid, updateNotice } from "~/api/notice/noticeDao";
import { searchSn, getToken } from "~/api/login/loginDao";
import { startDownloadTask } from "~/utils/func/download";
export default {
  components: {
    eHeader
  },
  data() {
    return {
      title: "反馈",
      textarea: "",
      fileList: [],
      length: 0,
      formData: [],
      guid: {
        guid: ""
      },
      action: "",
      headers: {}
    };
  },
  methods: {
    submitUpload() {
      getNoticeByGuid(this.guid.guid).then(res => {
        res = res[0];
        //点击反馈后将状态改为3
        res.status = 3;
        //添加反馈内容
        res.back_content = this.textarea;
        //获取更新时间，转化为时间戳
        res.update_time = Number(new Date());
        //将反馈消息返回给mq
        notice(res);
        //更新本地库数据状态
        updateNotice(res);
      });
      this.$refs.upload.submit();
    },
    handleSuccess(response, file, fileList) {
      if (response.code == 200) {
        startDownloadTask(
          "http://172.16.39.57/dev-api" + response.fileName,
          this.$refs.upload.uploadFiles[0].name
        );
        let res = {};
        res.notice_guid = this.guid.guid;
        res.back_attachment = this.$refs.upload.uploadFiles[0].name;
        res.back_attachment_link = response.fileName;
        updateNotice(res);
        history.go(0);
        ipcRenderer.send("reopenMainWindow");
        const browserWindow = remote.getCurrentWindow();
        browserWindow.close();
      } else {
        getToken().then(function() {
          _this.updataHeader();
          _this.submitUpload();
        });
      }
    },
    handleError(err, file, fileList) {
      let _this = this;
      if (err) {
        console.log(error);
      }
    },
    updataHeader() {
      let _this = this;

      searchSn().then(function(res) {
        let token = res[0].token;
        _this.headers.Authorization = "Bearer " + token;
      });
    }
  },
  mounted: function() {
    this.updataHeader();
    this.guid.guid = electron.remote.getGlobal("sharedObject").notice_guid;
    this.action = this.$httpUrl + "/api/notice/attUpload/" + this.guid.guid;
  }
};
</script>
