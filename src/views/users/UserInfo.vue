<template>
  <a-card :bordered="false">
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="24">
          <a-col :md="6" :sm="8">
            <a-form-item label="用户名">
              <a-input placeholder="请输入用户名" v-model="queryParam.userName"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="8">
            <span style="float: left;overflow: hidden;" class="table-page-search-submitButtons">
              <a-button type="primary" @click="handleQueryByName" icon="search">查询</a-button>
              <a-button
                type="primary"
                @click="searchReset"
                icon="reload"
                style="margin-left: 8px"
              >重置</a-button>
            </span>
          </a-col>
        </a-row>
      </a-form>
    </div>

    <!-- 操作按钮区域 -->
    <div class="table-operator">
      <a-button @click="handleAdd" type="primary" icon="plus">添加用户</a-button>
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
                <a href="javascript:;" @click="handlePassword(record)">密码</a>
                <a-popconfirm title="确定删除吗?" @confirm="() => handleDelete(record.userId)">
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
    <user-modal ref="modalForm" @ok="modalFormOk"></user-modal>
  </a-card>
</template>

<script>
import UserModal from './modules/UserModal'
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import { formatDate } from '@/utils/util'
import { Modal } from 'ant-design-vue'

export default {
  name: 'UserInfo',
  mixins: [JeecgListMixin],
  components: {
    UserModal
  },
  data() {
    return {
      //  description: '用户模块管理页面',
      // 表头
      columns: [
        {
          title: '用户名',
          align: 'center',
          dataIndex: 'userName'
        },
        // {
        //   title: '用户角色',
        //   align: 'center',
        //   dataIndex: 'roles'
        // },
        {
          title: '创建时间',
          align: 'center',
          dataIndex: 'createTime'
        },
        {
          title: '操作',
          dataIndex: 'action',
          align: 'center',
          scopedSlots: { customRender: 'action' }
        }
      ],
      url: {
        list: '/Component/user/showAllUsers',
        delete: '/Component/user/deleteUser',
        query: '/Component/user/showUserByUserName',
        add: '/Component/user/addUser',
        edit: '/Component/user/updateUser',
        password: '/Component/user/updatePassword'
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
      if (typeof this.queryParam.userName == 'undefined' || this.queryParam.userName == '') {
        this.$info({
          title: '提示',
          content: '用户名不能为空'
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
