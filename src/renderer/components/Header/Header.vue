<template lang="">
    <!--头-->
      <el-header
        style="height:44px;"
       
        router
      >
        <el-row>
          <el-col :span="22">
            <div class="btn" @click="back">
              <i
                class="iconfont icon-fanhuishouye"
              ></i>
            </div>
            <div class="btn"  @click="refresh">
              <i
                class='iconfont icon-shuaxin'
              ></i>
            </div>

          </el-col>
          <el-button-group>
            <el-button
              size="mini"
              circle
              icon="el-icon-minus"
              @click="winControl('minimize')"
            ></el-button>
            <el-button
              type="primary"
              size="mini"
              circle
              icon="el-icon-close"
              @click="winControl('close')"
            ></el-button>
          </el-button-group>
        </el-row>

      </el-header>
</template>
<script>
const electron = require("electron");
const remote = electron.remote;
export default {
  name: "eHeader",
  inject: ["reload"],
  data: () => ({}),
  methods: {
    winControl(action) {
      const browserWindow = remote.getCurrentWindow();
      switch (action) {
        case "minimize":
          browserWindow.minimize();
          break;
        case "maximize":
          // if (this.isMaximized) {
          if (browserWindow.isMaximized()) {
            browserWindow.unmaximize();
          } else {
            if (this.isMaximized) {
              browserWindow.unmaximize();
            } else {
              browserWindow.maximize();
            }
          }
          // this.isMaximized = browserWindow.isMaximized()
          this.isMaximized = !this.isMaximized;

          break;
        case "close":
          browserWindow.close();
          break;
        default:
          break;
      }
    },
    //header
    refresh() {
      this.reload();
      this.$store.commit("editactiveIndex", "0");
      this.$store.commit("edit_tools_no", "");
      this.$store.commit("edit_tools_no", "");
      this.$store.commit("edit_tools_guid", "");
    },
    back() {
      const path = this.$router.currentRoute.path;
      if (path != "/home") {
        this.$router.push("/home");
      }
    },
  },
  mounted: function () {
    this.$store.commit("edit", "");
    this.homeHeader = this.$store.state.header;
  },
};
</script>