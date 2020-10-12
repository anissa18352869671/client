<template>
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
        <template v-for="(item,index) in getCompany">
          <span
            :key="index"
            v-if="item.checked==1"
          >{{item.value}}

          </span>
        </template>
      </div>
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
  </el-form>
</template>
<script>
import axios from "axios";
export default {
  data() {
    return {
      companyInfo: {
        name: "",
        reorderList: [],
        address: {
          province: "江苏省",
          city: "南京",
          detail: "玄武区XXX路168号江苏软件园23栋"
        },
        activeClass: "letter",
        value: "value",
        checked: "checked"
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
      city: []
    };
  },
  methods: {
    // 省市选择后清除默认地址
    clearAdd() {
      this.companyInfo.address.city = "";
      this.companyInfo.address.detail = "";
    },
    onSubmit() {
      console.log("submit!");
    }
  },
  created() {
    // 获取省市级联数据
    axios.get("static/json/map.json").then(response => {
      this.city = response.data;
    });
  },
  computed: {
    getCompany() {
      let arr = [];
      for (const key in this.companyInfo.tags) {
        if (this.companyInfo.tags[key].checked == 1) {
          arr.push(this.companyInfo.tags[key]);
        }
      }
      return arr;
    }
  }
};
</script>