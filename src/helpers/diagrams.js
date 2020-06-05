export const  allowedTypes = {
  line:{
    id:'line',
    name:'Линейная диаграмма'
  }, 
  area:{
    id:'area',
    name:'Диаграмма с областями'
  }, 
  bar:{
    id:'bar',
    name:'Гистограмма'
  }, 
  pie:{
    id:'pie',
    name:'Круговая диаграмма'
  }
};

export const allowedEndpoints = [
  {
    id:1,
    name:'ВВП стран мира за 2019 год',
    endpoint:`${process.env.VUE_APP_API_BASE_URL}/statistics/1`,
    fn:(data) => {
      return data;
    }
  },
  {
    id:2,
    name:'Стоимость нефти',
    endpoint:`${process.env.VUE_APP_API_BASE_URL}/statistics/2`,
    fn:(data) => {
      return data;
    },
  },
  {
    id:3,
    name:'Доля windows 10 и windows 7 в мире за 2019 год',
    endpoint:`${process.env.VUE_APP_API_BASE_URL}/statistics/3`,
    fn:(data) => {
      return data;
    },
  }
]



