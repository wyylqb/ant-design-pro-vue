<template xmlns:background-color="http://www.w3.org/1999/xhtml">
  <a-card :bordered="false" :style="{ height: '100%' }">

    <!-- 按钮操作区域 -->
    <a-row style="margin-left: 14px">
      <a-button @click="handleAdd(2)" type="primary">添加子分类</a-button>
      <a-button @click="handleAdd(1)" type="primary">添加一级分类</a-button>
      <!--<a-button type="primary" icon="download" @click="handleExportXls('分类信息')">导出</a-button>-->
      <!--<a-upload name="file" :showUploadList="false" :multiple="false" :headers="tokenHeader" :action="importExcelUrl" @change="handleImportExcel">-->
      <!--<a-button type="primary" icon="import">导入</a-button>-->
      <!--</a-upload>-->
      <a-button title="删除数据" @click="handleDelete" type="default">删除</a-button>
      <!--<a-button title="删除多条数据" @click="batchDel" type="default">批量删除</a-button>-->
    </a-row>
    <div style="background: #fff;padding-left:16px;height: 100%; margin-top: 5px">
      <a-alert type="info" :showIcon="true">
        <div slot="message">
          当前选择：
          <a v-if="this.currSelected.title">{{ getCurrSelectedTitle() }}</a>
          <a v-if="this.currSelected.title" style="margin-left: 10px" @click="onClearSelected">取消选择</a>
        </div>
      </a-alert>
      <!--<a-input-search @search="onSearch" style="width:100%;margin-top: 10px" placeholder="请输入分类名称"/>-->
      <!-- 树-->
      <a-col :md="10" :sm="24">
        <template>
          <a-dropdown :trigger="[this.dropTrigger]" @visibleChange="dropStatus">
               <span style="user-select: none">
            <a-tree
              checkable
              multiple
              @select="onSelect"
              @check="onCheck"
              @rightClick="rightHandle"
              :selectedKeys="selectedKeys"
              :checkedKeys="checkedKeys"
              :treeData="classifyTree"
              :checkStrictly="true"
              :expandedKeys="iExpandedKeys"
              :autoExpandParent="autoExpandParent"
              @expand="onExpand"/>
                </span>
            <!--新增右键点击事件,和增加添加和删除功能-->
            <a-menu slot="overlay">
              <a-menu-item @click="handleAdd(3)" key="1">添加</a-menu-item>
              <a-menu-item @click="handleDelete" key="2">删除</a-menu-item>
              <a-menu-item @click="closeDrop" key="3">取消</a-menu-item>
            </a-menu>
          </a-dropdown>
        </template>
      </a-col>
    </div>
    <classify-modal ref="classifyModal" @ok="loadTree"></classify-modal>
  </a-card>
