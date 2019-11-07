<template>
  <a-card :bordered="false">

    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="24">

          <a-col :md="10" :sm="12">
            <a-form-item label="创建时间" :labelCol="{span: 5}" :wrapperCol="{span: 18, offset: 1}">
              <j-date v-model="queryParam.createTime_begin" :showTime="true" date-format="YYYY-MM-DD HH:mm:ss" style="width:45%" placeholder="请选择开始时间" ></j-date>
              <span style="width: 10px;">~</span>
              <j-date v-model="queryParam.createTime_end" :showTime="true" date-format="YYYY-MM-DD HH:mm:ss" style="width:45%" placeholder="请选择结束时间"></j-date>
            </a-form-item>
          </a-col>

          <!--<a-col :md="8" :sm="8">-->
            <!--<a-form-item-->
              <!--:labelCol="labelCol"-->
              <!--:wrapperCol="wrapperCol"-->
              <!--label="开始时间">-->
              <!--<a-date-picker showTime format='YYYY-MM-DD HH:mm:ss' v-decorator="[ 'createTime', {}]" />-->
            <!--</a-form-item>-->
          <!--</a-col>-->
          <!--<a-col :md="8" :sm="8">-->
            <!--<a-form-item-->
              <!--:labelCol="labelCol"-->
              <!--:wrapperCol="wrapperCol"-->
              <!--label="结束时间">-->
              <!--<a-date-picker showTime format='YYYY-MM-DD HH:mm:ss' v-decorator="[ 'createTime', {}]" />-->
            <!--</a-form-item>-->
          <!--</a-col>-->
          <!--<a-col :md="6" :sm="8" >-->
            <!--<span style="float: left;overflow: hidden;" class="table-page-search-submitButtons">-->
              <!--<a-button type="primary" @click="searchQuery" icon="search">查询日志</a-button>-->
              <!--<a-button type="primary" @click="searchReset" icon="reload" style="margin-left: 8px">重置</a-button>-->
            <!--</span>-->
          <!--</a-col>-->
          <span style="float: left;overflow: hidden;" class="table-page-search-submitButtons">
            <a-col :md="6" :sm="24">
              <a-button type="primary" @click="searchQuery">查询</a-button>
              <a-button style="margin-left: 8px" @click="searchReset">重置</a-button>
            </a-col>
          </span>

        </a-row>
      </a-form>
    </div>

    <!-- 操作按钮区域 -->
    <div class="table-operator">
      <a-button type="primary" icon="download" @click="handleExportXls('日志')">导出</a-button>
    </div>

    <div>
      <a-table
        ref="table"
        size="middle"
        bordered
        rowKey="id"
        :columns="columns"
        :dataSource="dataSource"
        :pagination="ipagination"
        :loading="loading"
        :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
        @change="handleTableChange">

      </a-table>
    </div>
    <!-- table区域-end -->

    <!-- 表单区域 -->
    <user-modal ref="modalForm" @ok="modalFormOk"></user-modal>
  </a-card>
</template>

<script>
import LogModal from './modules/LogModal'
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import JDate from '@/components/jeecg/JDate'

export default {
  name: 'LogInfo',
  mixins: [JeecgListMixin],
  components: {
    LogModal,
    JDate
  },
  data () {
    return {
      //  description: '用户模块管理页面',
      // 表头
      columns: [
        {
          title: '时间',
          align: 'center',
          dataIndex: 'createTime'
        },
        {
          title: '日志内容',
          align: 'center',
          dataIndex: 'message'
        },
      ],
      url: {
        list: '/Component/log/showLogs',
        delete: '/Component/user/deleteUser',
        exportXlsUrl: "/Component/log/exportLogs",
      }
    }
  },
  computed: {
    // importExcelUrl: function () {
    //   return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`
    // }
  },
  methods: {

  }

}
</script>
<style scoped>
  /*@import '~@assets/less/common.less';*/
</style>
