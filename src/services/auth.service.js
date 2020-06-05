import requestService from './request.service'
export default {
  async getToken(){
     return localStorage.getItem('token');
  },

  async getUser(id){
    const user = (await requestService.get(`/users/${id}`)).data;
    
    if(user){
      return {
        id: user.id,
        login: user.login,
      } 
    }
    else{
      return null;
    }
  },
  
  async signIn(login, password){
    //Симуляция входа на фронте
    let users = (await requestService.get('/users/')).data;
    const user = users.find(u => u.login === login && u.password === password);//Имитация входа
    
    if(user){
      localStorage.setItem('token', user.id);//Используем user id вместо токена, для имитации входа
      return { 
        user:{
          id:user.id,
          login: user.login,
        } 
      }
    }
    else{
      localStorage.removeItem('token');
      return;
    }
  },

  async signOut(){
    localStorage.removeItem('token');
  }
}


