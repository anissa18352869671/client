<template>
  <div class="pageTop">

    <el-row
      class="row-bg"
      align="middle"
      justify="end"
    >
      <el-col :span="18">
        <el-menu
          class="tabMenu"
          mode="horizontal"
          @select="handleSelect"
          :default-active="activeIndex.toString()"
        >
          <el-menu-item
            v-for="(item, index) in data"
            :key="index"
            :index="index.toString()"
            :id="index"
            type="flex"
            align='middle'
          >
            <div>{{item.title}}</div>
          </el-menu-item>
        </el-menu>
      </el-col>
      <!-- <el-col
        class=""
        :span="6"
        v-if=""
      >
        2222
      </el-col> -->
      <el-col
        class="searchInput"
        :span="6"
      >
        <search
          @data="getSearch($event)"
          :word="find"
        ></search>

      </el-col>

    </el-row>
  </div>
</template>

<script>
import search from "@/components/pageTop/Search/Search";
export default {
  name: "pageTop",
  props: {
    data: {
      type: Array
    },
    checkMenu: {
      type: String,
      default: "0"
    }
  },
  components: {
    search
  },
  data() {
    return {
      find: "搜索",
      activeIndex: ""
      // search: "",
      // inputFocus: false
    };
  },
  methods: {
    getpath() {
      console.log(this.$route.path);
    },
    handleSelect(key, keyPath, index) {
      // 监听点击事件，通过changeIndex，将key传给父组件
      this.$emit("changeIndex", key);
    },
    getSearch(data) {
      let _this = this;
      this.$emit("data", data);
    },
    getProductList() {
      this.activeIndex = this.checkMenu;
    }
  },
  watch: {
    checkMenu: {
      handler: function(val, oldval) {
        if (val != oldval) {
          this.$nextTick(() => {
            this.getProductList();
          });
        }
      },
      immediate: true, //关键
      deep: true
    }
  },
  mounted() {
    this.$store.commit("edit", "");
    this.activeIndex = this.checkMenu;
  }
};
</script>