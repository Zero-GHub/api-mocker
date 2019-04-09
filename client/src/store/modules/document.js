/**
 * document 文档的状态维护
 * 用于编辑页/文档页
 */
import axios from 'axios'
import R from 'ramda'
import Api from '@/model/api'
import APIs from '@/config/api'
import { buildApiResponse } from '@/util'

const state = {
  api: {...Api()},
  apiUnsaved: false,
  mode: 'edit',
  reqParams: {
    query: {
      value: {},
      params: []
    },
    body: {
      value: {},
      params: []
    },
    path: {
      value: {},
      params: []
    }
  },
  response: {},
  diffMode: false,
  diffStack: null
}

const actions = {
  getApi ({ commit }, payload) {
    const { groupId, apiId } = payload
    return axios.get(APIs.API.replace(':groupId', groupId).replace(':apiId', apiId)).then(res => {
      const api = buildApiResponse(res.data.resources)
      commit('UPDATE_API', api)
      commit('SAVE_API')
    })
  }
}

const mutations = {
  INIT_API (state, groupId) {
    state.api = Api()
    state.api.group = groupId
  },
  UPDATE_API (state, data) {
    state.api = { ...data }
    state.apiUnsaved = true
  },
  SAVE_API (state) {
    state.apiUnsaved = false
  },
  CHANGE_MODE (state, mode) {
    state.mode = mode || (state.mode === 'edit' ? 'test' : 'edit')
  },
  UPDATE_RESPONSE (state, res) {
    state.response = res
  },
  UPDATE_API_PROPS (state, propValuePair) {
    const api = state.api || {}
    const prop = R.head(propValuePair)
    const value = R.last(propValuePair)
    const route = prop.split('.').map(p => {
      if (Number(p).toString() === p) {
        return Number(p)
      } else {
        return p
      }
    })
    state.api = R.assocPath(route, value, api)
    state.apiUnsaved = true
  }
}

const getters = {

}

export default {
  namespaced: true,
  state,
  actions,
  mutations,
  getters
}