</template>
<script>
import ClassifyModal from './modules/ClassifyModal'
import pick from 'lodash.pick'
import {queryTerms, searchByKeywords, deleteByTermId} from '@/api/api'
import {httpAction, deleteAction} from '@/api/manage'
import {JeecgListMixin} from '@/mixins/JeecgListMixin'
// 表头
const columns = [
  // {
  //   title: '分类名称',
  //   dataIndex: 'termName'
  // },
  // {
  //   title: '分类类型',
  //   align: 'center',
  //   dataIndex: 'level'
  // },
  // {
  //   title: '操作',
  //   align: 'center',
  //   dataIndex: 'action',
  //   scopedSlots: {customRender: 'action'}
  // }
]
export default {
  name: 'ClassifyInfo',   //替代DepartList
  mixins: [JeecgListMixin],
  components: {
    ClassifyModal        //替代DepartModal
  },
  data() {
    return {
      iExpandedKeys: [],
      loading: false,
      autoExpandParent: true,
      currFlowId: '',
      currFlowName: '',
      disable: true,
      treeData: [],
      visible: false,
     // departTree: [],
      classifyTree: [],
      rightClickSelectedKey: '',
      hiding: true,
      model: {},
      dropTrigger: '',
      classify: {},
      columns: columns,
      disableSubmit: false,
      checkedKeys: [],
      selectedKeys: [],
      autoIncr: 1,
      currSelected: {},
      form: this.$form.createForm(this),
      labelCol: {
        xs: {span: 24},
        sm: {span: 5}
      },
      wrapperCol: {
        xs: {span: 24},
        sm: {span: 16}
      },
      graphDatasource: {
        nodes: [],
        edges: []
      },
      // validatorRules: {
      //   departName: {rules: [{required: true, message: '请输入机构/部门名称!'}]},
      //   orgCode: {rules: [{required: true, message: '请输入机构编码!'}]},
      //   mobile: {rules: [{validator: this.validateMobile}]}
      // },
      url: {
        //queryTerms:'/component/showTerms',
        delete: '/Component/component/deleteTermById',
        edit: '/sys/sysDepart/edit',
        // deleteBatch: '/sys/sysDepart/deleteBatch',
        exportXlsUrl: "/Component/component/downCom",    //导出
        importExcelUrl: "/Component/component/uploadComponent",  //导入
      },
    }
  },
  computed: {
    // importExcelUrl: function () {
    //   return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`;
    // }
  },
  methods: {
    loadData() {
      this.refresh();
    },
    loadTree() {
      // console.log("aa");   //有值
      var that = this;
      that.treeData = [];
      that.classifyTree = [];

      queryTerms().then((res) => {
        console.log(res);
          for (let i = 0; i < res.length; i++) {
            let temp = res[i]
            that.treeData.push(temp)
            that.classifyTree.push(temp)
            that.setThisExpandedKeys(temp)
          }
          this.loading = false
       // }
      })
    },
    setThisExpandedKeys(node) {
      if (node.children && node.children.length > 0) {
        this.iExpandedKeys.push(node.key)
        for (let a = 0; a < node.children.length; a++) {
          this.setThisExpandedKeys(node.children[a])
        }
      }
    },
    refresh() {
      this.loading = true
      this.loadTree()
    },
    // 右键操作方法
    rightHandle(node) {
      this.dropTrigger = 'contextmenu'
      // console.log(node.node.eventKey)
      this.rightClickSelectedKey = node.node.eventKey
    },
    onExpand(expandedKeys) {
       console.log('onExpand', expandedKeys)
      // if not set autoExpandParent to false, if children expanded, parent can not collapse.
      // or, you can remove all expanded children keys.
      this.iExpandedKeys = expandedKeys
      this.autoExpandParent = false
    },
    backFlowList() {
      this.$router.back(-1)
    },
    // 右键点击下拉框改变事件
    dropStatus(visible) {
      if (visible == false) {
        this.dropTrigger = ''
      }
    },
    // 右键点击下拉关闭下拉框
    closeDrop() {
      this.dropTrigger = ''
    },
    addRootNode() {
      this.$refs.nodeModal.add(this.currFlowId, '')
    },
    handleDelete: function () {
      console.log(this.checkedKeys)
      if (this.checkedKeys.length <= 0) {
        this.$message.warning('请选择一条记录！')
      } else {
        var id = this.checkedKeys[0];
        // for (var a = 0; a < this.checkedKeys.length; a++) {
        //   ids += this.checkedKeys[a] + ','
        // }
        var that = this
        this.$confirm({
          title: '确认删除',
          content: '确定要删除所选中的1条数据，以及子节点数据吗?',
          // content: '确定要删除所选中的 ' + this.checkedKeys.length + ' 条数据，以及子节点数据吗?',
          onOk: function () {
            deleteAction(that.url.delete, {termId: id}).then((res) => {
              console.log(res);
              // if (res.success) {
                that.$message.success("删除成功！");
                that.loadTree();
                that.onClearSelected();
              // } else {
              //   that.$message.warning(res.message)
              // }
            })
          }
        })
      }
    },
    onSearch(value) {
      let that = this
      if (value) {
        searchByKeywords({keyWord: value}).then((res) => {
          // if (res.success) {
            that.classifyTree = []
            for (let i = 0; i < res.length; i++) {
              let temp = res[i]
              that.classifyTree.push(temp)
            }
          // } else {
          //   that.$message.warning(res.message)
          // }
        })
      } else {
        that.loadTree()
      }

    },
    nodeModalOk() {
      this.loadTree()
    },
    nodeModalClose() {
    },
    hide() {
      console.log(111)
      this.visible = false
    },
    onCheck(checkedKeys, info) {
      console.log('onCheck', checkedKeys, info)
      this.hiding = false
      this.checkedKeys = checkedKeys.checked
    },
    onSelect(selectedKeys, e) {
      // console.log('selected', selectedKeys, e)
      this.hiding = false
      let record = e.node.dataRef
      // console.log('onSelect-record', record)
      this.currSelected = Object.assign({}, record)
      this.model = this.currSelected
      this.selectedKeys = [record.key]
      this.model.parId = record.parId
      // this.setValuesToForm(record)
    },
    // 触发onSelect事件时,为部门树右侧的form表单赋值
    // setValuesToForm(record) {
    //   this.form.getFieldDecorator('fax', {initialValue: ''})
    //   this.form.setFieldsValue(pick(record, 'departName', 'orgCode', 'departOrder', 'mobile', 'fax', 'address', 'memo'))
    // },
    getCurrSelectedTitle() {
      return !this.currSelected.title ? '' : this.currSelected.title
    },
    onClearSelected() {
      this.hiding = true
      this.checkedKeys = []
      this.currSelected = {}
      this.form.resetFields()
      this.selectedKeys = []
    },
    handleNodeTypeChange(val) {
      this.currSelected.nodeType = val
    },
    notifyTriggerTypeChange(value) {
      this.currSelected.notifyTriggerType = value
    },
    receiptTriggerTypeChange(value) {
      this.currSelected.receiptTriggerType = value
    },
    submitCurrForm() {
      this.form.validateFields((err, values) => {
        if (!err) {
          if (!this.currSelected.id) {
            this.$message.warning('请点击选择要修改部门!')
            return
          }

          let formData = Object.assign(this.currSelected, values)
          console.log('Received values of form: ', formData)
          httpAction(this.url.edit, formData, 'put').then((res) => {
            if (res.success) {
              this.$message.success('保存成功!')
              this.loadTree()
            } else {
              this.$message.error(res.message)
            }
          })
        }
      })
    },
    emptyCurrForm() {
      this.form.resetFields()
    },
    nodeSettingFormSubmit() {
      this.form.validateFields((err, values) => {
        if (!err) {
          console.log('Received values of form: ', values)
        }
      })
    },
    openSelect() {
      this.$refs.sysDirectiveModal.show()
    },
    handleAdd(num) {
      if (num == 1) {
      //  console.log("111");   //有值
        this.$refs.classifyModal.add()
        this.$refs.classifyModal.title = '新增'
      } else if (num == 2) {
        console.log("222");   //有值
         let key = this.currSelected.key
        // console.log(this.currSelected.key);  //undefined
        if (!key) {
          this.$message.warning('请先选中一条记录!')
          return false
        }
        this.$refs.classifyModal.add(this.selectedKeys)
        this.$refs.classifyModal.title = '新增'
      } else {
        this.$refs.classifyModal.add(this.rightClickSelectedKey)
        this.$refs.classifyModal.title = '新增'
      }
    },
    selectDirectiveOk(record) {
      console.log('选中指令数据', record)
      this.nodeSettingForm.setFieldsValue({directiveCode: record.directiveCode})
      this.currSelected.sysCode = record.sysCode
    },
    getFlowGraphData(node) {
      this.graphDatasource.nodes.push({
        id: node.id,
        text: node.flowNodeName
      })
      if (node.children.length > 0) {
        for (let a = 0; a < node.children.length; a++) {
          let temp = node.children[a]
          this.graphDatasource.edges.push({
            source: node.id,
            target: temp.id
          })
          this.getFlowGraphData(temp)
        }
      }
    },
  },
  created() {
    this.currFlowId = this.$route.params.id
    this.currFlowName = this.$route.params.name
    // this.loadTree()
  },

}
</script>
<style scoped>
  .ant-card-body .table-operator {
    margin: 15px;
  }

  .anty-form-btn {
    width: 100%;
    text-align: center;
  }

  .anty-form-btn button {
    margin: 0 5px;
  }

  .anty-node-layout .ant-layout-header {
    padding-right: 0
  }

  .header {
    padding: 0 8px;
  }

  .header button {
    margin: 0 3px
  }

  .ant-modal-cust-warp {
    height: 100%
  }

  .ant-modal-cust-warp .ant-modal-body {
    height: calc(100% - 110px) !important;
    overflow-y: auto
  }

  .ant-modal-cust-warp .ant-modal-content {
    height: 90% !important;
    overflow-y: hidden
  }

  #app .desktop {
    height: auto !important;
  }

  /** Button按钮间距 */
  .ant-btn {
    margin-left: 3px
  }
</style>