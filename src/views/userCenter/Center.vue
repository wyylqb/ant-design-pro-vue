<template>
  <a-card :bordered="false">
    <div class="table-operator">
      <a-button @click="handleAdd" type="primary" icon="plus">新增</a-button>
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
    <center-modal ref="modalForm" @ok="modalFormOk"></center-modal>
  </a-card>
</template>

<script>
import CenterModal from './modules/CenterModal'
import { JeecgListMixin } from '@/mixins/JeecgListMixin'

export default {
  name: 'Center',
  mixins: [JeecgListMixin],
  components: {
    CenterModal
  },
  data () {
    return {
      // 表头
      columns: [
        {
          title: '名称',
          align: 'center',
          dataIndex: 'comName'
        },
        {
          title: '上传时间',
          align: 'center',
          dataIndex: 'createTime'
        },
        {
          title: '审核状态',
          align: 'center',
          dataIndex: 'state'
        },
      ],
      url: {
        list: '/Component/component/showComByUser',
        uploads:`/Component/component/uploadComponent`
      }
    }
  },
  computed: {
  },
  methods: {

  }

}
</script>
<style scoped>
  /*@import '~@assets/less/common.less';*/
</style>

