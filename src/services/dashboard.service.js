import requestService from './request.service';
export default {
  async getDashboards(userId){//Имитируем проверку пользователя на сервере, нам нужны только настроенные диаграммы для текущего пользователя
    const response = await requestService.get(`/dashboards?_sort=id&_order=asc&userId=${userId}`);
    return response.data;
  },

  async getDashboard(id){
    const response = (await requestService.get(`/dashboards/${id}`)).data;
    return response;
  },

  async addDashboard(dashboard){
    const response = (await requestService.post(`/dashboards`, JSON.stringify(dashboard))).data;
    return response;
  },

  async updateDashboard(dashboard){
    const response = (await requestService.put(`/dashboards/${dashboard.id}`, JSON.stringify(dashboard))).data;
    return response;
  },

  async deleteDashboard(id){
    return (await requestService.delete(`/dashboards/${id}`)).data;
  },

  async getDiagrams(dashboardId){
    const response = (await requestService.get(`/diagrams?_sort=order&_order=asc&dashboardId=${dashboardId}`));
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
    const response = await requestService.post(`/diagrams/`, JSON.stringify(diagram));
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


