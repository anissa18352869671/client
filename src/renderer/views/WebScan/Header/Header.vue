<template lang="">
    <!--头-->
      <el-header
        style="height:44px;"
        router
      >
        <el-row>
          <el-button-group class="btn-left">
            <el-button
             type="primary"
              size="mini"
              circle
              icon="el-icon-arrow-left"
              @click="back"
            ></el-button>
            <el-button
              type="primary"
              size="mini"
              circle
              @click="go"
              icon="el-icon-arrow-right"
            ></el-button>
               <el-button
              type="primary"
              size="mini"
              circle
              @click="refresh"
              icon="el-icon-refresh"
            ></el-button>
          </el-button-group>
          {{title}}
          <el-button-group>
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
  props: {
    title: {
      type: String,
      default: false,
    },
    link: {
      type: String,
      default: false,
    },
  },
  data: () => ({
    // hasTitle: this.title
  }),
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
      this.$emit("refreshContent");
    },
    back() {
      this.$router.back();
    },
    go() {
      this.$router.push(this.link);
    },
  },
  mounted: function () {
    this.$store.commit("edit", "");
    this.homeHeader = this.$store.state.header;
  },
};
</script>