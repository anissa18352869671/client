<template >
  <!-- 账户信息弹框 -->
  <el-dialog
    title="账户信息"
    class="userInfo"
    v-loading="loading"
    :visible.sync="visible"
    :before-close="modalClose"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
  >
    <!-- :visible.sync="dialogFormVisible" -->

    <div class="dialog-content">
      <el-tabs tab-position="left">
        <el-tab-pane label="账户信息">
          <div>
            <el-form
              ref="accountInfo"
              :model="accountInfo"
              label-width="80px"
            >
              <el-form-item
                label="头像"
                class="avatar-content"
              >
                <img
                  v-if="imageUrl"
                  :src="imageUrl"
                  class="avatar"
                >
                <div>
                  <el-upload
                    class="avatar-uploader"
                    action="https://jsonplaceholder.typicode.com/posts/"
                    :show-file-list="false"
                    :on-success="handleAvatarSuccess"
                    :before-upload="beforeAvatarUpload"
                  >
                    <span>点击上传头像</span>
                  </el-upload>
                  <p>支持JPG、PNG、GIF格式，小于2MB</p>
                </div>
              </el-form-item>
              <el-form-item label="账号">
                <!-- <el-input v-model="userInfo.id"></el-input> -->
                <div>{{accountInfo.id}}</div>
              </el-form-item>
              <el-form-item label="姓名">
                <el-input v-model="accountInfo.name"></el-input>
              </el-form-item>
              <el-form-item label="职务">
                <el-input v-model="accountInfo.position"></el-input>
              </el-form-item>
              <el-form-item>
                <el-button
                  type="primary"
                  @click="onSubmit"
                >保存</el-button>
                <el-button>取消</el-button>
              </el-form-item>
            </el-form>
          </div>
        </el-tab-pane>
        <el-tab-pane label="公司信息">
          <div>
            <el-form
              ref="companyInfo"
              :model="companyInfo"
              label-width="80px"
            >
              <el-form-item label="公司名称">
                <el-input v-model="companyInfo.name"></el-input>
              </el-form-item>
              <el-form-item
                label="公司标签"
                class="tags"
              >
                <div class="tags-container">
                  <span
                    v-for="(item,index) in companyInfo.tags"
                    :key="index"
                  >{{item}}</span>
                </div>
                <!-- <el-input v-model="userInfo.position"></el-input> -->
              </el-form-item>
              <el-form-item
                label="公司地址"
                class="address"
              >
                <el-select
                  v-model="companyInfo.address.province"
                  placeholder="--省--"
                  @change="clearAdd"
                >
                  <el-option
                    v-for="item in province"
                    :key="item"
                    :label="item"
                    :value="item"
                  ></el-option>
                </el-select>
                <!--
                -->
                <el-select
                  v-model="companyInfo.address.city"
                  placeholder="--市--"
                >
                  <el-option
                    v-for="item in city[companyInfo.address.province]"
                    :key="item"
                    :label="item"
                    :value="item"
                  ></el-option>
                </el-select>
                <el-input
                  type="textarea"
                  :autosize="{ minRows: 3, maxRows: 3}"
                  placeholder="请输入内容"
                  v-model="companyInfo.address.detail"
                >
                </el-input>
              </el-form-item>

              <el-form-item>
                <el-button
                  type="primary"
                  @click="onSubmit"
                >保存</el-button>
                <el-button>取消</el-button>
              </el-form-item>
            </el-form>
          </div>
        </el-tab-pane>
        <el-tab-pane label="修改密码">
          <div>
            <el-form
              :model="passwordChange"
              status-icon
              :rules="rules"
              ref="passwordChange"
              label-width="100px"
            >
              <el-form-item
                label="原密码"
                prop="oldpassword"
              >
                <el-input
                  type="password"
                  v-model="passwordChange.oldpassword"
                  autocomplete="off"
                  placeholder="请输入原密码"
                ></el-input>
              </el-form-item>
              <el-form-item
                label="新密码"
                prop="newpassword"
              >
                <el-input
                  type="password"
                  v-model="passwordChange.newpassword"
                  autocomplete="off"
                  placeholder="请输入6～20位密码"
                ></el-input>
              </el-form-item>
              <el-form-item
                label="确认新密码"
                prop="repassword"
              >
                <el-input
                  type="password"
                  v-model="passwordChange.repassword"
                  autocomplete="off"
                  placeholder="再次输入密码"
                ></el-input>
              </el-form-item>

              <el-form-item>
                <el-button
                  type="primary"
                  @click="onSubmit()"
                >保存</el-button>
                <el-button>取消</el-button>
              </el-form-item>
            </el-form>
          </div>
        </el-tab-pane>
      </el-tabs>

    </div>
  </el-dialog>
