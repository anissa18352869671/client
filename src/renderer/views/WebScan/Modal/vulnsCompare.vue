<template >
  <!-- 账户信息弹框 -->
  <div class="userInfo vulnsDetail webscan">
    <eHeader :title="title"></eHeader>
    <!-- :visible.sync="dialogFormVisible" -->
    <div class="dialog-content nodrag">
      <div class="vuln-title">
        <span class="blue"></span>{{webscan.website_name}}
      </div>
      <el-table :data="tableData"
        class="compareTable" border style="width: 100%" >
        <el-table-column prop="name"
          label="" width="180" >
          <template slot="header" slot-scope="scope" >
            <!-- <el-radio v-model="radio" label="1"
            >高亮显示减少字段</el-radio>
            <el-radio v-model="radio" label="2"
            >高亮显示增加字段</el-radio> -->
            漏洞名称
          </template>
          
          <template slot-scope="scope">
            <span v-if="scope.row.difFlag" style="color:red">{{scope.row.name}}</span>
            <span v-if="!scope.row.difFlag" >{{scope.row.name}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="level" label="威胁等级" width="100" align="center" >
          <template slot-scope="scope">
            {{scope.row.severity|stationWord}}
          </template>
        </el-table-column>
        <el-table-column prop="now" label="" width="200" align="center" >
          <template slot="header" slot-scope="scope" >
            <div>{{getTime(tableTh.last_scan_date)}}</div>
            <div class="center">
              <span v-for="(item,index) in changeList(tableTh)" :key="item.index">
                <i class="iconfont icon-bianzu2" :class="index|stationColor" ></i>
                {{item}}
              </span>
            </div>
          </template>

          <template slot-scope="scope">
            <div :title="item.url"
              class="url" v-for="(item,index) in scope.row.now"
              :key="item.index" >
              {{item.url}}
            </div>
            <!-- {{scope.row.now|stationWord}} -->
          </template>
        </el-table-column>
        <el-table-column prop="last" label="" align="center" >
          <template slot="header" slot-scope="scope" >
            <el-select
              v-model="value"
              placeholder="选择检查记录"
              @change="changeSelect"
            >
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
            <div class="center">
              <span v-for="(item,index) in changeList(tableTh2)" :key="item.index">
                <i
                  class="iconfont icon-bianzu2"
                  :class="index|stationColor"
                ></i>
                {{item}}
              </span>
            </div>
          </template>
          <template slot-scope="scope">
            <div
              :title="item.url"
              class="url"
              v-for="(item,index) in scope.row.last"
              :key="item.index"
            >
              {{item.url}}
            </div>
            <!-- {{scope.row.now|stationWord}} -->
          </template>
        </el-table-column>
      </el-table>
    </div>

  </div>
</template>
<script>
import eHeader from "@/views/Modal/Header/Header";
const electron = require("electron");
import { ipcRenderer } from "electron";
import {
  saveWebscan,
  getwebscanByBill,
  getwebscanByGuid,
} from "~/api/web/webScanDao";
import { getWebsiteBy, getWebsiteByGuid } from "~/api/web/webSiteDao";
import { resolvingDate } from "~/utils/func/time";
export default {
  components: {
    eHeader,
  },
  data() {
    return {
      vuln_id: "",
      title: "",
      webscan: {},
      vulns_detail: [],
      vulns_detail_compare: [],
      list: [],
      tableTh: [],
      tableTh2: [],
      tableData: [
        {
          name: "王小虎",
          severity: "上海市普陀区金沙江路 1518 弄",
          now: [],
        },
        {
          name: "王小虎",
          severity: "上海市普陀区金沙江路 1518 弄",
          now: [],
        },
      ],
      radio: "1",
      options: [
        {
          value: "选项1",
          label: "黄金糕",
        },
        {
          value: "选项2",
          label: "双皮奶",
        },
      ],
      value: "",
      _object: {},
      objectGuid: {},
    };
  },
  filters: {
    stationColor: function (value) {
      let map = { 1: "high", 2: "middle", 3: "low", 0: "over" };
      return map[value];
    },
    stationWord: function (value) {
      let map = { 3: "高危", 2: "中危", 1: "低危", 0: "信息" };
      return map[value];
    },
  },
  methods: {
    init() {
      let _this = this;
      getwebscanByBill(_this.webscan.webscan_guid).then((res) => {
        _this.tableTh = res[0];
        if (res[0].severity_counts) {
          let arr = JSON.parse(res[0].severity_counts);
          _this.tableTh.severity_counts = `${arr.high},${arr.medium},${arr.low},${arr.info}`;
        }
        _this.vulns_detail = JSON.parse(res[0].vulns_detail);
        _this.getData();
      });

      getwebscanByGuid(_this.webscan.bill_guid).then((res) => {
        // console.log(res);
        _this.options = [];
        res.forEach((element) => {
          if (element.bill_guid != _this.webscan.webscan_guid) {
            _this.options.push({
              value: element.bill_guid,
              label: _this.getTime(element.last_scan_date),
            });
          }
        });

        // console.log(_this.options);
      });

      // vulns_detail_compare
    },
    getCompare(guid) {
      let _this = this;
      getwebscanByBill(guid).then((res) => {
        console.info(res);
        _this.tableTh2 = res[0];
        if (res[0].severity_counts) {
          let arr = JSON.parse(res[0].severity_counts);
          _this.tableTh2.severity_counts = `${arr.high},${arr.medium},${arr.low},${arr.info}`;
          _this.vulns_detail_compare = JSON.parse(res[0].vulns_detail);
          _this.getData(guid);
        } else {
          this.init();
        }
        // console.log(_this.vulns_detail_compare);
      });
    },
    getData(guid) {
      let _this = this;
      // console.log(_this.vulns_detail);
      this._object = {};
      this.objectGuid = {};
      for (var i = 0; i < _this.vulns_detail.length; i++) {
        if (typeof _this.vulns_detail[i].lib == "string") {
          _this.vulns_detail[i].lib = JSON.parse(_this.vulns_detail[i].lib);
        }
        if (!this._object[_this.vulns_detail[i].lib.vtName]) {
          this._object[_this.vulns_detail[i].lib.vtName] = [];
        }
        this._object[_this.vulns_detail[i].lib.vtName].push({
          url: _this.vulns_detail[i].affectsUrl,
          // url: _this.vulns_detail[i].affectsUrl,
          severity: _this.vulns_detail[i].severity,
        });
        this.objectGuid[_this.vulns_detail[i].lib.vtName] = [];
      }
      //guid为传入的需要对比的webscanGuid,思路根据此id获取对应res的vulns_detail，塞入数组
      if (guid) {
        for (var i = 0; i < _this.vulns_detail_compare.length; i++) {
          if (typeof _this.vulns_detail_compare[i].lib == "string") {
            _this.vulns_detail_compare[i].lib = JSON.parse(
              _this.vulns_detail_compare[i].lib
            );
          }

          if (!this.objectGuid[_this.vulns_detail_compare[i].lib.vtName]) {
            this.objectGuid[_this.vulns_detail_compare[i].lib.vtName] = [];
          }
          this.objectGuid[_this.vulns_detail_compare[i].lib.vtName].push({
            url: _this.vulns_detail_compare[i].affectsUrl,
            severity: _this.vulns_detail_compare[i].severity,
          });
          // 如果_object没有放一个空值
          if (!this._object[_this.vulns_detail_compare[i].lib.vtName]) {
            var temp = {};
            var num= 0;
            // 新的值应插入到对比项相当的位置
            for (let k of Object.keys(this._object)) {
              if(num==i) {
                temp[_this.vulns_detail_compare[i].lib.vtName] = [];
              }
              temp[k] = this._object[k];
              num++;
            }
            this._object = temp;
          }
        }
      }
      // console.info(this._object);
      _this.tableData = [];

      for (var key in this._object) {
        // console.log(key, this._object[key]);
        let dif = false;
        let url1 = this._object[key][0]==undefined?undefined:this._object[key][0].url;
        let url2 = this.objectGuid[key][0]==undefined?undefined:this.objectGuid[key][0].url;
        if(url1!=url2) {
          dif = true;
        }
        _this.tableData.push({
          name: key,
          severity: this._object[key][0]==undefined?this.objectGuid[key][0].severity:this._object[key][0].severity,
          now: this._object[key],
          last: this.objectGuid[key],
          difFlag: dif
        });
      }
    },
    changeSelect(data) {
      // console.log(data);
      let selectVal = this.value;
      // alert(selectVal);
      this.getCompare(selectVal);
    },
  },
  computed: {
    getTime(time) {
      return function (time) {
        return resolvingDate(time);
      };
    },
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
  },
  mounted() {
    this.webscan = electron.remote.getGlobal("sharedObject").compare;
    console.log(this.webscan);
    // webscan: {
    //   bill_guid: "82cb9b98-a134-3d63-eb58-70546988b07e";
    //   webscan_guid: "1d15f009-e134-3d63-eb58-719587dd3346";
    //   website_name: "测试网站0819";
    // }
    this.init();
    // this.getData(this.vuln_id);
  },
  watch: {},
};
</script>
