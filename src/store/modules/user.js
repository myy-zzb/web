import { logout } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import router, { resetRouter } from '@/router'

const state = {
  token: getToken(),
  name: '',
  avatar: '',
  introduction: '',
  id: null, // 新增字段
  roles: []
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_INTRODUCTION: (state, introduction) => {
    state.introduction = introduction
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  },
  SET_USERID: (state, userid) => {
    state.id = userid
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      // 模拟本地登录
      const mockUsers = {
        admin: { password: '111111' },
        editor: { password: '111111' },
        student: { password: '111111' }, // 新增用户: student
        student1: { password: '111111' }, // 新增用户: student1
        test: { password: 'test123' }
      }

      const user = mockUsers[username.trim()]
      if (!user || user.password !== password) {
        reject('Username or password is incorrect')
      } else {
        const token = username.trim() // 使用用户名作为 token
        commit('SET_TOKEN', token)
        setToken(token) // 存储 token 到 cookie
        resolve()
      }
    })
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      // 定义本地用户数据
      const mockUserData = {
        admin: {
          id: 1,
          roles: ['admin'],
          name: 'Super Admin',
          avatar: require('/images/admin.jpg'),
          introduction: 'I am a super administrator'
        },
        editor: {
          roles: ['editor'],
          name: 'Editor',
          avatar: '',
          introduction: 'I am an editor'
        },
        test: {
          roles: ['editor'],
          name: 'Test User',
          avatar: '',
          introduction: 'I am a test user'
        },
        student: {
          id: 2,
          roles: ['editor'], // 新增 student 角色
          name: 'student',
          avatar: require('/images/student.jpg'),
          introduction: 'I am a student'
        },
        student1: {
          id: 3,
          roles: ['editor'], // 新增 student 角色
          name: 'student1',
          avatar: require('/images/student1.jpg'),
          introduction: 'I am another student'
        }
      }

      // 根据 token 获取用户信息
      const userInfo = mockUserData[state.token] || null

      if (!userInfo) {
        reject('Verification failed, please Login again.')
      } else {
        const { id, roles, name, avatar, introduction } = userInfo

        console.log('User Info:', userInfo)
        console.log('ID:', id)

        // 检查 roles 是否为非空数组
        if (!roles || roles.length <= 0) {
          reject('getInfo: roles must be a non-null array!')
        }

        // 提交用户信息到 Vuex
        commit('SET_ROLES', roles)
        commit('SET_NAME', name)
        commit('SET_AVATAR', avatar)
        commit('SET_INTRODUCTION', introduction)
        commit('SET_USERID', id)
        resolve(userInfo)
      }
    })
  },

  // user logout
  logout({ commit, state, dispatch }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        commit('SET_TOKEN', '')
        commit('SET_ROLES', [])
        removeToken()
        resetRouter()

        // reset visited views and cached views
        // to fixed https://github.com/PanJiaChen/vue-element-admin/issues/2485
        dispatch('tagsView/delAllViews', null, { root: true })

        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      commit('SET_ROLES', [])
      removeToken()
      resolve()
    })
  },

  // dynamically modify permissions
  async changeRoles({ commit, dispatch }, role) {
    const token = role + '-token'

    commit('SET_TOKEN', token)
    setToken(token)

    const { roles } = await dispatch('getInfo')

    resetRouter()

    // generate accessible routes map based on roles
    const accessRoutes = await dispatch('permission/generateRoutes', roles, { root: true })
    // dynamically add accessible routes
    router.addRoutes(accessRoutes)

    // reset visited views and cached views
    dispatch('tagsView/delAllViews', null, { root: true })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
