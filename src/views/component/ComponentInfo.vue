<template>
  <a-card :bordered="false">
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <!-- 搜索区域 -->
      <a-form layout="inline">
        <a-row :gutter="10">
          <a-col :md="10" :sm="12">
            <a-form-item label="组件关键字" style="margin-left:8px">
              <a-input placeholder="请输入关键字查询" v-model="queryParam.keyWord"></a-input>
            </a-form-item>
          </a-col>
          <span style="float: left;overflow: hidden;" class="table-page-search-submitButtons">
            <a-col :md="6" :sm="24">
             <a-button type="primary" @click="searchC" icon="search" style="margin-left: 18px">查询</a-button>
              <a-button type="primary" @click="searchReset" icon="reload" style="margin-left: 8px">重置</a-button>
            </a-col>
          </span>
        </a-row>
      </a-form>
    </div>

    <!-- table区域-begin -->
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
          <a icon="download" @click="handleExport('组件')">下载</a>
          <!--<a-dropdown>-->
            <!--<a class="ant-dropdown-link">-->
              <!--更多 <a-icon type="down"/>-->
            <!--</a>-->
            <!--<a-menu slot="overlay">-->
              <!--<a-menu-item>-->
                <!--<a href="javascript:;" @click="handleDetail(record)">详情</a>-->
              <!--</a-menu-item>-->
              <!--<a-menu-item>-->
                <!--<a-popconfirm title="确定要删除吗?" @confirm="() => handleDelete(record.comId)">-->
                  <!--<a>删除</a>-->
                <!--</a-popconfirm>-->
              <!--</a-menu-item>-->
            <!--</a-menu>-->
          <!--</a-dropdown>-->
        </span>
      </a-table>
    </div>
    <!-- table区域-end -->

    <!-- 表单区域 -->
    <component-modal ref="modalForm" @ok="modalFormOk"></component-modal>
    <!--<Select-User-Modal ref="selectUserModal" @selectFinished="selectOK"></Select-User-Modal>-->
  </a-card>
</template>

<script>
import {JeecgListMixin} from '@/mixins/JeecgListMixin'
import {getAction, postAction, downFile,deleteAction} from '@/api/manage'
// import SelectUserModal from './SelectUserModal'
import ComponentModal from './modules/ComponentModal'

export default {
  name: "ComponentInfo",
  mixins: [JeecgListMixin],
  components: {
    // SelectUserModal,
    ComponentModal
  },
  data() {
    return {
      // description: '组件信息',
      // currentTermId: '',
      // 表头
      columns: [
        {
          title: '名称',
          align: "center",
          dataIndex: 'comParent.parName'
        },
        {
          title: '关键词',
          align: "center",
          dataIndex: 'keyWord'
        },
        {
          title: '版本号',
          align: "center",
          dataIndex: 'version'
        },
        {
          title: '下载次数',
          align: "center",
          dataIndex: 'downTimes'
        },
        {
          title: '描述信息',
          align: "center",
          dataIndex: 'desInfo'
        },
        {
          title: '操作',
          dataIndex: 'action',
          scopedSlots: {customRender: 'action'},
          align: "center",
          width: 170
        }],
      url: {
        list: "/Component/component/showComsByTerm ",      //查询某分类下有哪些组件
        search:`/Component/component/comSearch`,     //根据关键字查询组件
        edit: "/sys/user/editSysDepartWithUser", //编辑某分类下的某些组件
        delete: "/Component/component/deleteCom",
        deleteBatch: "/sys/user/deleteUserInDepartBatch",
        export:`Component/component/downCom`
      }
    }
  },
  created() {
  },

  methods: {
    loadData(arg) {
      if (!this.url.list) {
        this.$message.error("请设置url.list属性!")
        return
      }
      //加载数据 若传入参数1则加载第一页的内容
      if (arg === 1) {
        this.ipagination.current = 1;
      }
      if (this.currentTermId === '') return;
      var params = this.getQueryParams();//查询条件
      // console.log(params);
      var currentTermIds = sessionStorage.getItem('termId');
      // params.termId = "78c010cb-1ba3-479b-b02e-b2679ee7bc16";
      params.termId = currentTermIds;
      postAction(this.url.list, params).then((res) => {
        // console.log("1111");
        //  console.log(res);
        // if (res.success) {
          this.dataSource = res;
          this.ipagination.total = res.total;
        // }
      })
    },
    handleDelete: function (id) {
      if (!this.url.delete) {
        this.$message.error("请设置url.delete属性!")
        return
      }
      var that = this;
      deleteAction(that.url.delete, {comId: id}).then((res) => {
        console.log("www");
        console.log(res);
          that.$message.success("删除成功！");
          if (this.selectedRowKeys.length>0){
            for(let i =0; i<this.selectedRowKeys.length;i++){
              if (this.selectedRowKeys[i] == id){
                this.selectedRowKeys.splice(i,1);
                break;
              }
            }
          }
          that.loadData();
      });
    },
    handleExport(fileName) {
      if (!fileName || typeof fileName != "string") {
        fileName = "导出文件"
      }
      var param =this.selectionRows[0];
      console.log("导出参数", param)
      downFile(this.url.export, param).then((data) => {
        if (typeof window.navigator.msSaveBlob !== 'undefined') {
          window.navigator.msSaveBlob(new Blob([data]), fileName)
        } else {
          console.log("wwww");
          let url = window.URL.createObjectURL(new Blob([data]));
          let link = document.createElement('a')
          link.style.display = 'none'
          link.href = url
          // link.setAttribute('download', fileName+'.xls')
          link.setAttribute('download', fileName+'.zip')
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link); //下载完成移除元素
          window.URL.revokeObjectURL(url); //释放掉blob对象
        }
      })
    },
    open(record) {
      //console.log(record);
      this.currentTermId = record.id;
      this.loadData(1);
    },
    clearList() {
      this.currentTermId = '';
      this.dataSource = [];
    },
    hasSelectTerm() {
      if (this.currentTermId == null) {
        this.$message.error("请选择一个部门!")
        return false;
      }
      return true;
    },
    handleAddUserDepart() {
      if (this.currentTermId == '') {
        this.$message.error("请选择一个部门!")
      } else {
      //  this.$refs.selectUserModal.visible = true;
      }
    },
    // handleEdit: function (record) {
    //   this.$refs.modalForm.title = "编辑";
    //   this.$refs.modalForm.departDisabled = true;
    //   this.$refs.modalForm.disableSubmit = false;
    //   this.$refs.modalForm.edit(record);
    // },
    handleAdd: function () {
      if (this.currentTermId == '') {
        this.$message.error("请选择一个部门!")
      } else {
        this.$refs.modalForm.departDisabled = true;
        this.$refs.modalForm.userDepartModel.departIdList = [this.currentTermId];  //传入一个部门id
        this.$refs.modalForm.add();
        this.$refs.modalForm.title = "新增";
      }
    },
    selectOK(data) {
      let params = {};
      params.termId = this.currentTermId;
      params.userIdList = [];
      for (var a = 0; a < data.length; a++) {
        params.userIdList.push(data[a]);
      }
      console.log(params);
      postAction(this.url.edit, params).then((res) => {
        if (res.success) {
          this.$message.success(res.message);
          this.loadData();
        } else {
          this.$message.warning(res.message);
        }
      })
    }
  }
}
</script>
<style scoped>
  /** Button按钮间距 */
  .ant-btn {
    margin-left: 3px
  }

  .ant-card {
    margin-left: -30px;
    margin-right: -30px;
  }

  .table-page-search-wrapper {
    margin-top: -16px;
    margin-bottom: 16px;
  }
</style>