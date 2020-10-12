<template >
  <!-- 账户信息弹框 -->
  <div
    class="userInfo vulnsDetail webscan"
    v-cloak
  >
    <eHeader :title="title"></eHeader>
    <!-- :visible.sync="dialogFormVisible" -->
    <div class="dialog-content nodrag">
      <div class="vuln-title" v-if="list.lib">
        <span class="blue"></span>{{list.lib.vtName}}
      </div>
      <div class="parts" v-if="list.lib">
        <div class="header">漏洞简介</div>
        <div v-html="list.lib.description"></div>
      </div>
      <div class="parts">
        <div class="header">HTTP响应</div>
        <div>{{list.responseInfo}}</div>
      </div>
      <div class="parts">
        <div class="header">此漏洞的影响</div>
        <div>{{list.impact}}</div>
      </div>
      <div class="parts" v-if="list.lib">
        <div class="header">如何修复此漏洞</div>
        <div v-html="list.lib.recommendation"></div>
      </div>
    </div>

  </div>
</template>
<script>
import { getDate } from "~/utils/func/time";
import eHeader from "@/views/Modal/Header/Header";
const electron = require("electron");
import { ipcRenderer } from "electron";
import { saveWebscan, getwebscanByBill } from "~/api/web/webScanDao";
import { getWebsiteBy, getWebsiteByGuid } from "~/api/web/webSiteDao";
export default {
  components: {
    eHeader,
  },
  data() {
    return {
      website_name: "",
      vulns_detail: [],
      list: [],
      title: "",
      webscan: {},
    };
  },
  filters: {},
  methods: {
    init() {
      let _this = this;
      getwebscanByBill(_this.webscan.webscan_guid).then((res) => {
        _this.vulns_detail = JSON.parse(res[0].vulns_detail);
        _this.vulns_detail.forEach((element) => {
          if (element.bill_guid == _this.webscan.bill_guid) {
            element.lib = JSON.parse(element.lib);
            _this.list = element;
          }
        });
      });

      // getWebsiteByGuid(_this.webscan.bill_guid).then((res) => {
      //   console.log(res);
      //   if (res.length > 0) {
      //     _this.website_name = res[0].website_name;
      //   }
      // });
    },
  },
  computed: {

  },
  mounted() {
    this.webscan = electron.remote.getGlobal("sharedObject").webscan;
    this.init();
    // this.getData(this.vuln_id);
  },
  watch: {},
};
</script>
