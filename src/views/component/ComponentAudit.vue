<template>
  <a-card :bordered="false">
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
        @change="handleTableChange"
      >
        <span slot="action" slot-scope="text, record">
          <a @click="handleAudit(1,record.comId)">通过</a>
          <a-divider type="vertical"/>
          <a @click="handleAudit(-1,record.comId)">不通过</a>
        </span>
      </a-table>
    </div>
    <!-- table区域-end -->

    <!-- 表单区域 -->
  </a-card>
</template>

<script>
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import {postAction} from '@/api/manage'
import { formatDate } from '@/utils/util'
import { Modal } from 'ant-design-vue'

export default {
  name: 'ComponentAudit',
  mixins: [JeecgListMixin],
  data() {
    return {
      // 表头
      columns: [
        {
          title: '名称',
          align: 'center',
          dataIndex: 'comParent.parName'
        },
        {
          title: '关键词',
          align: 'center',
          dataIndex: 'keyWord'
        },
        {
          title: '描述信息',
          align: 'center',
          dataIndex: 'desInfo'
        },
        {
          title: '接口信息',
          align: 'center',
          dataIndex: 'comParent.interfaceInfo'
        },
        {
          title: '上传者',
          align: 'center',
          dataIndex: 'user.userName'
        },
        {
          title: '操作',
          dataIndex: 'action',
          align: 'center',
          scopedSlots: { customRender: 'action' }
        }
      ],
      url: {
        audit: '/Component/component/verifyCom',
        list:`/Component/component/showUnverifyCom`
      },
    }
  },
  computed: {
  },
  methods: {
    handleAudit(num,id) {
      var that = this;
      var params={state:num,comId:id};
        postAction(this.url.audit,params).then((res) => {
          that.loadData();
        })
    },
  }
}
</script>
<style scoped>
</style>
