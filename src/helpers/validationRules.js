export const rulesChartForm = {
  name: [
    { required: true, message: 'Укажите название графика', trigger: 'blur' },
    { min: 3, message: 'Количество символов должно быть больше 3', trigger: 'blur' }
  ],
  type: [
    { required: true, message: 'Укажите тип графика', trigger: 'change' }
  ],
  resourceId: [
    { required: true, message: 'Укажите источник данных', trigger: 'change' }
  ],
}

export const rulesLoginForm = {
  login: [
    { required: true, message: 'Введите логин', trigger: 'blur' },
    { type: 'email', message: 'Введите корректный email', trigger: ['blur', 'change'] }
  ],
  password: [
    { 
      required: true, 
      message: 'Введите пароль', 
      trigger: 'blur' 
    }
  ],
}

export const rulesDashboardForm = {
  name: [
    { required: true, message: 'Укажите название панели', trigger: 'blur' },
    { min: 3, message: 'Количество символов должно быть больше 3', trigger: 'blur' }
  ],
}