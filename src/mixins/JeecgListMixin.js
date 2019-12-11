/**
 * 新增修改完成调用 modalFormOk方法 编辑弹框组件ref定义为modalForm
 * 高级查询按钮调用 superQuery方法  高级查询组件ref定义为superQueryModal
 * data中url定义 list为查询列表  delete为删除单条记录  deleteBatch为批量删除
 */
import { filterObj } from '@/utils/util';
import { deleteAction, getAction,downFile,postAction } from '@/api/manage'
import Vue from 'vue'
import { ACCESS_TOKEN } from "@/store/mutation-types"

export const JeecgListMixin = {
  data() {
    return {
      //token header
      //  tokenHeader: {'X-Access-Token': Vue.ls.get(ACCESS_TOKEN)},

      /* 查询条件-请不要在queryParam中声明非字符串值的属性 */
      queryParam: {},
      /* 数据源 */
      dataSource: [],

      /* 分页参数 */
      ipagination: {
        current: 1,
        pageSize: 10,
        pageSizeOptions: ['10', '20', '30'],
        showTotal: (total, range) => {
          return range[0] + "-" + range[1] + " 共" + total + "条"
        },
        showQuickJumper: true,
        showSizeChanger: true,
        total: 0
      },
      /* 排序参数 */
      isorter: {
        column: 'createTime',
        order: 'desc',
      },
      /* 筛选参数 */
      filters: {},
      /* table加载状态 */
      loading: false,
      /* table选中keys*/
      selectedRowKeys: [],
      /* table选中records*/
      selectionRows: [],
      /* 查询折叠 */
      toggleSearchStatus: false,
      /* 高级查询条件生效状态 */
      superQueryFlag: false,
      /* 高级查询条件 */
      superQueryParams: ""
    }
  },
  created() {
    this.loadData();
    //初始化字典配置 在自己页面定义
    this.initDictConfig();
  },
  methods: {
    loadData(arg) {
      if (!this.url.list) {
        /* eslint-disable */
        this.$message.error("请设置url.list属性!")
        return
      }
      //加载数据 若传入参数1则加载第一页的内容
      if (arg === 1) {
        this.ipagination.current = 1;
      }
      var params = this.getQueryParams();//查询条件
      this.loading = true;
      getAction(this.url.list, params).then((res) => {
        console.log(res.length);
        //if (res.success) {
        this.dataSource = res;

        //把时间戳转为时间
        for (let i = 0; i < this.dataSource.length; i++) {
          const timestamp = this.dataSource[i].createTime;
          this.dataSource[i].createTime = this.$moment(timestamp).format('YYYY-MM-DD hh:mm:ss');
        }

        this.ipagination.total = res.length;
        //   }
        // if(res.code===510){
        //   this.$message.warning(res.message)
        // }
        this.loading = false;
      })

    },
    //根据关键字查询组件
    loadCData(arg) {
      if (!this.url.search) {
        /* eslint-disable */
        this.$message.error("请设置url.list属性!")
        return
      }
      //加载数据 若传入参数1则加载第一页的内容
      if (arg === 1) {
        this.ipagination.current = 1;
      }
      var params = this.getQueryParams();//查询条件
      this.loading = true;
      postAction(this.url.search, params).then((res) => {
        this.dataSource = res;
        this.ipagination.total = res.length;
        this.loading = false;
      })

    },
    //按用户名查询
    loadQueryData(arg) {
      if (!this.url.query) {
        /* eslint-disable */
        this.$message.error("请设置url.query属性!");
        return;
      }
      //加载数据 若传入参数1则加载第一页的内容
      if (arg === 1) {
        this.ipagination.current = 1;
      }
      var params = this.getQueryParams();//查询条件
      this.loading = true;
      postAction(this.url.query, params).then((res) => {
        this.dataSource = res;
        //把时间戳转为时间
        for (let i = 0; i < this.dataSource.length; i++) {
          const timestamp = this.dataSource[i].createTime;
          this.dataSource[i].createTime = this.$moment(timestamp).format('YYYY-MM-DD hh:mm:ss');
        }
        this.ipagination.total = res.length;
        this.loading = false;
      })
    },

    initDictConfig() {
      // console.log("--这是一个假的方法!")
    },
    handleSuperQuery(arg) {
      //高级查询方法
      if (!arg) {
        this.superQueryParams = ''
        this.superQueryFlag = false
      } else {
        this.superQueryFlag = true
        this.superQueryParams = JSON.stringify(arg)
      }
      this.loadData()
    },
    getQueryParams() {
      //获取查询条件
      let sqp = {}
       // console.log(sqp);
      if (this.superQueryParams) {
        sqp['superQueryParams'] = encodeURI(this.superQueryParams)
      }
      var param = Object.assign(sqp, this.queryParam, this.isorter, this.filters);
      // console.log(param);
      // console.log(param.field);
      param.field = this.getQueryField();
      param.pageNo = this.ipagination.current;
      param.pageSize = this.ipagination.pageSize;
      return filterObj(param);
    },
    getQueryField() {
      //TODO 字段权限控制
      var str = "id,";
      this.columns.forEach(function (value) {
        str += "," + value.dataIndex;
      });
      return str;
    },

    onSelectChange(selectedRowKeys, selectionRows) {
      this.selectedRowKeys = selectedRowKeys;
      this.selectionRows = selectionRows;
    },
    onClearSelected() {
      this.selectedRowKeys = [];
      this.selectionRows = [];
    },
    searchQuery() {
      // this.loadData(1);
      this.loadQueryData(1);
    },
    //根据关键字查询组件
    searchC(){
      this.loadCData(1);
    },

    export() {
      this.handleExportXls();
    },
    superQuery() {
      this.$refs.superQueryModal.show();
    },
    searchReset() {
      this.queryParam = {}
      this.loadData(1);
    },

    handleDelete: function (id) {
      if (!this.url.delete) {
        this.$message.error("请设置url.delete属性!")
        return
      }
      var that = this;
      postAction(that.url.delete, { userId: id }).then((res) => {
        if (res.state >= 1) {
          that.$message.success(res.msg);
          that.loadData();
        } else {
          that.$message.error(res.msg);
        }
      });
    },
    handleEdit: function (record) {
      this.$refs.modalForm.edit(record);
      this.$refs.modalForm.title = "编辑";
      this.$refs.modalForm.disableSubmit = false;
      this.$refs.modalForm.showPasswordBox = false;
    },
    handleAdd: function () {
      this.$refs.modalForm.add();
      this.$refs.modalForm.title = "新增";
      this.$refs.modalForm.disableSubmit = false;
      this.$refs.modalForm.showPasswordBox = true;
    },
    // handleAddCom: function (formData) {
    //   this.$refs.modalForm.saveFile(formData);
    //   this.$refs.modalForm.title = "新增";
    //   this.$refs.modalForm.disableSubmit = false;
    //   this.$refs.modalForm.showPasswordBox = true;
    // },
    // handleUpload: function () {
    //   this.$refs.modalForm.uploadUrl();
    //   this.$refs.modalForm.title = "上传组件";
    //   this.$refs.modalForm.disableSubmit = false;
    //   this.$refs.modalForm.showPasswordBox = true;
    //
    // },
    handleUpdatePassword: function (record) {
      this.$refs.modalForm.updatePassword(record);
      this.$refs.modalForm.title = "修改密码";
      this.$refs.modalForm.disableSubmit = false;
      this.$refs.modalForm.showPasswordBox = true;
    },
    handleTableChange(pagination, filters, sorter) {
      //分页、排序、筛选变化时触发
      //TODO 筛选
      if (Object.keys(sorter).length > 0) {
        this.isorter.column = sorter.field;
        this.isorter.order = "ascend" == sorter.order ? "asc" : "desc"
      }
      this.ipagination = pagination;
      this.loadData();
    },
    handleToggleSearch() {
      this.toggleSearchStatus = !this.toggleSearchStatus;
    },
    modalFormOk() {
      // 新增/修改 成功时，重载列表
      this.loadData();
    },
    handleDetail: function (record) {
      this.$refs.modalForm.edit(record);
      this.$refs.modalForm.title = "详情";
      this.$refs.modalForm.disableSubmit = false;
      this.$refs.modalForm.disableSubmit = true;
    },

    /* 导出 */
    handleExportXls2(){
      let paramsStr = encodeURI(JSON.stringify(this.getQueryParams()));
      let url = `${window._CONFIG['domianURL']}/${this.url.exportXlsUrl}?paramsStr=${paramsStr}`;
      window.location.href = url;
    },

    handleExportXls(fileName){
      if(!fileName || typeof fileName != "string"){
        fileName = "导出文件"
      }
      var param = this.getQueryParams();//查询条件
      console.log("导出参数",param)
      downFile(this.url.exportUrl,param).then((data)=>{
        console.log(data);
        if (typeof window.navigator.msSaveBlob !== 'undefined') {
          window.navigator.msSaveBlob(new Blob([data]), fileName)
        }else{
          console.log("wwww");
          let url = window.URL.createObjectURL(new Blob([data]))
          let link = document.createElement('a')
          link.style.display = 'none'
          link.href = url
          // link.setAttribute('download', fileName+'.xls')
          link.setAttribute('download', fileName)
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link); //下载完成移除元素
          window.URL.revokeObjectURL(url); //释放掉blob对象
        }
      })
    },

    /* 导入 */
    handleImportExcel(info){
      if (info.file.status !== 'uploading') {
        console.log(info.file, info.fileList);
      }
      if (info.file.status === 'done') {
        if(info.file.response.success){
          this.$message.success(`${info.file.name} 文件上传成功`);
          this.loadData();
        } else {
          this.$message.error(`${info.file.name} ${info.file.response.message}.`);
        }
      } else if (info.file.status === 'error') {
        this.$message.error(`文件上传失败: ${info.file.msg} `);
      }
    },

    /* 文件下载 */
    uploadFile(text) {
      if (!text) {
        this.$message.warning("未知的文件")
        return;
      }
      if (text.indexOf(",") > 0) {
        text = text.substring(0, text.indexOf(","))
      }
      window.open(window._CONFIG['domianURL'] + "/sys/common/download/" + text);
    },
  }
}
