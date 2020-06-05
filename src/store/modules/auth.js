import authService from '@/services/auth.service.js';
export default {
  namespaced: true,
  state: {
    currentUser:null,
    token: localStorage.getItem('token') || null
  },
  getters:{
    isAuthenticated: state => !!state.token,
    userIsWriter: (state, getters) => {
      return (state.currentUser && state.currentUser.role === 'writer');
    },
    userIsReader: (state, getters) => {
      return (state.currentUser && (state.currentUser.role === 'writer' || state.currentUser.role === 'reader'));
    }
  },
  mutations: {
    setUser(state, user){
      state.currentUser = user;
    },
    setToken(state, token){
      state.token = token;
    },
    clearToken(state){
      state.token = null;
    }
  },
  actions: {
    async CheckToken({ commit }){
        const token = await authService.getToken();
        if(token){
          const user = await authService.getUser(token);
          commit('setToken', token);
          commit('setUser', user);
        }
    },
    async LogIn({ commit }, { login, password }){
        let { user } = await authService.signIn(login, password);
        
        //Получаем условный токен, роль которого выполняет userid и записываем
        commit('setToken', user.id);
        commit('setUser', user);
    },
    async LogOut({ commit }){
      await authService.signOut();
      commit('clearToken');
    }
  },
}
