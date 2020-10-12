<template>
  <div>
    <el-row class="searchBox">
      <el-col :span="17">
        &nbsp;
      </el-col>
      <el-col :span="4">
        <search
          @data="getSearch($event)"
          @reset="init($event)"
          :word="find"
        ></search>
      </el-col>
      <el-col :span="3">
        <div
          class="addTask"
          @click="addTask(true)"
        >
          <span>+</span> &nbsp;新增网站
        </div>
      </el-col>
    </el-row>

    <div
      class="nodrag"
      v-if='hascontent'
    >
      <el-table
        ref="multipleTable"
        :data="tableData"
        @select="choose"
        tooltip-effect="dark"
        style="width: 100%"
        :cell-class-name="addTdClass"
        @selection-change="handleSelectionChange"
        @row-click="detail"
      >
        <el-table-column
          type="selection"
          width="55"
        >
        </el-table-column>

        <el-table-column
          label="网站域名"
          width="180"
          prop="website_url"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <div>
              <span>{{scope.row.website_url}}</span>
            </div>
            <!-- {{ scope.row.website_url }} -->
          </template>
        </el-table-column>
        <el-table-column
          prop="website_name"
          label="网站名称"
          width="160"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <div>
              <span>{{scope.row.website_name}}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="vluns"
          label="威胁"
          width="230"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <span v-for="(item,index) in changeList(scope.row)">
              <i
                class="iconfont icon-bianzu2"
                :class="index|stationColor"
              ></i>
              {{item}}
            </span>

          </template>
        </el-table-column>

        <el-table-column
          prop="status"
          label="状态"
          width="80"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <div>
              <span>{{scope.row.status|stationText}}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="create_time"
          label="时间"
          width="90"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <div>
              <span v-if="!scope.row.update_time">{{time(scope.row.create_time)}}</span>
              <span v-if="scope.row.update_time">{{time(scope.row.update_time)}}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          label=""
          width="190"
          :show-overflow-tooltip="true"
        >
          <template slot-scope="scope">
            <el-tooltip
              class="item"
              content="导出"
              placement="top-start"
              effect="light"
              v-if="scope.row.status==4"
            >
              <span class="icon">
                <img
                  :src="icon.icon1"
                  alt=""
                  @click="showExport(scope.row.taskId)"
                >
              </span>
            </el-tooltip>
            <el-tooltip
              class="item"
              content="对比"
              placement="top-start"
              effect="light"
              v-if="scope.row.status==4"
            >
              <span class="icon">
                <img
                  :src="icon.icon2"
                  alt=""
                  class="compare"
                >
              </span>
            </el-tooltip>
            <el-tooltip
              class="item"
              content="再次检查"
              placement="top-start"
              effect="light"
              v-if="scope.row.status==4"
            >
              <span class="icon">
                <img
                  :src="icon.icon3"
                  alt=""
                  @click="reChenk(scope.row.bill_guid,scope.row.website_url,scope.row.user_id)"
                >
              </span>

            </el-tooltip>
            <el-tooltip
              class="item"
              content="删除"
              placement="top-start"
              effect="light"
            >
              <span class="icon">
                <img
                  :src="icon.icon4"
                  alt=""
                  @click="shanchu(scope.row.bill_guid,scope.row.user_id)"
                >
              </span>
            </el-tooltip>
          </template>

        </el-table-column>
      </el-table>

    </div>
    <div
      class='tablefooter'
      v-if="doSome"
    >
      <span>
        <el-image
          style="width: 40px; height: 40px"
          :src="url"
        >
        </el-image>
        <div>
          删除
        </div>
      </span>
      <span>
        <el-image
          style="width: 40px; height: 40px"
          :src="url"
        >
        </el-image>
        <div>
          检查
        </div>
      </span>
      <div
        class="close"
        @click="toggleSelection()"
      >
        <i class="el-icon-close"></i>
      </div>
    </div>
    <Add
      :_dialogVisible="dialogVisible"
      @dialogVisibleAdd="closeDialogVisible"
    ></Add>

    <Export
      :_dialogExport="dialogExport"
      :_taskId="taskId"
      @dialogVisible="closeDialogExport"
    ></Export>
  </div>
