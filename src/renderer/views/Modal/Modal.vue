<template >
  <!-- 账户信息弹框 -->
  <div class="userInfo">
    <eHeader :title="title"></eHeader>
    <!-- :visible.sync="dialogFormVisible" -->
    <div class="dialog-content nodrag">
      <el-tabs
        tab-position="left"
        v-model="activeName"
      >
        <el-tab-pane
          label="账户信息"
          name="one"
        >
          <AccountInfo>
          </AccountInfo>
        </el-tab-pane>
        <!-- <el-tab-pane
          label="公司信息"
          name="two"
        >
          <comInfo>
          </comInfo>
        </el-tab-pane> -->
        <el-tab-pane
          label="公司订单"
          name="three"
        >
          <Paylist class="list">

          </Paylist>
        </el-tab-pane>
      </el-tabs>

    </div>
  </div>
</template>
<script>
import eHeader from "./Header/Header";
import TagsList from "./Tags/TagsList";
import comInfo from "./Modal/ComInfo";
import AccountInfo from "./Modal/AccountInfo";
import Paylist from "./Modal/Paylist";

export default {
  name: "dialogH",
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  components: {
    eHeader,
    TagsList,
    comInfo,
    AccountInfo,
    Paylist
  },
  data() {
    return {
      activeName: "one",
      userInfo: {
        name: "",
        region: "",
        date1: "",
        date2: "",
        delivery: false,
        type: [],
        resource: "",
        desc: ""
      },
      title: "账户信息"
    };
  },
  methods: {
    
  },
  computed: {},
  mounted() {
    // this.sort();
  },
  watch: {}
};
</script>
