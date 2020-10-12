<template >
  <div>
    <!-- 账户信息弹框 -->
    <el-dialog
      title="添加网站"
      :visible.sync="dialogVisible"
      :before-close="show"
      :modal="is_modal"
      width="60%"
      class="addWeb"
      router
    >
      <el-form
        class="loginBox"
        :model="addForm"
        :rules="rules"
        ref="addForm"
      >
        <div>
          <el-form-item
            label="网站编号"
            prop="website_code"
            class="input-group"
          >
            <el-input
              v-model="addForm.website_code"
              placeholder="请输入网站编号"
            ></el-input>
          </el-form-item>
          <el-form-item
            label="网站名称"
            prop="website_name"
            class="input-group"
          >
            <el-input
              v-model="addForm.website_name"
              placeholder="请输入网站名称"
            ></el-input>
          </el-form-item>

          <el-form-item
            label="网站类型"
            prop="website_type"
            class="input-group"
          >
            <el-select
              v-model="addForm.website_type"
              placeholder="请选择网站类型"
            >
              <el-option
                label="非备案网站"
                value="0"
              ></el-option>
              <el-option
                label="备案网站"
                value="1"
              ></el-option>
            </el-select>
          </el-form-item>

          <el-form-item
            label="网站地址"
            prop="website_url"
            class="input-group website_url"
          >
            <el-input
              placeholder="请输入网站地址"
              v-model="addForm.website_url"
              class="input-with-select"
            >
              <el-select
                v-model="addForm.select"
                slot="prepend"
                placeholder=""
                width="60"
              >
                <el-option
                  label="http://"
                  value="http://"
                ></el-option>
                <el-option
                  label="https://"
                  value="https://"
                ></el-option>
              </el-select>
            </el-input>
          </el-form-item>

          <el-form-item
            label="网站IP"
            prop="website_name"
            class="input-group"
          >
            <el-input
              v-model="addForm.website_ip"
              placeholder="请输入网站IP"
            ></el-input>
          </el-form-item>

          <el-form-item
            label="工信部ICP备案号"
            prop="website_name"
            class="input-group"
          >
            <el-input
              v-model="addForm.website_icp"
              placeholder="请输入工信部ICP备案号"
            ></el-input>
          </el-form-item>

          <el-form-item
            label="公案备案号"
            prop="website_name"
            class="input-group"
          >
            <el-input
              v-model="addForm.website_policecode"
              placeholder="请输入公案备案号"
            ></el-input>
          </el-form-item>

          <el-form-item
            label="备案等级"
            prop="website_name"
            class="input-group"
          >
            <el-input
              v-model="addForm.website_level"
              placeholder="请输入备案等级"
            ></el-input>
          </el-form-item>

          <el-form-item
            label="网站描述"
            prop="website_describe"
            class="input-group"
          >
            <el-input
              placeholder="请输入网站描述"
              type="textarea"
              v-model="addForm.website_describe"
            ></el-input>
          </el-form-item>

          <div class="input-group">
            <label> </label>
            <div>
              <el-button
                type="primary"
                @click="submitForm('addForm')"
              >立即添加</el-button>
              <el-button @click="show">取 消</el-button>
            </div>
          </div>
        </div>
      </el-form>
    </el-dialog>
    <el-dialog
      title="用户协议"
      width="58%"
      :visible.sync="dialogTableVisible"
      class="addAuthorize"
    >
      <div
        class="authorizeContent"
        v-html="authorizeContent"
      >
        <!-- 本授权协议（以下简称“本协议”）是瑞云安全平台与用户（以下或称为“您”）所订立的有效合约。<br>
        您通过网络页面点击确认接受本协议，即表示您同意接受本协议的全部约定内容。<br>
        您应认真阅读、充分理解本规则各条款，特别是其中与您的权益有或可能具有重大关系的条款，如您不同意接受本协议的任意内容
        ，或者无法准确理解相关条款含义的，请不要进行后续操作。<br>
        您同意，平台有权随时对本协议内容进行单方面的变更，并在平台网站页面通知您。<br>
        若您在本协议内容变更生效后继续使用本服务的，表示您已充分阅读、理解并接受变更修改后的协议内容，
        也将遵循变更修改后的协议内容；若您不同意变更修改后的协议内容，您应立即停止使用本服务。<br>
        双方在履行本协议的过程中，如发生争议，应协商解决。协商不成的，任何一方均可向本协议签订地有管辖权的人民法院提起诉讼。 -->

      </div>
      <div class="footer">
        <el-button
          type="primary"
          @click="confirm"
          class="confirm"
          :disabled="showCount"
        >同意协议 {{showCountdown}}</el-button>
      </div>

    </el-dialog>
  </div>
</template>
<script>
import { getDate } from "~/utils/func/time";
import { GUID } from "~/utils/guid";
import { searchSn } from "~/api/login/loginDao";
import { saveWebscan } from "~/api/web/webScanDao";
import {
  saveWebsite,
  getWebsiteBy,
  getWebsiteByUrl,
} from "~/api/web/webSiteDao";
import { saveTask } from "~/api/tasks/taskDao";
import { getByName } from "~/api/config/configDao";
import { getToolByToolNo } from "~/api/setting/settingDao";
import { saveTaskTools } from "~/api/tasks/taskToolsDao";
import { sendMq } from "~/api/web/webApi";
import resources from "../../../../../resources.json";

