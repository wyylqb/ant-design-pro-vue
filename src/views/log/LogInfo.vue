<template>
  <a-card :bordered="false">

    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="24">

          <a-col :md="10" :sm="12">
            <a-form-item label="创建时间" :labelCol="{span: 5}" :wrapperCol="{span: 18, offset: 1}">
              <j-date v-model="queryParam.dateTime1" :showTime="true" date-format="YYYY-MM-DD" style="width:45%" placeholder="请选择开始时间" ></j-date>
              <span style="width: 10px;">~</span>
              <j-date v-model="queryParam.dateTime2" :showTime="true" date-format="YYYY-MM-DD" style="width:45%" placeholder="请选择结束时间"></j-date>
            </a-form-item>
          </a-col>


          <span style="float: left;overflow: hidden;" class="table-page-search-submitButtons">
            <a-col :md="6" :sm="24">
              <a-button type="primary" @click="handleQueryByTime">查询</a-button>
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

  </a-card>
</template>

<script>
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import JDate from '@/components/jeecg/JDate'

export default {
  name: 'LogInfo',
  mixins: [JeecgListMixin],
  components: {
  //  LogModal,
    JDate
  },
  data () {
    return {
      // 表头
      columns: [
        {
          title: '时间',
          align: 'center',
          dataIndex: 'createTime'
        },
        {
          title: '操作人',
          align: 'center',
          dataIndex: 'operator'
        },
        {
          title: '操作类型',
          align: 'center',
          dataIndex: 'type'
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
        query: '/Component/log/showLogsByTime',
        exportUrl: `/Component/log/exportLogs`,
      }
    }
  },
  computed: {
  },
  methods: {
    handleQueryByTime() {
      if ( typeof this.queryParam.dateTime1 == 'undefined' || typeof this.queryParam.dateTime2 == 'undefined') {
        this.$info({
          title: '提示',
          content: '查询日期不能为空'
        })
      } else {
        this.searchQuery()
      }
    }
  }

}
</script>
<style scoped>
  /*@import '~@assets/less/common.less';*/
</style>
