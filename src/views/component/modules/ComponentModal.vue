<template>
  <a-drawer
    :title="title"
    :width="drawerWidth"
    @close="handleCancel"
    :visible="visible"
    :confirmLoading="confirmLoading"
    :wrapStyle="{height: 'calc(100% - 108px)',overflow: 'auto',paddingBottom: '108px'}"
  >
    <div :style="{width: '100%',border: '1px solid #e9e9e9',padding: '10px 16px',background: '#fff',}">
      <a-spin :spinning="confirmLoading">
        <a-form :form="form">

          <a-form-item label="组件类型" :labelCol="labelCol" :wrapperCol="wrapperCol" >
            <a-radio-group @change="onChangeTermType" v-decorator="['termType',{'initialValue':localTermType}]">
              <a-radio :value="0">分类</a-radio>
              <a-radio :value="1">组件</a-radio>
            </a-radio-group>
          </a-form-item>

          <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            :label="termLabel"
            hasFeedback >
            <a-input placeholder="请输入组件名称" v-decorator="[ 'termName', validatorRules.termName]" :readOnly="disableSubmit"/>
          </a-form-item>


          <a-form-item
            v-show="localTermType!=0"
            label="上级组件"
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            :validate-status="validateStatus"
            :hasFeedback="true"
            :required="true">
            <span slot="help">{{ validateStatus=='error'?'请选择上级组件':'&nbsp;&nbsp;' }}</span>
            <a-tree-select
              style="width:100%"
              :dropdownStyle="{ maxHeight: '200px', overflow: 'auto' }"
              :treeData="treeData"
              v-model="model.parentId"
              placeholder="请选择父级组件"
              :disabled="disableSubmit"
              @change="handleParentIdChange">
            </a-tree-select>
          </a-form-item>


        </a-form>
      </a-spin>
      <a-row :style="{textAlign:'right'}">
        <a-button :style="{marginRight: '8px'}" @click="handleCancel">
          关闭
        </a-button>
        <a-button :disabled="disableSubmit" @click="handleOk" type="primary">确定</a-button>
      </a-row>
    </div>
  </a-drawer>
</template>

<script>
import {addPermission,editPermission,queryTreeList} from '@/api/api'
import pick from 'lodash.pick'


