<template>
  <a-card :bordered="false">

    <!-- 操作按钮区域 -->
    <div class="table-operator">
      <a-button @click="handleAdd" type="primary" icon="plus">添加角色</a-button>
    </div>

    <!-- table区域-begin -->
    <div>
      <div class="ant-alert ant-alert-info" style="margin-bottom: 16px;">
        <i class="anticon anticon-info-circle ant-alert-icon"></i> 已选择
        <a style="font-weight: 600">{{ selectedRowKeys.length }}</a>项
        <a style="margin-left: 24px" @click="onClearSelected">清空</a>
      </div>

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
          <a @click="handleEdit(record)">编辑</a>
          <a-divider type="vertical" />
          <a-popconfirm title="确定删除吗?" @confirm="() => handleDeletes(record.roleId)">
                  <a>删除</a>
          </a-popconfirm>
        </span>
      </a-table>
    </div>
    <!-- table区域-end -->

    <!-- 表单区域 -->
    <role-modal ref="modalForm" @ok="modalFormOk"></role-modal>
  </a-card>
</template>

<script>
import RoleModal from './modules/RoleModal'
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import { formatDate } from '@/utils/util'
import { Modal } from 'ant-design-vue'

export default {
  name: 'RoleInfo',
  mixins: [JeecgListMixin],
  components: {
    RoleModal
  },
  data() {
    return {
      // 表头
      columns: [
        {
          title: '角色名',
          align: 'center',
          dataIndex: 'roleName'
        },
        {
          title: '操作',
          dataIndex: 'action',
          align: 'center',
          scopedSlots: { customRender: 'action' }
        }
      ],
      url: {
        list: '/Component/user/showAllRoles',
        delete: '/Component/user/deleteRole',
        add: '/Component/user/addUser',
        edit: '/Component/user/updateUser',
      },
      showModelWindow: false
    }
  },
  computed: {

  },
  methods: {
  }
}
</script>
<style scoped>
</style>
