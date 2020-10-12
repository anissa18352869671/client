<template>
  <div>
    <el-tabs v-if="!showForm"
      v-model="payList.activeList"
      @tab-click="handleClick"
    >
      <el-tab-pane
        label="全部订单"
        name="first"
      >
        <span v-if="payList.data.length==0">未找到订单！</span>
        <div v-for="item in payList.data" :key="item.orderGuid">
          <div class="payBox">
            <div>订单编号： <template>
              {{item.orderNo.substring(0,1)+item.orderNo.substring(38)}}</template></div>
            <div class="status"> <span>{{item.createTime}}</span> <span
                :class="item.status==4?'success':''"
                class="payStatus"
              >{{item.status|stationText}} </span><span>金额：￥<font>{{item.buyPrice}}</font></span></div>
            <hr>
            <div>
                <div><i class="iconfont icon-setting"></i>&nbsp;&nbsp;&nbsp;{{item.packName}}</div>
                <div>
                  <el-button v-if="item.status==0" @click="payOrderGuid(item)">去支付</el-button>
                  <el-button @click="getDetail(item.orderGuid)">订单详情</el-button>
                  <el-button v-if="item.ticket==undefined && item.status=='1'" @click="showTicketForm(item)" >开票申请</el-button>
                </div>
            </div>
          </div>


        </div>

      </el-tab-pane>
      <el-tab-pane
        label="待支付"
        name="second"
      >
        <span v-if="payList.data2.length==0">未找到订单！</span>
        <div v-for="item in payList.data2" :key="item.orderGuid">
          <div class="payBox">
            <div>订单编号： <template>
              {{item.orderNo.substring(0,1)+item.orderNo.substring(38)}}</template></div>
            <div class="status"> <span>{{item.createTime}}</span> <span
                :class="item.status==4?'success':''"
                class="payStatus"
              >{{item.status|stationText}} </span><span>金额：￥<font>{{item.buyPrice}}</font></span></div>
            <hr>
            <div>
                <div><i class="iconfont icon-setting"></i>&nbsp;&nbsp;&nbsp;{{item.packName}}</div>
                <div>
                  <el-button v-if="item.status==0" @click="payOrderGuid(item)">去支付</el-button>
                  <el-button @click="getDetail(item.orderGuid)">订单详情</el-button>
                </div>
            </div>
          </div>

        </div>
      </el-tab-pane>
      <el-tab-pane
        label="已支付"
        name="third"
      >
        <span v-if="payList.data3.length==0">未找到订单！</span>
        <div v-for="item in payList.data3" :key="item.orderGuid">
          <div class="payBox">
            <div>订单编号： <template>
              {{item.orderNo.substring(0,1)+item.orderNo.substring(38)}}</template></div>
            <div class="status"> <span>{{item.createTime}}</span> <span
                :class="item.status==4?'success':''"
                class="payStatus"
              >{{item.status|stationText}} </span><span>金额：￥<font>{{item.buyPrice}}</font></span></div>
            <hr>
            <div>
              <div><i class="iconfont icon-setting"></i>&nbsp;&nbsp;&nbsp;{{item.packName}}</div>
              <div>
                <el-button @click="getDetail(item.orderGuid)">订单详情</el-button>
                <el-button v-if="item.ticket==undefined && item.status=='1'" @click="showTicketForm(item)" >开票申请</el-button>
              </div>
            </div>
          </div>

        </div>
      </el-tab-pane>
    </el-tabs>
    <!-- <search></search> -->
    <!-- <div class="searchInput"> -->
      <!-- <a @click="ptoYunMyOrder()" >历史订单</a> -->
    <!-- </div> -->

    <el-form v-if="showForm" ref="form" :model="form" :rules="rules" label-width="130px">
        <el-form-item label="开票金额" prop="ticketAmount">
          <el-input :disabled="true" v-model="form.ticketAmount"  />
        </el-form-item>
        <el-form-item label="开具类型" prop="ticketEnterprise">
          <el-select style="width:100%;" @change="changeticketEnter" v-model="form.ticketEnterprise" placeholder="请选择开具类型" >
            <el-option
              v-for="dict1 in ticketEnterOptions"
              :key="'dict1-'+dict1.dict_value"
              :label="dict1.dict_label"
              :value="dict1.dict_value" />
          </el-select>
        </el-form-item>
        <el-form-item label="发票抬头" prop="ticketTitle">
          <el-input v-model="form.ticketTitle" placeholder="请输入发票抬头" maxlength="100" />
        </el-form-item>
        <el-form-item label="纳税人识别号" prop="ticketTaxParagraph" >
          <el-input v-model="form.ticketTaxParagraph" placeholder="请输入纳税人识别号" maxlength="100" />
        </el-form-item>
        <el-form-item label="开票方式" prop="ticketMode">
          <el-select style="width:100%;" v-model="form.ticketMode" placeholder="请选择开票方式" >
            <el-option
              v-for="dict2 in ticketModeOptions"
              :key="'dict2-'+dict2.dict_value"
              :label="dict2.dict_label"
              :value="dict2.dict_value" />
          </el-select>
        </el-form-item>
        <el-form-item label="发票类型" prop="ticketProperties">
          <el-select style="width:100%;" v-model="form.ticketProperties" placeholder="发票类型" >
            <el-option
              v-for="dict3 in ticketPropOptions"
              :key="'dict3-'+dict3.dict_value"
              :label="dict3.dict_label"
              :value="dict3.dict_value" />
          </el-select>
        </el-form-item>
          <el-form-item label="邮箱" prop="ticketEmail">
            <el-input v-model="form.ticketEmail" placeholder="请输入电子邮箱" maxlength="100" />
          </el-form-item>
          <el-form-item label="邮寄地址" prop="ticketAddr">
            <el-input v-model="form.ticketAddr" placeholder="请输入发票邮寄地址" maxlength="200" />
          </el-form-item>
          <el-form-item label="收件人姓名" prop="ticketReceiver">
            <el-input v-model="form.ticketReceiver" placeholder="请输入收件人姓名" maxlength="50" />
          </el-form-item>
          <el-form-item label="收件人联系方式" prop="ticketPhone">
            <el-input v-model="form.ticketPhone" placeholder="请输入收件人联系方式" maxlength="50" />
          </el-form-item>
          <el-form-item label="" prop="">
            <el-button type="primary" @click="submitForm">确 定</el-button>
            <el-button @click="cancel">取 消</el-button>
          </el-form-item>
      </el-form>

    <el-drawer class="orderDetail" title="订单详情" :visible.sync="drawer" :direction="direction" size="80%" >
      <el-form ref="orderDetail" :model="orderDetail" label-width="90px">
        <el-form-item label="订单编号" prop="orderNo">
          <span>{{orderDetail.orderNo}}</span>
        </el-form-item>
        <el-form-item label="下单时间" prop="buyTime">
          <span>{{orderDetail.buyTime}}</span>
        </el-form-item>
        <el-form-item label="购买内容" prop="packName">
          <span>{{orderDetail.packName}}</span>
        </el-form-item>
        <el-form-item label="应付原价" prop="packPrice">
          <span>￥{{orderDetail.packPrice}}</span>
        </el-form-item>
        <el-form-item label="实际应付" prop="buyPrice">
          <span>￥{{orderDetail.buyPrice}}</span>
        </el-form-item>
        <el-form-item label="买家备注" prop="buyerDescribe">
          <span>{{orderDetail.buyerDescribe}}</span>
        </el-form-item>
        <el-form-item v-if="orderDetail.changeCause!=undefined" label="价格备注" prop="changeCause">
          <span>{{orderDetail.changeCause}}</span>
        </el-form-item>
        <el-form-item label="订单状态" prop="status">
          <span>{{orderDetail.status|stationText}}</span>
        </el-form-item>
        <el-form-item v-if="orderDetail.ticket" label="开票申请" prop="ticket">
        </el-form-item>
        <el-row :gutter="15" v-if="orderDetail.ticket">
            <el-col :span="12">
              <el-form-item label="发票类型" >
                <span>{{ticketPropFormat(orderDetail.ticket.ticketProperties)}}</span>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="开票状态" >
                <span>{{ticketApplyStateFormat(orderDetail.ticket.status)}}</span>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="开票金额" >
                <span>{{orderDetail.ticket.ticketAmount}} </span>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="发票抬头" >
              <span>{{orderDetail.ticket.ticketTitle}} </span>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="发票税号" >
                <span>{{orderDetail.ticket.ticketTaxParagraph}} </span>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="收件人" >
                <span>{{orderDetail.ticket.ticketReceiver}} </span>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="联系方式" >
                <span>{{orderDetail.ticket.ticketPhone}} </span>
              </el-form-item>
            </el-col>
            <el-col :span="24" v-if="orderDetail.ticket.ticketEmail!=undefined">
              <el-form-item label="邮箱" >
                <span>{{orderDetail.ticket.ticketEmail}}</span>
              </el-form-item>
            </el-col>
            <el-col :span="24" v-if="orderDetail.ticket.ticketAddr!=undefined">
              <el-form-item label="邮寄地址" >
                <span>{{orderDetail.ticket.ticketAddr}}</span>
              </el-form-item>
            </el-col>
            <el-col :span="24" v-if="orderDetail.ticket.ticketExpressName!=undefined">
              <el-form-item label="物流厂家" >
                <span>{{orderDetail.ticket.ticketExpressName}}</span>
              </el-form-item>
            </el-col>
            <el-col :span="24" v-if="orderDetail.ticket.ticketExpressNo!=undefined">
              <el-form-item label="物流订单号" >
                <span>{{orderDetail.ticket.ticketExpressNo}}</span>
              </el-form-item>
            </el-col>
        </el-row>
      </el-form>
    </el-drawer>
  </div>

