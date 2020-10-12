<template lang="">
    <div class="userInfo about">
          <eHeader :title="title"></eHeader>
          <div class="container">
            <el-image
                class="img"
                :src="img"
            ></el-image>
            <div class="name">{{name}}</div>
            <div class="subtitle">
              V{{subtitle}}
                <div>
                  <el-button
                      type="primary" @click="autoUpdate()"
                    >{{button}}</el-button>
                       
                  </div>
            </div>
            <div class="footer">版权所有 Copyright  2019江苏国瑞信安科技有限公司</div>
          </div>
    </div>
</template>
<script>
const electron = require("electron");
const remote = electron.remote;
import { ipcRenderer } from "electron";
import eHeader from "../Header/Header";
import resources from "../../../../../resources.json";
import _package from "../../../../../package.json";
import { cp_version } from "~/utils/func/compareVersion";
import { saveVersion, getVersion } from "~/api/update/updateDao";
export default {
  components: {
    eHeader,
  },
  data() {
    return {
      title: "关于我们",
      img: "static/img/about/about.png",
      name: "国瑞安全工具平台",
      subtitle: "",
      button: "立即更新",
    };
  },
  methods: {
    autoUpdate() {
      var now, lastest;
      now = _package.version;
      getVersion().then((res) => {
        if(res.length>0) {
          lastest = res[0].update_version;
          console.log(cp_version(now, lastest));
          if (!cp_version(now, lastest).update) {
            ipcRenderer.send("openUpdateWindow", cp_version(now, lastest).info);
            const browserWindow = remote.getCurrentWindow();
            browserWindow.close();
          } else {
            this.$message({
              message: "已是最新版本",
              type: "warning",
            });
          }
        }
      });
      //获取当前版本和最新版本
    },
  },
  mounted: function () {
    let _this = this;
    _this.subtitle = _package.version;

  },
};
</script>