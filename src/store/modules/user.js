import Vue from 'vue'
import { login, getInfo, logout } from '@/api/login'
import { ACCESS_TOKEN } from '@/store/mutation-types'
import { welcome } from '@/utils/util'

const user = {
  state: {
    token: '',
    name: '',
    welcome: '',
    avatar: '',
    roles: [],
    info: {},
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_NAME: (state, { name, welcome }) => {
      state.name = name
      state.welcome = welcome
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    SET_INFO: (state, info) => {
      state.info = info
    },
  },

  actions: {
    // 登录
    Login ({ commit }, userInfo) {
      return new Promise((resolve, reject) => {
        login(userInfo).then(response => {
          // console.log("111");
          // console.log(response);
          const result = response;
          Vue.ls.set(ACCESS_TOKEN, result.token, 7 * 24 * 60 * 60 * 1000);
          commit('SET_TOKEN', result.token);
          commit('SET_INFO', result)
          commit('SET_NAME', {name:result.user.userName});
          commit('SET_ROLES',result.currentUserRole);
          // commit('SET_AVATAR', '/avatar2.jpg');
          console.log(result.user.userName);
          resolve();
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 获取用户信息
    GetInfo ({ commit }) {
      return new Promise((resolve, reject) => {
        const token = Vue.ls.get(ACCESS_TOKEN);
        console.log('token',token);
        const params={token:token};
        getInfo(params).then(response => {
          console.log('获取用户权限信息',response);
          let permission=[];
          for (let i = 0; i < response.length; i++) {
            const element = response[i].menuName;
            permission.push(element);
          }
          // permission.push('user');
          // permission.push('roles');
          commit('SET_ROLES', permission);
          resolve(permission)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 登出
    Logout ({ commit, state }) {
      return new Promise((resolve) => {
        logout(state.token).then(() => {
          resolve()
        }).catch(() => {
          resolve()
        }).finally(() => {
          commit('SET_TOKEN', '');
          commit('SET_ROLES', []);
          commit('SET_ROUTER', []);
          Vue.ls.remove(ACCESS_TOKEN);
          localStorage.clear();
          window.open('/user/login','_self');
        })
      })
    }

  }
}

export default user
