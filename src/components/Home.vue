<template>
  <el-container class="home_container">
    <!-- 头部 -->
    <el-header>
      <div>
        <img
          src="../assets/header.jpeg"
          alt=""
        >
        <span>电商后台管理系统</span>
      </div>
      <el-button
        type="info"
        @click="loginout"
      >退出</el-button>
    </el-header>
    <el-container>
      <!-- 侧边栏 -->
      <el-aside :width="isCollapse?'60px':'200px'">
        <div class="toggle" @click='toggleLIst'> ||| </div>
        <el-menu
          :default-active='activeIndex'
          class="el-menu-vertical-demo"
          background-color="#333744"
          text-color="#fff"
          active-text-color="#4094ee"
          :unique-opened= true
          :router= true
          :collapse="isCollapse"
          :collapse-transition = false
        >
          <el-submenu :index="item.id + ''" :key="item.id" v-for="item in menuList">
            <template slot="title" >
              <i :class="iconfont[item.id]" style="margin-right:10px"></i>
              <span>{{item.authName}}</span>
            </template>
              <!-- "'/' + subItem.path" 即可以把subItem.path转化为字符串(否则为变量),又可以保证路径完整 -->
              <el-menu-item @click="setActiveIndex('/' + subItem.path)" :index="'/' + subItem.path" :key="subItem.id" v-for="subItem in item.children">
                <i class="el-icon-menu"></i>
                <span>{{subItem.authName}}</span>
              </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 内容 -->
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>

</template>

<script>
export default {
  data() {
    return {
      menuList: [],
      isCollapse: false,
      activeIndex: '',
      iconfont: {
        '125': 'iconfont icon-users',
        '103': 'iconfont icon-tijikongjian',
        '101': 'iconfont icon-shangpin',
        '102': 'iconfont icon-danju',
        '145': 'iconfont icon-baobiao'
      }
    };
  },

  methods: {
    loginout() {
      this.$router.push("/login");
      sessionStorage.removeItem("token");
      sessionStorage.removeItem("activeIndex");

    },
    async getMenuList() {
      var res = await this.axios.get('menus')
      // console.log(res);
      this.menuList = res.data
      console.log(this.menuList); 
    },
    toggleLIst() {
      this.isCollapse = !this.isCollapse
    },
    setActiveIndex(index) {
      // index 为当前页面的路径
      this.activeIndex = index
      // 将对应的index存储到本地存储中 这样刷新页面时能够得到
      sessionStorage.setItem('activeIndex',index)
    }
  },

  created() {
    this.getMenuList()
    // 提取activeIndex
    var index = sessionStorage.getItem('activeIndex')
    this.activeIndex = index
  }
};
</script>

<style lang='less' scoped>
.home_container {
  height: 100%;

  .el-header {
    background-color: #373d41;
    display: flex;
    justify-content: space-between;
    padding: 10px 20px;

    div {
      display: flex;
      align-items: center;

      img {
        width: 50px;
        height: 50px;
        border-radius: 50%;
      }

      span {
        color: #fff;
        font-size: 20px;
        margin-left: 15px;
      }
    }
  }

  .el-aside {
    background-color: #333744;

    .toggle {
      color: #fff;
      font-size: 14px;
      background-color: #4a5064;
      text-align: center;
      height: 25px;
      line-height: 25px;
    }

    .el-menu {
      border-right: 0;
    }
  }

  .el-mian {
    background-color: #eaedf1;
  }
}
</style>
