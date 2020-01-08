<template>
  <a-modal
    :title="title"
    :width="800"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleSubmit"
    @cancel="handleCancel"
    cancelText="关闭"
  >
    <a-spin :spinning="confirmLoading">
      <a-form :form="form">
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="组件名称">
          <a-input placeholder="请输入组件名称" v-decorator="['comName', {}]" />
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="关键词">
          <a-input placeholder="请输入关键词" v-decorator="['keyWord', {}]" />
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="描述信息">
          <a-input placeholder="请输入描述信息" v-decorator="['desInfo', {}]" />
        </a-form-item>

        <a-form-item label="组件分类" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-select
            mode="multiple"
            style="width: 100%"
            placeholder="请选择组件分类"
            optionFilterProp="children"
            v-model="selectedTerm"
          >
            <a-select-option
              v-for="(term,termindex) in termList"
              :key="termindex.toString()"
              :value="term.termId"
            >{{ term.termName }}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="组件实体" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input placeholder v-decorator="['upfile', {}]" type="file" />
        </a-form-item>
        <a-form-item>
          <a-input v-decorator="['md5Value', {}]" style="display:none" />
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
import { queryTerm, uploadComponent } from '@/api/api'
import pick from 'lodash.pick'
import moment from 'moment'
import SparkMD5 from 'spark-md5'
export default {
  name: 'CenterModal',
  data() {
    return {
      title: '操作',
      visible: false,
      md5: '',
      model: {},
      termList: [], //下拉列表的值
      selectedTerm: [],
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 }
      },

      confirmLoading: false,
      form: this.$form.createForm(this),
      validatorRules: {},
      url: {
        uploads: `/Component/component/uploadComponent`
      }
    }
  },
  created() {},

  methods: {
    initialTermList() {
      queryTerm().then(res => {
        this.termList = res
      })
    },
    add() {
      this.edit({})
    },

    edit(record) {
      this.form.resetFields();
      let that = this;
      that.initialTermList();
      // that.userId = record.id;
      this.model = Object.assign({}, record);
      this.visible = true;
      this.$nextTick(() => {
        this.form.setFieldsValue(pick(this.model, 'comName', 'keyWord', 'desInfo'))
        //时间格式化
      })
    },
    close() {
      this.$emit('close');
      this.visible = false;

      this.disableSubmit = false;
      this.selectedTerm = []
    },
    moment,
    handleSubmit() {
      const that = this;
      // 触发表单验证
      this.form.validateFields((err, values) => {
        if (!err) {
          that.confirmLoading = true;
          this.computeMD5(values)
        }
      })
    },
    handleCancel() {
      this.close()
    },
    computeMD5(values) {
      var fileReader = new FileReader();
      let blobSlice = File.prototype.mozSlice || File.prototype.webkitSlice || File.prototype.slice;
      let file = document.querySelector('input[type=file]').files[0];
      let chunkSize = 2097152;
      // read in chunks of 2MB
      let chunks = Math.ceil(file.size / chunkSize);
      let currentChunk = 0;
      let spark = new SparkMD5();

      const that = this
      let formData = Object.assign(this.model, values);
      formData.terms = this.selectedTerm.length > 0 ? this.selectedTerm.join(',') : ''
      formData.upfile = document.querySelector('input[type=file]').files[0];
      fileReader.onload = function (e) {
        spark.appendBinary(e.target.result); // append binary string
        currentChunk++;

        if (currentChunk < chunks) {
          loadNext()
        } else {
          this.md5 = spark.end();
          var form = new window.FormData();
          form.append('comName', formData.comName);
          form.append('keyWord', formData.keyWord);
          form.append('desInfo', formData.desInfo);
          form.append('upfile', formData.upfile);
          form.append('terms', formData.terms);
          form.append('md5Value', this.md5);
          let obj
          obj = uploadComponent(form)
          obj
            .then(res => {
              if (res>0) {
                that.$message.success("上传成功");
                that.$emit('ok')
              } else {
                that.$message.warning("上传失败");
              }
            })
            .finally(() => {
              that.confirmLoading = false;
              that.close()
            })
        }
      }

      function loadNext() {
        var start = currentChunk * chunkSize,
          end = start + chunkSize >= file.size ? file.size : start + chunkSize
        fileReader.readAsBinaryString(blobSlice.call(file, start, end))
      }

      loadNext()
    }
  }
}
</script>
<style lang="less" scoped>
</style>