<template>
  <a-modal
    :title="title"
    :width="800"
    :ok=false
    :visible="visible"
    :confirmLoading="confirmLoading"
    :okButtonProps="{ props: {disabled: disableSubmit} }"
    @ok="handleOk"
    @cancel="handleCancel"
    cancelText="关闭">

    <a-spin :spinning="confirmLoading">
      <a-form :form="form">
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="分类名称"
          :hidden="false"
          hasFeedback >
          <a-input id="termName" placeholder="请输入分类名称" v-decorator="['termName', validatorRules.termName ]"/>
        </a-form-item>
        <!--<a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="上级分类" hasFeedback>-->
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" :hidden="seen" label="上级分类" hasFeedback>
        <a-tree-select
          style="width:100%"
          :dropdownStyle="{maxHeight:'200px',overflow:'auto'}"
          :treeData="classifyTree"
          v-model="model.parId"
          placeholder="请选择上级分类"
          :disabled="condition">
        </a-tree-select>
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="等级">
          <a-input-number v-decorator="[ 'level',{'initialValue':1}]" />
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
  import { httpAction } from '@/api/manage'
  import { queryTerms } from '@/api/api'
  import pick from 'lodash.pick'
  import ATextarea from 'ant-design-vue/es/input/TextArea'
  export default {
    name: "ClassifyModal",
    components: { ATextarea },
    data () {
      return {
        classifyTree:[],
        orgTypeData:[],
        phoneWarning:'',
        termName:"",
        title:"操作",
        seen:false,
        visible: false,
        condition:true,
        disableSubmit:false,
        model: {},
        menuhidden:false,
        menuusing:true,
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
        validatorRules:{
        termName:{rules: [{ required: true, message: '请输入分类名称!' }]}
        },
        url: {
          add: "/Component/component/addTerm",
        },
      }
    },
    created () {
    },
    methods: {
      loadTreeData(){
        var that = this;
        console.log("aaa");
        queryTerms().then((res)=>{
          console.log(res);
        //  if(res.success){
            that.classifyTree = [];
            for (let i = 0; i < res.length; i++) {
              let temp = res[i];
              that.classifyTree.push(temp);
            }
         // }

        })
      },
      add (classify) {
       // console.log(classify);
        if(classify){
          this.seen = false;
        }else{
        //  console.log("aa");
          this.seen = true;
        }
         this.edit(classify);
      },
      edit (record) {
          this.form.resetFields();
          this.model = Object.assign({}, {});
          this.visible = true;
          this.loadTreeData();
          this.model.parId = record!=null?record.toString():null;
          // this.$nextTick(() => {
          //   this.form.setFieldsValue(pick(this.model,'departName','departNameEn','departNameAbbr','departOrder','description','orgType','orgCode','mobile','fax','address','memo','status','delFlag'))
          // });
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
            that.confirmLoading = true;
            let formData = Object.assign(this.model, values);
            //时间格式化
            console.log(formData)
            httpAction(this.url.add,formData,"post").then((res)=>{
              if(res>0){
                that.$message.success("添加成功");
                // that.$message.success(res.message);
                that.loadTreeData();
                that.$emit('ok');
              }else{
                that.$message.warning("添加失败");
              }
            }).finally(() => {
              that.confirmLoading = false;
              that.close();
            })

          }
        })
      },
      handleCancel () {
        this.close()
      },
      // validateMobile(rule,value,callback){
      //   if (!value || new RegExp(/^1([38][0-9]|4[579]|5[0-3,5-9]|6[6]|7[0135678]|9[89])\d{8}$/).test(value)){
      //     callback();
      //   }else{
      //     callback("您的手机号码格式不正确!");
      //   }
      //
      // }
    }
  }
</script>

<style scoped>

</style>