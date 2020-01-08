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
        <span slot="action" slot-scope="text, record">
          <a @click="handleDelete(record)">删除</a>
        </span>
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
import {deleteAction} from '@/api/manage'

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
        {
          title: '操作',
          dataIndex: 'action',
          scopedSlots: {customRender: 'action'},
          align: "center",
          width: 170
        }
      ],
      url: {
        list: '/Component/component/showComByUser',
        uploads:`/Component/component/uploadComponent`,
        delete: "/Component/component/deleteCom",
      }
    }
  },
  computed: {
  },
  methods: {
    handleDelete: function (id) {
      if (!this.url.delete) {
        this.$message.error("请设置url.delete属性!")
        return
      }
      var that = this;
      deleteAction(that.url.delete, {comId: id.comId}).then((res) => {
        that.$message.success("删除成功！");
        that.loadData();
      });
    }
  }

}
</script>
<style scoped>
  /*@import '~@assets/less/common.less';*/
</style>