</template>
<script>
import resConf from '../../../../../resources.json'
import { shell } from 'electron';
import search from "@/components/pageTop/Search/Search";
import getDate from "~/utils/func/time";
import { formatDateTime} from '~/utils/utils';
import { getList, getListByStatus, getOrderDetail, submitTicketFlow } from "~/api/modal/paylist";
import { searchSn, getToken, getNowToken } from "~/api/login/loginDao";
import {getDicList} from "~/api/dict/dictDao";
export default {
  components: {
    search
  },
  data() {
    return {
      // 表单参数
      form: {},
      showForm: false,
      // 发票相关
      ticketModeOptions: [],
      ticketPropOptions: [],
      ticketEnterOptions: [],
      ticketApplyStateOptions: [],
      drawer: false,
      direction: 'rtl',
      orderDetail: {},
      payList: {
        activeList: "first",
        //0未支付1已支付
        data: [
          {
            id: "65674651465745",
            createTime: "165456454",
            price: 456,
            status: 1
            // title:"资产清点",
            // months:"资产清点"
          },
          {
            id: "8979879165",
            createTime: "654654986768",
            price: 456,
            status: 0
          }
        ],
        data2: [],
        data3: [],
      },
      // 表单校验
      rules: {
        ticketEnterprise: [
          { required: true, message: "开具类型不能为空", trigger: "blur" }
        ],
        ticketMode: [
          { required: true, message: "开票方式不能为空", trigger: "blur" }
        ],
        ticketProperties: [
          { required: true, message: "发票类型不能为空", trigger: "blur" }
        ],
        ticketTitle: [
          { required: true, message: "发票抬头不能为空", trigger: "blur" }
        ],
        ticketPhone: [
          { required: true, message: "联系电话不能为空", trigger: "blur" }
        ],
        ticketReceiver: [
          { required: true, message: "联系人不能为空", trigger: "blur" }
        ]
      }
    };
  },
  filters: {
    stationText: function(value) {
      let map = {
        0: "待支付",
        1: "已完成",
        2: "退款申请中",
        3: "已撤销",
        4: "失效"
      };
      return map[value];
    }
  },
  methods: {
    ptoYunMyOrder() {
      
    },
    openRefresh() {
        this.$alert('已经为您打开支付页面，请完成支付后点击确认支付', '支付确认', {
          confirmButtonText: '确认支付',
          callback: action => {
            this.getOrder();
          }
        });
    },
    payOrderGuid(orderData) {
      let _this = this;
      getNowToken().then(function(token) {
        let payurl = resConf.server.ip +"/clientpay/"+orderData.orderNo+"/"+orderData.buyPrice+"/"+orderData.packName+"/"+token;
        // console.info(payurl);
        shell.openExternal(payurl);
        _this.openRefresh();
      });
    },
    //支付订单tab页的点击事件
    handleClick(tab, event) {
      // console.log(tab, event);
    },
    // 详情
    getDetail(orderGuid) {
      let _this = this;
      _this.drawer = true;
      getNowToken().then(function(token) {
        getOrderDetail({Authorization: "Bearer " + token}, orderGuid).then(function(res){
          _this.orderDetail = res.data.data;
          _this.orderDetail.buyTime = formatDateTime(new Date(res.data.data.buyTime));
          let orderNo = res.data.data.orderNo;
          _this.orderDetail.orderNo= orderNo.substring(0,1)+ orderNo.substring(38)
        });
      });
    },
    getOrder() {
      let _this = this;
      getNowToken().then(function(token) {
        //全部订单
        getList({
          Authorization: "Bearer " + token
        }).then(function(result) {
          if (result.data.code != 200) {
              _this.getOrder();
          } else {
            result = result.data.data;
            _this.payList.data = result;
            // insertUserLabel(_this.reorderList[index].label_no, 1);
          }
        });
        //待支付
        getListByStatus({Authorization: "Bearer " + token},'0').then(function(result) {
            result = result.data.data;
            _this.payList.data2 = result;
            // insertUserLabel(_this.reorderList[index].label_no, 1);
        });
        //已支付
        getListByStatus({Authorization: "Bearer " + token},'1').then(function(result) {
            result = result.data.data;
            _this.payList.data3 = result;
            // insertUserLabel(_this.reorderList[index].label_no, 1);
        });
      });
    },
    ticketPropFormat(value) {
      return this.selectDictLabel(this.ticketPropOptions, value);
    },
    ticketApplyStateFormat(value) {
      return this.selectDictLabel(this.ticketApplyStateOptions, value);
    },
    // 回显数据字典
    selectDictLabel(datas, value) {
      var actions = [];
      Object.keys(datas).map((key) => {
        if (datas[key].dict_value == ('' + value)) {
          actions.push(datas[key].dict_label);
          return false;
        }
      })
      return actions.join('');
    },
    //展示开票信息面板
    showTicketForm(item) {
      const orderGuid = item.orderGuid;
      this.form.orderGuid = orderGuid;
      this.form.ticketAmount = item.buyPrice;
      this.showForm = true;
    },
    // 变更开局类型
    changeticketEnter() {
      if(this.form.ticketEnterprise=='1') {
        this.rules.ticketTaxParagraph = [{ required: true, message: "纳税人识别号不能为空", trigger: "blur" }];
      } else if(this.form.ticketEnterprise=='0') { 
        this.rules.ticketTaxParagraph = [];
      }
    },
    // 变更开票方式
    changeticketMode() {
      if(this.form.ticketMode=='0') {//纸质
        this.rules.ticketEmail = [];
        this.rules.ticketAddr = [{ required: true, message: "邮寄地址不能为空", trigger: "blur" }];
        this.rules.ticketReceiver = [{ required: true, message: "收件人不能为空", trigger: "blur" }];
      } else {//邮箱
        this.rules.ticketAddr = [];
        this.rules.ticketReceiver = [];
        this.rules.ticketEmail = [{ required: true, message: "邮箱地址不能为空", trigger: "blur" }];
      }
    },
    // 取消按钮
    cancel() {
      this.showForm = false;
      this.form.orderGuid = undefined;
    },
    /** 提交开票申请 */
    submitForm: function() {
      let _this = this;
      _this.$refs["form"].validate(valid => {
        // if (valid) {
          if (_this.form.orderGuid != undefined) {
            _this.$confirm('确定提交申请吗！', '', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning',
              callback: action => {
                _this.submitTicket();
              }
            });
          }
        // }
      });
    },
    submitTicket() {
      let _this = this;
      getNowToken().then(function(token) {
        submitTicketFlow({Authorization: "Bearer " + token}, _this.form).then(response => {
          if (response.data.code === 200) {
            _this.$message({
              showClose: true,
              message: '申请成功',
              type: 'success'
            });
            _this.cancel();
            _this.getOrder();
          } else {
            _this.$message({
              showClose: true,
              message: response.data.msg,
              type: 'error'
            });
          }
        });
      });
    }
  },
  computed: {
    changeTime(index) {
      return function(timeStamp) {
        var now = new Date(parseInt(timeStamp)),
          y = now.getFullYear(),
          m = now.getMonth() + 1,
          d = now.getDate();
        return (
          y +
          "年" +
          (m < 10 ? "0" + m : m) +
          "月" +
          (d < 10 ? "0" + d : d) +
          "日 " +
          now.toTimeString().substr(0, 8)
        );
      };
    }
  },
  mounted() {
    let _this = this;
    this.getOrder();
    getDicList("ticket_mode").then(res => {
      _this.ticketModeOptions = res;
    });
    getDicList("ticket_properties").then(res => {
      _this.ticketPropOptions = res;
    });
    getDicList("ticket_enterprise").then(res => {
      _this.ticketEnterOptions = res;
    });
    getDicList("order_ticketApply_state").then(res => {
      _this.ticketApplyStateOptions = res;
    });
  }
};
</script>
<style lang="scss">
.userInfo {
  .list {
    // height: 556px;
    // overflow: auto;

    .searchInput {
      position: absolute;
      right: 10px;
      top: 10px;
      width: 150px;
      text-align: right;
      line-height: 30px;
    }
    .el-tabs.el-tabs--top {
      & > .el-tabs__content {
        height: 500px;
        overflow: auto;
        padding: 20px;
        margin: 0 -10px 0 -20px;
      }
    }
    .el-tabs__content {
      overflow: auto;
    }
  }
}
.orderDetail {
  .el-drawer__body {overflow-y: scroll;}
  .el-form-item__content {text-align: left;}
}
.el-button--default {color: inherit;}
</style>