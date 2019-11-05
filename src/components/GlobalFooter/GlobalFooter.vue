<template>
  <div class="footer">
    <div class="links">
      <!--<a-->
        <!--href="https://pro.loacg.com/"-->
        <!--target="_blank"-->
      <!--&gt;Pro 首页</a>-->
      <!--<a-->
        <!--href="https://github.com/sendya/ant-design-pro-vue"-->
        <!--target="_blank"-->
      <!--&gt;-->
        <!--<a-icon type="github" />-->
      <!--</a>-->
      <a href="https://ant.design/">组件库管理系统</a>
      <!--<a href="https://vue.ant.design/">Vue Antd</a>-->
    </div>
    <div class="copyright">
      Copyright
      <a-icon type="copyright" /> 2019 <span>服务计算实验室</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'GlobalFooter',
  data () {
    return {}
  }
}
</script>

<style lang="less" scoped>
.footer {
  padding: 0 16px;
  margin: 48px 0 24px;
  text-align: center;

  .links {
    margin-bottom: 8px;

    a {
      color: rgba(0, 0, 0, 0.45);

      &:hover {
        color: rgba(0, 0, 0, 0.65);
      }

      &:not(:last-child) {
        margin-right: 40px;
      }
    }
  }
  .copyright {
    color: rgba(0, 0, 0, 0.45);
    font-size: 14px;
  }
}
</style>