</template>
<script>
const electron = require("electron");
import { ipcRenderer } from "electron";
import Add from "./Modal/Add";
import Export from "./Modal/Export";
import search from "@/components/pageTop/Search/Search";
import { saveWebscan, getwebscanByGuid } from "~/api/web/webScanDao";
import {
  getWebsiteBy,
  updateWebsite,
  saveWebsite,
  getwebsiteByName,
} from "~/api/web/webSiteDao";
import { getDate } from "~/utils/func/time";
import { saveTask, getTaskByGuid } from "~/api/tasks/taskDao";
import { sendMq } from "~/api/web/webApi";
import { GUID } from "~/utils/guid";
export default {
  props: {},
  inject: ["reload"],
  components: { search, Add, Export },
  data() {
    return {
      find: "搜索",
      hascontent: true,
      icon: {
        icon1: "./static/img/webscan/export.png",
        icon2: "./static/img/webscan/compare.png",
        icon3: "./static/img/webscan/restart.png",
        icon4: "./static/img/webscan/delete.png",
      },
      tableData: [
        // {
        //   id: 1,
        //   website_url: "http://www.baidu.com",
        //   website_name: "重庆市园林局政府公众信息网站",
        //   vluns: "22,34,233,1231",
        //   status: 1,
        //   create_time: "2020-09-12",
        // },
        // {
        //   id: 2,
        //   website_url: "http://www.baidu.com",
        //   website_name: "王小虎",
        //   vluns: "7,34,233,0",
        //   status: 0,
        //   create_time: "2020-09-12",
        // },
        // {
        //   id: 3,
        //   website_url: "http://www.baidu.com",
        //   website_name: "王小虎",
        //   vluns: "22,34,8,1",
        //   status: 0,
        //   create_time: "2020-09-12",
        // },
      ],
      multipleSelection: [],
      url: "./static/img/webscan/check.png",
      doSome: false,
      dialogVisible: false,
      dialogExport: false,
      taskId: "",
    };
  },
  filters: {
    stationColor: function (value) {
      let map = { 1: "high", 2: "middle", 3: "low", 0: "over" };
      return map[value];
    },
    stationState: function (value) {
      let map = {
        1: "icon-fankui",
        2: "icon-chuzhi",
      };
      return map[value];
    },
    //4为完成,5为检测中,6为审核中,7为审核不通过
    stationText: function (value) {
      let map = {
        4: "已完成",
        5: "检测中",
        6: "审核中",
        7: "审核不通过",
      };
      return map[value];
    },
    stationTips: function (value) {
      let map = {
        1: "待签收",
        2: "运行",
      };
      return map[value];
    },
    //1未运行，2运行中，3已完成
    stationTools: function (value) {
      let map = {
        1: "未运行",
        2: "运行中",
        3: "已完成",
      };
      return map[value];
    },
    stationIcon: function (value) {
      let map = {
        0: "签收",
        1: "反馈",
      };
      return map[value];
    },
  },
  methods: {
    addTdClass({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 6) {
        return "hide";
      }
    },
    //搜索功能
    getSearch(data) {
      let _this = this;
      getwebsiteByName(data).then((res) => {
        if (res.length > 0) {
          _this.tableData = res;
          _this.getTableList();
        } else {
          this.$message({
            type: "error",
            message: "没有查到当前消息",
            offset: 200,
          });
        }
      });
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    addTask() {
      this.dialogVisible = true;
      //   this.$emit("dialogVisible", true);
    },
    closeDialogVisible(data) {
      if (data == "add") {
        this.reload();
      } else {
        this.dialogVisible = false;
      }
    },
    closeDialogExport(data) {
      this.dialogExport = data;
    },
    choose(selection, row) {
      if (selection.length == 0) {
        this.doSome = false;
      } else {
        this.doSome = true;
      }
    },
    toggleSelection(rows) {
      this.doSome = false;
      if (rows) {
        rows.forEach((row) => {
          this.$refs.multipleTable.toggleRowSelection(row);
        });
      } else {
        this.$refs.multipleTable.clearSelection();
      }
    },
    detail(row, column, event) {
      if (event.target.localName == "img") {
      } else {
        getwebscanByGuid(row.bill_guid).then((res) => {
          if (res.length > 0) {
            this.$router.push("/webscan/Detail/" + row.bill_guid);
          }
        });
      }
    },
    showExport(data) {
      this.taskId = data;
      this.dialogExport = true;
    },
    init() {
      let _this = this;
      getWebsiteBy().then((res) => {
        _this.tableData = res;
        _this.getTableList();
      });

      //监听网站监测详情
      ipcRenderer.on("openWebScanWindowRouter", (event, obj) => {
        console.log("监听");
        // res.status = 4;
        console.log(obj);
        this.$router.push("/webscan/Detail/" + obj);
      });
    },
    getTableList() {
      let _this = this;
      for (const key in _this.tableData) {
        getwebscanByGuid(_this.tableData[key].bill_guid).then((resWebscan) => {
          if (resWebscan[0]) {
            if (resWebscan[0].severity_counts) {
              let arr = JSON.parse(resWebscan[0].severity_counts);
              _this.tableData[
                key
              ].severity_counts = `${arr.high},${arr.medium},${arr.low},${arr.info}`;
            }
            _this.tableData[key].taskId = resWebscan[0].taskId;

            getTaskByGuid(resWebscan[0].taskId).then((resultTask) => {
              _this.tableData[key].status = resultTask[0].status;
            });
          }
        });
      }
    },
    //再次检查
    reChenk(website_guid, url, user_id) {
      let _this = this;
      this.$confirm("此操作将再次检查, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          let _task_guid = new GUID().newGUID();
          let time = getDate(new Date().getTime(), "-", 8);
          //新建任务
          var task = {
            create_time: new Date().getTime(),
            task_guid: _task_guid,
            task_name: "网站监测" + time,
            //2未运行,3为运行中，4为完成,5为审核中
            status: 5,
          };
          saveTask(task, function () {});
          //新增webscan记录
          let webscan = {
            bill_guid: _task_guid,
            user_id: user_id,
            website_guid: website_guid,
            url: url,
            taskId: _task_guid,
            create_time: new Date(),
            desc: "网站监测" + time,
          };
          saveWebscan(webscan, function () {});
          //传mq
          let mq = {
            webscan: {
              user_id: user_id,
              website_guid: website_guid,
              url: url,
              taskId: _task_guid,
              desc: "网站监测" + time,
            },
          };
          sendMq(mq);
          this.reload();
          this.$message({
            type: "success",
            message: "开始检查!",
          });
        })
        .catch(() => {});
    },
    shanchu(website_guid, user_id) {
      let _this = this;
      let data = {
        bill_guid: website_guid,
        del_flag: 1,
      };
      saveWebsite(data, function () {
        _this.init();
      });

      let mq = {
        del_website: {
          user_id: user_id,
          bill_guid: website_guid,
        },
      };
      sendMq(mq);
    },
  },
  computed: {
    changeList(data) {
      return function (data) {
        var newList = [];
        if (data.severity_counts) {
          newList = data.severity_counts.split(",");
        } else {
          newList = [0, 0, 0, 0];
        }
        return newList;
      };
    },
    time(time) {
      return function (time) {
        return getDate(time, "-", 0);
      };
    },
  },
  mounted() {
    this.init();
    console.log("table");
  },
  watch: {},
};
</script>