</template>
<script>
const electron = require("electron");
const remote = electron.remote;
import { ipcRenderer } from "electron";
import axios from "axios";
export default {
  name: "dialogH",
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },

  data() {
    var validatePass = (rule, value, callback) => {
      var reg = /^\w{6,20}$/i;
      var isValid = reg.test(value);
      if (value === "") {
        callback(new Error("请输入密码"));
      } else if (!isValid) {
        callback(new Error("请输入6-20位密码"));
      } else {
        if (this.passwordChange.repassword !== "") {
          this.$refs.passwordChange.validateField("repassword");
        }
        callback();
      }
    };
    var validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.passwordChange.newpassword) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    return {
      loading: false,
      imageUrl:
        "https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png",
      accountInfo: {
        avatar: "",
        id: "25689452654",
        name: "核桃君",
        position: "研发部/研发部/视觉设计师"
      },
      companyInfo: {
        name: "核桃君",
        tags: [
          "人工智能",
          "网络安全",
          "大数据",
          "执法",
          "数据清洗",
          "Windows ",
          "企业服务",
          "360",
          "数据服务"
        ],
        address: {
          province: "江苏省",
          city: "南京",
          detail: "玄武区XXX路168号江苏软件园23栋"
        }
      },
      passwordChange: {
        oldpassword: "",
        newpassword: "",
        repassword: ""
      },
      province: [
        "北京省",
        "天津省",
        "上海省",
        "重庆省",
        "河北省",
        "山西省",
        "辽宁省",
        "吉林省",
        "黑龙江省",
        "江苏省",
        "浙江省",
        "安徽省",
        "福建省",
        "江西省",
        "山东省",
        "河南省",
        "湖北省",
        "湖南省",
        "广东省",
        "海南省",
        "四川省",
        "贵州省",
        "云南省",
        "陕西省",
        "甘肃省",
        "青海省",
        "台湾省",
        "内蒙古自治区",
        "广西壮族自治区",
        "西藏自治区",
        "宁夏回族自治区",
        "新疆维吾尔自治区",
        "香港特别行政区",
        "澳门特别行政区"
      ],
      city: [],
      rules: {
        oldpassword: [{ validator: validatePass, trigger: "blur" }],
        newpassword: [{ validator: validatePass, trigger: "blur" }],
        repassword: [{ validator: validatePass2, trigger: "blur" }]
      },
      userInfo: {
        name: "",
        region: "",
        date1: "",
        date2: "",
        delivery: false,
        type: [],
        resource: "",
        desc: ""
      }
    };
  },

  methods: {
    onSubmit() {
      console.log("submit!");
    },
    //弹框关闭事件
    modalClose() {
      this.$emit("update:visible", false); // 直接修改父组件的属性
    },

    handleAvatarSuccess(res, file) {
      this.imageUrl = URL.createObjectURL(file.raw);
    },
    // 上传头像格式控制
    beforeAvatarUpload(file) {
      const isJPG =
        file.type === "image/jpeg" ||
        file.type === "image/png" ||
        file.type === "image/gif";
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
    },

    // 省市选择后清除默认地址
    clearAdd() {
      this.companyInfo.address.city = "";
      this.companyInfo.address.detail = "";
    }
  },
  created() {
    // 获取省市级联数据
    axios.get("static/json/map.json").then(response => {
      this.city = response.data;
    });
  }
};
</script>
