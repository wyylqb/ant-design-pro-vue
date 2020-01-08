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
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="角色名">
          <a-input placeholder="请输入角色名" v-decorator="['roleName', {}]" />
        </a-form-item>

        <a-form-item label="角色权限" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-select
            mode="multiple"
            style="width: 100%"
            placeholder="请选择角色权限"
            optionFilterProp="children"
            v-model="selectedMenu"
            :value="selectedMenu"
          >
            <a-select-option
              v-for="(menu,menuindex) in menuList"
              :key="menuindex.toString()"
              :value="menu.menuId"
            >{{ menu.title }}</a-select-option>
          </a-select>
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
import { getAction } from '@/api/manage'
import { addRole, editRole, queryUserRole, queryall, updatePwd,queryallMenus } from '@/api/api'
import pick from 'lodash.pick'
import moment from 'moment'

export default {
  name: 'RoleModal',
  data() {
    return {
      showPasswordBox: false,
      showDatePicker: false,
      title: '操作',
      visible: false,
      model: {},
      menuList: [], //下拉列表的值
      roleList: [], //下拉列表的值
      selectedMenu: [],
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
    }
  },
  created() {
  },

  methods: {
    initialMenuList() {
      queryallMenus().then(res => {
        console.log(res);
        this.menuList = res
      });
    },

    add() {
      this.edit({})
    },
    edit(record) {
      this.form.resetFields();
      let that = this;
      that.initialMenuList();
      that.roleId = record.roleId;
      this.model = Object.assign({}, record);
      if (JSON.stringify(record) != '{}') {
        //把时间戳转为时间
        this.model.createTime = this.$moment(record.createTime);
        //下拉框中选中的角色权限
        for (let i = 0; i < this.model.menus.length; i++) {
          const element = this.model.menus[i];
          this.selectedMenu.push(element.menuId);
        }
      }
      this.visible = true;
      this.$nextTick(() => {
        this.form.setFieldsValue(pick(this.model, 'roleName', 'roleMenu'))
        //时间格式化
      })
    },
    close() {
      this.$emit('close');
      this.visible = false;
      this.disableSubmit = false;
      this.selectedMenu = [];
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
          formData.roleName = values.roleName;
          console.log(formData);
          //时间格式化
          let obj
          if (!this.model.roleId) {
            formData.menuIds = this.selectedMenu;
            obj = addRole(formData)
          } else {
            formData.roleId = this.model.roleId; //编辑权限
            formData.menuIds = this.selectedMenu;
            obj = editRole(formData)
          }
          obj.then(res => {
              if (res >= 1) {
                that.$message.success("success");
                that.$emit('ok')
              } else {
                that.$message.error("error");
              }
            })
            .finally(() => {
              that.confirmLoading = false;
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