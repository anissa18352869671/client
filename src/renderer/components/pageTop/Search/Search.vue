<template lang="">
    <div
          :class="inputFocus?'focus':''"
          class="searchInput"
        >
          <i id="searchIcon" class="el-icon-search searchIcon" @click="searchInfo"><span>{{search | searchText}}</span></i>
          <i
            class="el-icon-error"
            id="el-icon-error"
            @click="delInput"
          ></i>
          <el-input
            id="search"
            v-model="search"
            placeholder=""
            prefix-icon=''           
          ></el-input>
           
    </div>
</template>
<script>
export default {
  name: "search",
  props: { inputFocus1: String },
  data() {
    return {
      search: "",
      inputFocus: false
    };
  },
  methods: {
    delInput() {
      this.search = "";
      this.reset();
    },
    searchInfo() {
      this.$emit("data", this.search);
    },
    reset() {
      this.$emit("reset", "chongzhi");
    }
  },
  filters: {
    searchText(text) {
      return text ? text : "搜索";
    }
  },
  watch: {
    search: function(val) {
      this.$emit("search", val);
    }
  },
  created() {
    let that = this;
    var a = false;
    document.onkeypress = function(e) {
      var keycode = document.all ? event.keyCode : e.which;
      if (keycode == 13) {
        that.searchInfo();
      }
    };
  },
  mounted() {
    this.inputFocus = this.inputFocus1;
    document.addEventListener("click", e => {
      if (
        e.target.id == "search" ||
        e.target.id == "el-icon-error" ||
        e.target.id == "searchIcon"
      ) {
        this.inputFocus = true;
      } else {
        this.search = "";
        this.inputFocus = false;
      }
    });
  }
};
</script>