export default {
  name: "dialogH",
  inject: ["reload"],
  props: {
    _dialogVisible: {
      type: Boolean,
    },
  },
  components: {},
  data() {
    var validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入内容"));
      } else {
        callback();
      }
    };
    return {
      dialogVisible: this._dialogVisible,
      addForm: {
        website_code: "",
        website_name: "",
        website_type: "",
        select: "http://",
        website_url: "",
        website_ip: "",
        website_icp: "",
        website_policecode: "",
        website_level: "",
        website_describe: "",
        user_id: "",
      },
      countdown: 5,
      timer: null,
      showCount: true,
      dialogTableVisible: false,
      rules: {
        website_code: [{ validator: validatePass, trigger: "blur" }],
        website_name: [{ validator: validatePass, trigger: "blur" }],
        website_type: [{ validator: validatePass, trigger: "change" }],
        website_url: [{ validator: validatePass, trigger: "blur" }],
        website_ip: [{ validator: validatePass, trigger: "blur" }],
        website_icp: [{ validator: validatePass, trigger: "blur" }],
        website_policecode: [{ validator: validatePass, trigger: "blur" }],
        website_level: [{ validator: validatePass, trigger: "blur" }],
        website_describe: [{ validator: validatePass, trigger: "blur" }],
      },
      authorizeContent: "",
      is_modal: false,
    };
  },
  methods: {
    show() {
      let _this = this;
      _this.addForm = { select: "http://" };
      this.dialogVisible = false;
      _this.$emit("dialogVisibleAdd", false);
    },
    sendCode() {
      //启动定时器
      this.timer = setInterval(() => {
        //创建定时器
        if (this.countdown === 0) {
          this.showCount = false;
          this.clearTimer(); //关闭定时器
        } else {
          this.loading();
        }
      }, 1000);
    },
    loading() {
      //启动定时器
      this.countdown--; //定时器减1
    },
    clearTimer() {
      //清除定时器
      clearInterval(this.timer);
      this.timer = null;
    },
    add() {
      this.showCount = true;
      this.dialogTableVisible = true;
      this.sendCode();
    },
    submitForm(formName) {
      let _this = this;
      let data = this.addForm.select + this.addForm.website_url;
      getWebsiteByUrl(data).then((res) => {
        if (res.length > 0) {
          this.$message({
            message: "当前网站已添加",
            type: "warning",
            customClass: "add",
          });
        } else {
          this.$refs[formName].validate((valid) => {
            if (valid) {
              this.add();
            } else {
              console.log("error submit!!");
              return false;
            }
          });
        }
      });
    },
    confirm() {
      let data = {};
      let data1 = {};
      let _this = this;
      this.addForm.bill_guid = new GUID().newGUID();
      //状态改为待审核
      this.addForm.status = 1;
      data.website = this.addForm;
      data.website.website_url = data.website.select + data.website.website_url;
      delete data.website.select;
      var time = getDate(new Date().getTime(), "-", 8);

      let _task_guid = new GUID().newGUID();

      //新建任务
      var task = {
        create_time: new Date().getTime(),
        task_guid: _task_guid,
        // task_name: "网站监测" + time,
        //2未运行,3为运行中，4为完成,5为检测中，6为审核中
        status: 6,
        task_type: 0,
      };

      //新增自查任务与工具的关联
      var guid2 = new GUID();
      var taskTools = {
        task_tools_guid: guid2.newGUID(),
        task_guid: _task_guid,
        start_time: new Date().getTime(),
        tools_no: "",
        tools_type_no: "",
        // 1: "未运行",
        // 2: "运行中",
        // 3: "已完成"
        status: 2,
      };

      getToolByToolNo(resources.tools.webScan).then((res) => {
        res = res[0];
        taskTools.tools_no = res.tools_no;
        taskTools.tools_name = res.tools_name;
        taskTools.tools_type_no = res.tools_type_no;
        //任务名
        task.task_name = res.tools_name + time;
        saveTask(task, function () {});
        saveTaskTools(taskTools, function () {});
      });

      // getAllToolsBy(_this.title).then(res => {
      //   res = res[0];
      //   taskTools.tools_no = res.tools_no;
      //   taskTools.tools_type_no = res.tools_type_no;
      //   saveTaskTools(taskTools, function() {});
      // });

      data1.taskId = _task_guid;
      data1.user_id = data.website.user_id;
      data1.url = data.website.website_url;
      data1.desc = "网站监测" + time;
      //网站的唯一主键
      data1.website_guid = this.addForm.bill_guid;
      data1.bill_guid = _task_guid;
      data1.create_time = new Date();
      saveWebscan(data1, function () {});

      let _website = data.website;
      _website.create_time = new Date();

      saveWebsite(_website, function () {
        getWebsiteBy().then((res) => {
          if (res.length > 0) {
            _this.$emit("dialogVisibleAdd", "add");
          } else {
            _this.$emit("dialogVisibleAdd", false);
          }
        });
      });
      _this.send(data, _task_guid, time);
      this.dialogVisible = false;
      this.dialogTableVisible = false;
    },
    send(data, _task_guid, time) {
      let data2 = {};
      data2 = data;
      data2.website.webscan = {
        taskId: _task_guid,
        user_id: data.website.user_id,
        url: data.website.website_url,
        desc: "网站监测" + time,
      };

      sendMq(data2);
    },
    getAuthorizeContent() {
      let _this = this;
      getByName(resources.authorization.webScan).then((res) => {
        res = res[0];
        _this.authorizeContent = res.config_value;
      });
    },
  },
  computed: {
    showCountdown() {
      if (this.countdown == 0) {
        return "";
      } else {
        return "(" + this.countdown + ")";
      }
    },
  },
  mounted() {
    let _this = this;
    searchSn().then((res) => {
      _this.addForm.user_id = res[0].userid;
    });
    _this.getAuthorizeContent();
  },
  watch: {
    _dialogVisible(newValue, oldValue) {
      this.dialogVisible = newValue;
    },
  },
};
</script>