export default {
  name: "ComponentModal",
  data () {
    return {
      drawerWidth:700,
      treeData:[],
      treeValue: '0-0-4',
      title:"操作",
      visible: false,
      disableSubmit:false,
      model: {},
      localMenuType:0,
      alwaysShow:false,//表单元素-聚合路由
      menuHidden:false,//表单元素-隐藏路由
      routeSwitch:true, //是否路由菜单
      isKeepalive:true, //是否缓存路由
      show:true,//根据菜单类型，动态显示隐藏表单元素
      termLabel:'组件名称',
      isRequrie:true,  // 是否需要验证
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },

      confirmLoading: false,
      form: this.$form.createForm(this),

      iconChooseVisible: false,
      validateStatus:""
    }
  },
  computed:{
    validatorRules:function() {
      return {
        termName:{rules: [{ required: true, message: '请输入菜单标题!' }]},
        sortNo:{initialValue:1.0,rules: [{validator: this.validateNumber}]},
      }
    }
  },
  created () {
    this.initDictConfig();
  },
  methods: {
    loadTree(){
      var that = this;
      queryTreeList().then((res)=>{
        if(res.success){
          console.log('----queryTreeList---')
          console.log(res)
          that.treeData = [];
          let treeList = res.result.treeList
          for(let a=0;a<treeList.length;a++){
            let temp = treeList[a];
            temp.isLeaf = temp.leaf;
            that.treeData.push(temp);
          }
        }
      });
    },
    add () {
      // 默认值
      this.edit({status:'1',permsType:'1',route:true});
    },
    edit (record) {
      this.resetScreenSize(); // 调用此方法,根据屏幕宽度自适应调整抽屉的宽度
      this.form.resetFields();
      this.model = Object.assign({}, record);
      //--------------------------------------------------------------------------------------------------
      //根据菜单类型，动态展示页面字段
      console.log(record);
      this.alwaysShow = !record.alwaysShow?false:true;
      this.menuHidden = !record.hidden?false:true;

      if(record.route!=null){
        this.routeSwitch = record.route?true:false;
      }

      if(record.keepAlive!=null){
        this.isKeepalive = record.keepAlive?true:false;
      }else{
        this.isKeepalive = false; // 升级兼容 如果没有（后台没有传过来、或者是新建）默认为false
      }



      //console.log('record.menuType', record.menuType);
      this.show = record.menuType==2?false:true;
      this.menuLabel = record.menuType==2?'按钮/权限':'菜单名称';

      if(this.model.parentId){
        this.localMenuType = 1;
      }else{
        this.localMenuType = 0;
      }
      //----------------------------------------------------------------------------------------------

      this.visible = true;
      this.loadTree();
      let fieldsVal = pick(this.model,'name','perms','permsType','component','url','sortNo','menuType','status');
      this.$nextTick(() => {
        this.form.setFieldsValue(fieldsVal)
      });
    },
    close () {
      this.$emit('close');
      this.disableSubmit = false;
      this.visible = false;
    },
    handleOk () {
      const that = this;
      // 触发表单验证
      this.form.validateFields((err, values) => {
        if (!err) {
          this.model.alwaysShow = this.alwaysShow;
          this.model.hidden = this.menuHidden;
          this.model.route = this.routeSwitch;
          this.model.keepAlive = this.isKeepalive;
          let formData = Object.assign(this.model, values);
          if ((formData.termType == 1 || formData.termType == 2) && !formData.parentId) {
            that.validateStatus = 'error';
            that.$message.error("请检查你填的类型以及信息是否正确！");
            return;
          } else {
            that.validateStatus = 'success';
          }
          that.confirmLoading = true;
          console.log(formData);
          let obj;
          if (!this.model.id) {
            obj = addPermission(formData);
          } else {
            obj = editPermission(formData);
          }
          obj.then((res) => {
            if (res.success) {
              that.$message.success(res.message);
              that.$emit('ok');
            } else {
              that.$message.warning(res.message);
            }
          }).finally(() => {
            that.confirmLoading = false;
            that.close();
          });
        }
      })
    },
    handleCancel () {
      this.close()
    },
    validateNumber(rule, value, callback){
      if(!value || new RegExp(/^[0-9]*[1-9][0-9]*$/).test(value)){
        callback();
      }else{
        callback("请输入正整数!");
      }
    },
    onChangeTermType(e) {
      //console.log('localMenuType checked', e.target.value)
      this.localTermType=e.target.value
      if(e.target.value == 2){
        this.show = false;
        this.menuLabel = '按钮/权限';
      }else{
        this.show = true;
        this.menuLabel = '菜单名称';
      }
      this.$nextTick(() => {
        this.form.validateFields(['url','component'], { force: true });
      });
    },
    selectIcons(){
      this.iconChooseVisible = true
    },
    handleIconCancel () {
      this.iconChooseVisible = false
    },
    handleIconChoose (value) {
      console.log(value)
      this.model.icon = value
      this.form.icon = value
      this.iconChooseVisible = false
    },
    // 根据屏幕变化,设置抽屉尺寸
    resetScreenSize(){
      let screenWidth = document.body.clientWidth;
      if(screenWidth < 500){
        this.drawerWidth = screenWidth;
      }else{
        this.drawerWidth = 700;
      }
    },
    initDictConfig() {
    },
    handleParentIdChange(value){
      if(!value){
        this.validateStatus="error"
      }else{
        this.validateStatus="success"
      }
    }
  }
}
</script>

<style scoped>

</style>