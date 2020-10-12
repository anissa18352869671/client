<template lang="">
    <!--头-->
      <el-header
        style="height:44px;"
        router
      >
        <el-row>
          {{title}}
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
  props: {
    title: {
      type: String,
      default: false
    }
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
      const path = this.$router.currentRoute.path;
      if (path != "/home") {
        this.$router.push("/home");
      }
    }
  },
  mounted: function() {
    this.$store.commit("edit", "");
    this.homeHeader = this.$store.state.header;

    // console.log(this.title);
  }
};
</script>