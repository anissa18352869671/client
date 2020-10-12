<template lang="">
    <div class="detailScan">
        <el-row class="searchBox">
            <el-col :span="18">
                &nbsp;
            </el-col>
            <el-col :span="4">
                <search
                @data="getSearch($event)"
                :word="find"
                 @reset="init($event)"
                ></search>
            </el-col>
            <el-col :span="2" class="export">
                <span>
                    <i class="icon el-icon-aim"></i>
                </span>

                <span>
                    <i class="icon el-icon-upload2"></i>
                </span>
            </el-col>
        </el-row>
        <el-row class="detailContent">
            <el-col :span="8" class="left">
              <div class="title">{{list.website_name}}</div>
              <div class="subtitle">{{list.website_url}}</div>
              <ul class="info">
                <li v-for="(item,index) in pastData" >
                  <div  @click="changeTableData(index)">
                    <div class="time" v-if="item.last_scan_date">
                    {{changeTime(item.last_scan_date)}}
                    </div>
                    <div class="time" v-if="!item.last_scan_date">
                    {{changeCreateTime(item.create_time)}}
                    </div>
                    <div>
                      <span v-for="(item1,index1) in changeList(item.severity_counts)">
                        <i
                          class="iconfont icon-bianzu2"
                          :class="index1|stationColor2"
                        ></i>
                        {{item1}}
                      </span>
                    </div>
                    <div class="status" :class="item.status|classColor" >
                       <a @click="compare(index,item.status)">{{item.status|stationText}}</a> 
                       <a v-if="item.status=='completed'" @click="showExport(item.taskId)">报告导出</a>
                    </div>
                  </div>
                </li>
              </ul>
            </el-col>
            <el-col :span="16">
                  <el-table
                    :data="tableData"
                    style="width: 100%"
                    @row-click="detail">
                    <el-table-column
                      prop="num"
                      label="序号"
                      width="60" >
                     
                    </el-table-column>
                    <el-table-column
                      prop="status"
                      label="等级"
                      width="60" >
                      <template slot-scope="scope">
                         <i
                          class="iconfont icon-bianzu2"
                          :class="scope.row.severity|stationColor"
                        ></i>
                       
                      </template>
                    </el-table-column>
                    <el-table-column
                      label="漏洞名称"
                       show-overflow-tooltip
                      >
                      <template slot-scope="scope">
                        <div>
                          <span v-if="scope.row.lib">{{scope.row.lib.vtName}}</span>
                        </div>
                      </template>
                    </el-table-column>
                    <el-table-column
                      prop="lib.cvssScore"
                      label="通用漏洞评分"
                        width="200"
                      >
                    </el-table-column>
                  </el-table>
                   <div class="block">
                   <el-pagination
                      @size-change="handleSizeChange"
                      @current-change="handleCurrentChange"
                      :current-page.sync="currentPage"
                      :page-size="pageSize"
                      layout="prev, pager, next, jumper"
                      :total="total"
                      v-if="total>0"
                      >
                    </el-pagination>
                  </div>
            </el-col>
        </el-row>
        <Export
          :_dialogExport="dialogExport"
          :_taskId="taskId"
          @dialogVisible="closeDialogExport"
        ></Export>
    </div>
</template>
<script>
const electron = require("electron");
const remote = electron.remote;
import { ipcRenderer } from "electron";
import search from "@/components/pageTop/Search/Search";
import Export from "./Modal/Export";
import { saveWebscan, getwebscanByGuid } from "~/api/web/webScanDao";
import { getWebsiteBy, getWebsiteByGuid } from "~/api/web/webSiteDao";
import { getDate, resolvingDate } from "~/utils/func/time";

