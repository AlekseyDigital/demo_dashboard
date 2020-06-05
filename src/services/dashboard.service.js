import requestService from './request.service';
export default {
  async getDiagrams(userId){//Имитируем проверку пользователя на сервере, нам нужны только настроенные диаграммы для текущего пользователя
    const response = (await requestService.get(`/diagrams?_sort=order&_order=asc&user=${userId}`));
    return { 
      data: response.data, 
      total: Number(response.headers['x-total-count'] || 0)
    }
  },

  async getDiagram(id){
    const response = (await requestService.get(`/diagrams/${id}`));
    return response.data;
  },

  async addDiagram(diagram){
    const response = (await requestService.post(`/diagrams/`, JSON.stringify({
      id:`${Math.floor(Math.random() * 1000000)}`,//Имитируем генерацию id
      ...diagram
    })));
    return response.data;
  },

  async updateDiagram(diagram){
    const response = (await requestService.put(`/diagrams/${diagram.id}`, JSON.stringify(diagram)));
    return response.data;
  },

  async deleteDiagram(id){
    const response = await requestService.delete(`/diagrams/${id}`);
    return response.data;
  },

  async sortDiagrams(diagrams){
    diagrams.forEach((item) => {
      this.updateDiagram(item);
    })
  }
}


