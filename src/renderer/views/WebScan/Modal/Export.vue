<template >
  <div>
    <!-- 账户信息弹框 -->
    <el-dialog
      title="输出文件"
      :visible.sync="dialogVisible"
      :before-close="show"
      width="60%"
      class="addWeb"
      router
    >
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="180px"
        class="demo-ruleForm"
      >
        <el-form-item
          label="导出范围"
          prop="type"
        >
          <el-checkbox-group v-model="ruleForm.type">
            <el-checkbox
              label="紧急漏洞"
              value="high"
              name="type"
            ></el-checkbox>
            <el-checkbox
              label="高危漏洞"
              value="middle"
              name="type"
            ></el-checkbox>
            <el-checkbox
              label="中危漏洞"
              value="low"
              name="type"
            ></el-checkbox>
            <el-checkbox
              label="低危漏洞"
              value="info"
              name="type"
            ></el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item
          label="输出格式"
          prop="export"
        >
          <el-select
            v-model="ruleForm.export"
            placeholder="请选择输出格式"
          >
            <el-option
              label="DOC"
              value="shanghai"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item
          label="保存到"
          prop="name"
        >
        
          <el-input :disabled="true" ref='exportPath' v-model="ruleForm.name" style="float:left;width:auto"></el-input>
          <el-button style="float:left"  @click="pickDir" >选择位置</el-button>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            @click="submitForm('ruleForm')"
          >输出</el-button>
          <el-button @click="show">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    
  </div>
</template>
<script>
import { getDate } from "~/utils/func/time";
import { GUID } from "~/utils/guid";
import { getNowToken } from "~/api/login/loginDao";
import { getWordReport } from "~/api/web/webApi";
import {ipcRenderer} from 'electron'
export default {
  name: "dialogH",
  props: {
    _dialogExport: {
      type: Boolean,
    },
    _taskId: {
      type: String,
    },
  },
  components: {},
  data() {
    var validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入"));
      } else {
        callback();
      }
    };
    var validatePassCheck = (rule, value, callback) => {
      if (value.length == 0) {
        callback(new Error("请选择范围"));
      } else {
        callback();
      }
    };
    var validatePassExport = (rule, value, callback) => {
      if (value.length == 0) {
        callback(new Error("请选择输出格式"));
      } else {
        callback();
      }
    };
    return {
      dialogVisible: this._dialogExport,
      ruleForm: {
        name: "",
        type: [],
        export: "DOC",
      },
      rules: {
        name: [{ validator: validatePass, trigger: "change" }],
        export: [{ validator: validatePassExport, trigger: "change" }],
        type: [
          { validator: validatePassCheck, trigger: "change", type: "array" },
        ],
      },
      taskId: this._taskId,
    };
  },
  filters: {
    stationWord: function (value) {
      let map = {
        high: "紧急漏洞",
        middle: "高危漏洞",
        low: "中危漏洞",
        info: "低危漏洞",
      };
      return map[value];
    },
  },
  methods: {
    pickDir() {
      ipcRenderer.send('openDirectoryDialog', 'openDirectory');
      ipcRenderer.on('selectedDirItem', this.getPath);
    },
    getPath:function(e,path){
      if(path==null){
        alert('请选择一个文件夹')
      } else {
        this.$refs.exportPath.blur();
        this.ruleForm.name=path;
        this.$refs.exportPath.blur();
      }
    },
    show() {
      this.dialogVisible = false;
      this.$emit("dialogVisible", false);
    },
    changeLevel(arr) {
      let type = arr.type;
      for (let i = 0; i < type.length; i++) {
        let j;
        switch (type[i]) {
          case "紧急漏洞":
            j = "high";
            break;
          case "高危漏洞":
            j = "medium";
            break;
          case "中危漏洞":
            j = "low";
            break;
          default:
            j = "info";
        }
        type[i] = j;
      }
      return arr;
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.getReport(this.changeLevel(this.ruleForm).type, this.ruleForm.name);
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    getReport(data, path) {
      let _this = this;
      getNowToken().then(function (token) {
        let report = {
          report: Array.from(new Set(data)).toString(),
        };
        getWordReport(
          { Authorization: "Bearer " + token },
          _this._taskId,
          report,
          path
        ).then(res=>{
          if(res==null) {
            _this.show();
          } else {
            alert(res);
          }
          
        });
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
  },
  computed: {},
  mounted() {
    let _this = this;
    // searchSn().then((res) => {
    //   //   _this.addForm.user_id = res[0].id;
    // });
  },
  watch: {
    _dialogExport(newValue, oldValue) {
      this.dialogVisible = newValue;
    },
  },
};
</script>
