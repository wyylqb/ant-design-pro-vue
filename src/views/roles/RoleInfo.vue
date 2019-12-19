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

          <a-dropdown>
            <a class="ant-dropdown-link">
              更多
              <a-icon type="down" />
            </a>
            <a-menu slot="overlay">
              <a-menu-item>
                <a-menu-item>
                  <a href="javascript:;" @click="handleDetail(record)">详情</a>
                </a-menu-item>
                <!--<a href="javascript:;" @click="handlePassword(record)">密码</a>-->
                <a-popconfirm title="确定删除吗?" @confirm="() => handleDeletes(record.roleId)">
                  <a>删除</a>
                </a-popconfirm>
              </a-menu-item>
            </a-menu>
          </a-dropdown>
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
      //  description: '用户模块管理页面',
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
        query: '/Component/user/showUserByUserName',
        add: '/Component/user/addUser',
        edit: '/Component/user/updateUser',
        // password: '/Component/user/updatePassword'
      },
      showModelWindow: false
    }
  },
  computed: {
    importExcelUrl: function() {
      return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`
    }
  },
  methods: {
    handleQueryByName() {
      if (typeof this.queryParam.roleName == 'undefined' || this.queryParam.roleName == '') {
        this.$info({
          title: '提示',
          content: '角色名不能为空'
        })
      } else {
        this.searchQuery()
      }
    },
    handlePassword(record) {
      console.log('修改密码')
      this.handleUpdatePassword(record)
    }
  }
}
</script>
<style scoped>
</style>
