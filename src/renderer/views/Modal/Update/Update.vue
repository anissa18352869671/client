<template lang="">
<div class="userInfo update">
    <el-header
        style="height:44px;"
        router
      >
        <el-row>
          <el-button-group>
            <el-button
              type="primary"
              size="mini"
              circle
               v-if="close"
              icon="el-icon-close"
              @click="closeBtn()"
            ></el-button>
            <el-button
              type="primary"
              size="mini"
              circle
              class="b"
              icon="el-icon-close"
              v-if="!close"
              @click="winControl()"
            ></el-button>
          </el-button-group>
        </el-row>

      </el-header>
    <div class="inside">
      
        <el-image
            class="img2"
            :src="img2"
          ></el-image>
          <div class="title">瑞云安全平台V{{version.lastest}}已发布</div>
           <div class="version">V{{version.now}}</div>
           <div>
           <el-button
          type="primary"
          @click="update"
        >立即升级</el-button>
        </div>
        <div class="update_select" v-if="version.show">
          <el-select v-model="value"  popper-class="updateChoose"  @change="currentSel">
            <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
            >
            </el-option>
          </el-select>
          <div class="message" @click="closeBtn">
            {{checked}}
          </div>
        </div>
        
        <div class="info">
            <div class="flex describe">
                <span>
                    <i
                      class="iconfont icon-1"
                    ></i>
                </span>
                <div class="detail">
                    <div>版本{{version.lastest}}中的新功能</div>
                    <div class="word" v-html="version.content">
                      <!-- -文字支持邮件合并，支持批量制作合同、工资条、名片、成绩单、信件封面及请帖等；<br>
                        -演示支持布尔运算，多种形状组合一键套用，创意十足的图形即刻生成；<br>
                      -新增屏幕录制功能，支持同步录制电脑屏幕及声音；<br> -->
                    </div>
                </div>
            </div>
        </div>
         <span @click="goTo" class="showMore">
              查看更多
            </span>
    </div>
</div>   
</template>
<script>
const electron = require("electron");
const remote = electron.remote;
import { ipcRenderer } from "electron";
import resources from "../../../../../resources.json";
import _package from "../../../../../package.json";
import { openShell } from "~/utils/func/shell";
import { cp_version } from "~/utils/func/compareVersion";
import { saveVersion, getVersion } from "~/api/update/updateDao";
export default {
  data() {
    return {
      img2: "static/img/update/logo.png",
      options: [
        {
          value: "0",
          label: "下次提醒我",
        },
        {
          value: "1",
          label: "忽略本次更新",
        },
      ],
      checked: "",
      value: "0",
      version: {
        now: "",
        lastest: "",
        show: true,
        content: "",
      },
      close: true,
    };
  },
  methods: {
    goTo() {
      openShell(resources.cms.ip);
    },
    winControl() {
      ipcRenderer.send("quit");
    },
    init() {
      let _this = this;
      _this.version.now = _package.version;
      // _this.version.lastest = resources.version.lastest;

      getVersion().then((res) => {
        if(res.length>0) {
          _this.version.content = res[0].update_content;
          _this.value = res[0].update_notice;
          _this.version.lastest = res[0].update_version;
          if (!cp_version(_this.version.now, _this.version.lastest).update) {
            ipcRenderer.send(
              "openUpdateWindow",
              cp_version(_this.version.now, _this.version.lastest).info
            );
          }
          //大版本更新
          if (cp_version(_this.version.now, _this.version.lastest).info == 1) {
            _this.close = false;
            _this.version.show = false;
          }
          _this.options.forEach((element) => {
            if (element.value == _this.value) _this.checked = element.label;
          });
        }
      });

      ipcRenderer.on("message", (event, { message, data }) => {
        if (message === "isUpdateNow") {
          ipcRenderer.send("updateNow");
        }
      });
    },
    closeBtn() {
      const browserWindow = remote.getCurrentWindow();
      ipcRenderer.send("closeUpdateWindow");
      browserWindow.close();
    },
    update() {
      //根据api获得
      const feedUrl = _package.build.publish.url + "/" + this.version.lastest; // 更新包位置
      ipcRenderer.send("update", feedUrl);
      this.$message({
        message: "升级中，请等待",
        type: "warning",
        duration: 0,
      });
    },
    currentSel(val) {
      let _this = this;
      var version_new = {
        update_version: this.version.lastest,
        update_notice: val,
      };
      saveVersion(version_new, function () {
        _this.closeBtn();
      });
    },
  },
  mounted() {
    this.init();
  },
};
</script>