export default {
  components: { search, Export },
  data() {
    return {
      find: "搜索",
      list: [],
      pastData: [
        // {
        //   id: 1,
        //   domain: "http://www.baidu.com",
        //   time: "2020-11-03",
        //   vluns: "22,34,233,1231",
        //   status: 1,
        // },
        // {
        //   id: 2,
        //   domain: "http://www.baidu.com",
        //   time: "1996-11-03",
        //   vluns: "7,34,233,0",
        //   status: 0,
        // },
        // {
        //   id: 3,
        //   domain: "http://www.baidu.com",
        //   time: "3200-11-03",
        //   vluns: "22,34,8,1",
        //   status: 0,
        // },
      ],
      tableData: [
        // {
        //   status: "0",
        //   name: "没有CSRF保护的HTML表单",
        //   address: "CWE-264",
        // },
        // {
        //   status: "1",
        //   name: "没有CSRF保护的HTML表单",
        //   address: "上海市普陀区金沙江路 1517 弄",
        // },
        // {
        //   status: "2",
        //   name: "没有CSRF保护的HTML表单",
        //   address: "上海市普陀区金沙江路 1519 弄",
        // },
        // {
        //   status: "3",
        //   name: "王小虎",
        //   address: "上海市普陀区金沙江路 1516 弄",
        // },
      ],
      vulns_detail: [],
      bill_guid: "",
      currentPage: 1,
      pageSize: 8,
      total: 0,
      webscan_guid: "",
      dialogVisible: false,
      dialogExport: false,
      taskId: "",
    };
  },
  filters: {
    stationColor: function (value) {
      let map = { 2: "high", 1: "middle", 0: "low", 3: "over" };
      return map[value];
    },
    stationColor2: function (value) {
      let map = { 1: "high", 2: "middle", 3: "low", 0: "over" };
      return map[value];
    },
    classColor: function (value) {
      let map = { processing: "verify", completed: "compare" };
      return map[value];
    },
    stationText: function (value) {
      let map = {
        completed: "去对比",
        processing: "检测中",
      };
      return map[value];
    },
  },
  computed: {
    changeList(data) {
      return function (data) {
        var newList = data.split(",");
        if (!data) {
          newList = [0, 0, 0, 0];
        }

        return newList;
      };
    },
    changeTime(data) {
      return function (data) {
        return resolvingDate(data);
      };
    },
    changeCreateTime(data) {
      return function (data) {
        return getDate(data, "-", 8);
      };
    },
  },
  methods: {
    showExport(data) {
      this.taskId = data;
      this.dialogExport = true;
    },
    closeDialogExport(data) {
      this.dialogExport = data;
    },
    getSearch(data) {
      let _this = this;
      _this.currentPage = 0;
      var arr = [];
      var reg = new RegExp(data);

      _this.vulns_detail.forEach((element) => {
        if (element.lib && element.lib.vtName) {
          if (element.lib.vtName.match(reg)) {
            arr.push(element);
          }
        }
      });

      if (arr.length > 0) {
        _this.vulns_detail = arr;
        _this.getVulns(_this.currentPage);
      } else {
        this.$message({
          type: "error",
          message: "没有查到当前记录",
          offset: 200,
        });
      }
    },
    compareDetail(){
      return function(a,b){
        if(a.severity==b.severity) {
          var value1 = a.lib.cvssScore;
          var value2 = b.lib.cvssScore;
          return value2 - value1;
        }
        return b.severity - a.severity;
      }
    },
    init() {
      let _this = this;
      _this.bill_guid = _this.$route.params.id;
      getwebscanByGuid(_this.bill_guid).then((res) => {
        if (res.length > 0) {
          res.forEach((element, index) => {
            if (element.severity_counts) {
              let arr = JSON.parse(element.severity_counts);
              res[index].severity_counts = `${arr.high},${arr.medium},${arr.low},${arr.info}`;
            }
            if (element.vulns_detail) {
              let arr = JSON.parse(element.vulns_detail);
              res[index].vulns_detail = arr;
              res[index].vulns_detail.forEach((element1, index1) => {
                if (element1.lib) {
                  let arr = JSON.parse(element1.lib);
                  res[index].vulns_detail[index1].lib = arr;
                }
              });
            }

            if (element.vulns_detail && element.vulns_detail.lib) {
              let arr = JSON.parse(element.vulns_detail.lib);
              res[index].vulns_detail.lib = arr;
            }
            // 给vulns_detail排个序
            let tempDetail = res[index].vulns_detail;
            if(tempDetail) {
              // console.info(tempDetail);
              res[index].vulns_detail = tempDetail.sort(this.compareDetail());
            }
          });

          _this.pastData = res;

          //默认漏洞信息为最新一条
          _this.getVulnsDetail(0);
        }
      });

      getWebsiteByGuid(_this.bill_guid).then((res) => {
        _this.list = res[0];
      });
    },
    getVulnsDetail(data) {
      let _this = this;
      _this.webscan_guid = _this.pastData[data].bill_guid;
      _this.vulns_detail = _this.pastData[data].vulns_detail;
      _this.getVulns(_this.currentPage);
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      let _this = this;
      _this.getVulns(val);
    },
    getVulns(current) {
      current = current - 1 < 0 ? 0 : current - 1;
      let _this = this;
      _this.total = _this.vulns_detail.length;
      _this.tableData = [];
      for (
        let i = current * _this.pageSize;
        i <
        (_this.total - current * _this.pageSize <
        _this.pageSize + current * _this.pageSize
          ? _this.total
          : _this.pageSize + current * _this.pageSize);
        i++
      ) {
        if (_this.vulns_detail.length > 0 && _this.vulns_detail[i].lib) {
          _this.vulns_detail[i].num = i + 1;
          _this.tableData.push(_this.vulns_detail[i]);
        }
      }
    },
    detail(row, column, event) {
      electron.remote.getGlobal("sharedObject").webscan = {
        webscan_guid: this.webscan_guid,
        bill_guid: row.bill_guid,
      };
      ipcRenderer.send("openWebVulnWindow");
    },
    changeTableData(data) {
      let _this = this;
      _this.currentPage = 0;
      _this.getVulnsDetail(data);
    },
    compare(index, data) {
      this.changeTableData(index);
      if (data == "completed") {
        electron.remote.getGlobal("sharedObject").compare = {
          webscan_guid: this.webscan_guid,
          bill_guid: this.bill_guid,
          website_name: this.list.website_name,
        };
        ipcRenderer.send("openVulnsCompare");
      }
    },
  },
  mounted() {
    this.init();
  },
};
</script>