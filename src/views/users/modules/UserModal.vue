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
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="用户名">
          <a-input placeholder="请输入用户名" v-decorator="['userName', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="密码"
          v-show="showPasswordBox"
        >
          <!-- type='password' -->
          <a-input placeholder="请输入密码" v-decorator="['password', {}]" />
        </a-form-item>

        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="创建时间"
          v-show="showDatePicker"
        >
          <a-date-picker
            showTime
            format="YYYY-MM-DD HH:mm:ss"
            v-decorator="[ 'createTime',{}]"
            placeholder="该字段由服务端自动生成"
          />
        </a-form-item>

        <!--<a-form-item-->
        <!--:labelCol="labelCol"-->
        <!--:wrapperCol="wrapperCol"-->
        <!--label="创建时间">-->
        <!--<a-input placeholder="请输入创建时间" v-decorator="['createTime', {}]" />-->
        <!--</a-form-item>-->

        <a-form-item label="用户角色" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-select
            mode="multiple"
            style="width: 100%"
            placeholder="请选择用户角色"
            optionFilterProp="children"
            v-model="selectedRole"
            :value="selectedRole"
          >
            <a-select-option
              v-for="(role,roleindex) in roleList"
              :key="roleindex.toString()"
              :value="role.roleId"
            >{{ role.roleName }}</a-select-option>
          </a-select>
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
// import { httpAction } from '@/api/manage'
import { getAction } from '@/api/manage'
import { addUser, editUser, queryUserRole, queryall, updatePwd } from '@/api/api'
import pick from 'lodash.pick'
import moment from 'moment'

export default {
  name: 'UserModal',
  data() {
    return {
      showPasswordBox: false,
      showDatePicker: false,
      title: '操作',
      visible: false,
      model: {},
      roleList: [], //下拉列表的值
      userList: [], //下拉列表的值
      selectedRole: [],
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
        add: '/Component/user/addUser',
        edit: '/Component/user/updateUser'
      }
    }
  },
  created() {
    // const token = Vue.ls.get(ACCESS_TOKEN);
    // this.headers = {"X-Access-Token":token}
  },

  methods: {
    initialRoleList() {
      queryall().then(res => {
        console.log(res);
        this.roleList = res
      });
    },
    add() {
      this.showPasswordBox = true
      this.edit({})
    },
    edit(record) {
      this.form.resetFields();
      let that = this;
      that.initialRoleList();
      that.userId = record.userId;
      this.model = Object.assign({}, record);
      if (JSON.stringify(record) != '{}') {
        //把时间戳转为时间
        this.model.createTime = this.$moment(record.createTime);

        //下拉框中选中的用户角色
        for (let i = 0; i < this.model.roles.length; i++) {
          const element = this.model.roles[i];
          this.selectedRole.push(element.roleId)
        }
      }

      this.visible = true
      this.$nextTick(() => {
        this.form.setFieldsValue(pick(this.model, 'userName', 'userRole', 'createTime'))
        //时间格式化
      })
    },
    updatePassword(record) {
      console.log('修改密码', record.userId)
      this.edit(record)
    },
    close() {
      this.$emit('close');
      this.visible = false;
      this.disableSubmit = false;
      this.selectedRole = [];
      this.showPasswordBox = false;
      this.showDatePicker = false
    },
    moment,
    handleSubmit() {
      if (this.disableSubmit) {
        this.close();
        return
      }
      const that = this;
      // 触发表单验证
      this.form.validateFields((err, values) => {
        if (!err) {
          that.confirmLoading = true;
          //收集表单数据
          let formData = {};

          formData.userName = values.userName;
          console.log(formData);
          //时间格式化
          let obj
          if (!this.model.userId) {
            formData.password = values.password //新增用户
            formData.lists = this.selectedRole
            obj = addUser(formData)
          } else {
            if (this.showPasswordBox) {
              formData.userId = this.model.userId
              formData.password = values.password //修改密码
              obj = updatePwd(formData)
            } else {
              formData.userId = this.model.userId //编辑权限
              formData.lists = this.selectedRole
              obj = editUser(formData)
            }
          }
          obj
            .then(res => {
              if (res.state >= 1) {
                that.$message.success(res.msg)
                that.$emit('ok')
              } else {
                that.$message.error(res.msg)
              }
            })
            .catch(err => {
              that.$message.error("出错了")
            })
            .finally(() => {
              that.confirmLoading = false
              that.close()
            })
        }
      })
    },
    handleCancel() {
      this.close()
    }
  }
}
</script>

<style lang="less" scoped>
</style>