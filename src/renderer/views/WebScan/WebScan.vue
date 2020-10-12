<template >
  <!-- 账户信息弹框 -->
  <div
    class="userInfo webscan"
    :class="noInfo"
  >
    <eHeader
      :title="title"
      @refreshContent='reload'
      :class="opacity"
      :link="link"
    ></eHeader>
    <router-view v-if="isRouterAlive"></router-view>
  </div>
</template>
<script>
const electron = require("electron");
const remote = electron.remote;
import { ipcRenderer } from "electron";
import eHeader from "./Header/Header";
import Add from "./Modal/Add";

import { saveWebscan } from "~/api/web/webScanDao";
import { getWebsiteBy } from "~/api/web/webSiteDao";
import { getNowToken } from "~/api/login/loginDao";
import { getTaskDetail } from "~/api/web/webApi";
export default {
  name: "dialogH",
  provide() {
    return {
      reload: this.reload,
    };
  },
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
  },
  components: {
    eHeader,
    Add,
  },
  data() {
    return {
      title: "网站检测",
      dialogVisible: false,
      webscan: true,
      noInfo: "",
      isRouterAlive: true,
      opacity: "opacity_all",
      link: "",
    };
  },
  methods: {
    refreshContent() {
      this.hascontent = false;
      this.$nextTick(function () {
        this.hascontent = true;
        this.init();
      });
    },
    closeDialogVisible(data) {
      console.log("进入init");
      this.init();
      this.dialogVisible = data;
    },
    init() {
      let _this = this;
      getWebsiteBy().then((res) => {
        // console.log(res);
        if (res.length == 0) {
          this.$router.push("/webscan/FirstPage");
          this.noInfo = "noInfo";
        }
      });
      //监听任务运行状态变化(已完成)
      ipcRenderer.on("renew", (event, obj) => {
        _this.reload();
      });
    },
    reload() {
      this.isRouterAlive = false;
      this.$nextTick(function () {
        // ipcRenderer.send("openWebScanWindow");
        this.isRouterAlive = true;
        this.init();
      });
    },
  },
  computed: {},
  mounted() {
    this.init();
  },
  watch: {
    $route(to, from) {
      if (to.path == "/webDetail") {
        this.opacity = "opacity_right";
      } else {
        this.opacity = "opacity_left";
        this.link = to.path;
      }
    },
  },
};
</script>
