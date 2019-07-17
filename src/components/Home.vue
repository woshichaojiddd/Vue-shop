<template>
  <div>
    首页
    <el-button type="info" @click="loginout">退出</el-button>
  </div>
</template>

<script>
export default {

  data () {
    return {
    }
  },

  methods: {
      loginout() {
          this.$router.push('/login')
          sessionStorage.removeItem('token')
      }
  },

  created () {
  }
}
</script>

<style lang='less' scoped>

</style>
