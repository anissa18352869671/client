<template >
  <!-- 账户信息弹框 -->
  <div class="userInfo tags">
    <eHeader :title="title"></eHeader>
    <div class="dialog-content nodrag">
      <el-col :span="24">
        <search></search>
        <TagsList
          :tags="tags"
          @changeList="changeList"
        ></TagsList>
      </el-col>

    </div>
  </div>
</template>
<script>
const electron = require("electron");
const remote = electron.remote;
import { ipcRenderer } from "electron";
import axios from "axios";
import eHeader from "./Header/Header";
import TagsList from "./Tags/TagsList";
import search from "@/components/pageTop/Search/Search";
export default {
  components: {
    eHeader,
    TagsList,
    search
  },
  data() {
    return {
      title: "添加标签",
      tags: [
        {
          value: "360",
          checked: 1
        },
        {
          value: "Windows",
          checked: 0
        },
        {
          value: "数据清洗",
          checked: 0
        },
        {
          value: "执法",
          checked: 0
        },
        {
          value: "大数据",
          checked: 1
        },
        {
          value: "网络安全",
          checked: 1
        },
        {
          value: "a是的",
          checked: 0
        },
        {
          value: "linux系統",
          checked: 0
        },
        {
          value: "安卓",
          checked: 0
        }
      ] 
    };
  },
  methods: {
    changeList(res){
      remote.getGlobal('sharedObject').tags = this.tags
    }
    
  }
};
</script>
