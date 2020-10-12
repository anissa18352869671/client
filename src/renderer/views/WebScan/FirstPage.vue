<template lang="">
      <el-row  class="firstPage">
        <el-col
          :span="12"
          class="left"
        >
          <h1>智能网站扫描</h1>
          <h4>智能发现网站故障 迅速发送告警通知</h4>
          <el-button type="primary" @click="addTask">立即添加</el-button>
        </el-col>
        <el-col :span="12">
          <div class="grid-content bg-purple-light"></div>
        </el-col>

        <Add
        :_dialogVisible="dialogVisible"
        @dialogVisibleAdd="closeDialogVisible"
        ></Add>
      </el-row>
</template>
<script>
import Add from "./Modal/Add";
export default {
  data() {
    return { dialogVisible: false };
  },
  components: {
    Add,
  },
  methods: {
    addTask() {
      this.dialogVisible = true;
    },
    closeDialogVisible(data) {
      if (data == "add") {
        this.$router.push("/webscan/Table");
      } else {
        this.dialogVisible = false;
      }
    },
  },
};
</script>