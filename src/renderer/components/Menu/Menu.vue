<template lang="">
    <el-menu
        router
        :default-active="active"
         class="menu"
      >
      <div :class="online" >
        <i class="iconfont icon-duankailianjie"></i>
        <span>连接断开</span>
      </div>
         
        <template v-for="(item,i) in items">
           <el-tooltip
            class="item"
            :content="item.name"
            placement="right"
            effect="light"

          >
          
           <el-menu-item
            :index="item.index"
            :key="i"
            style="width:53px;padding:0;"
          >
          <!-- <i class="iconfont" :class="item.img"></i> -->
            <el-image :src="item.img" ></el-image>
          </el-menu-item>
          </el-tooltip> 
          
        </template>
      </el-menu>
</template>
<script>
export default {
  props: { active: String },
  data: () => ({
    items: [
      {
        name: "任务中心",
        index: "/tasks",
        img: "static/img/tasks/tasks.png"
      },
      {
        name: "资讯中心",
        index: "/news",
        img: "static/img/tasks/news.png"
      },
      {
        name: "通知中心",
        index: "/inform",
        img: "static/img/tasks/informs.png"
      },
      {
        name: "工具中心",
        index: "/settings",
        img: "static/img/tasks/set.png"
      }
    ],
    online: ""
  }),
  methods: {},
  mounted: function() {
    const alertOnlineStatus = () => {
      if (!navigator.onLine) {
        this.online = "offline";
      } else {
        this.online = "online";
      }
    };

    window.addEventListener("online", alertOnlineStatus);
    window.addEventListener("offline", alertOnlineStatus);

    alertOnlineStatus();
  }
};
</script>