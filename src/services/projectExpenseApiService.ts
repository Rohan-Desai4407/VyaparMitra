const API_BASE_URL = 'http://localhost:3001/api';

export interface ExpenseItem {
  id?: string;
  category: string;
  itemName: string;
  description?: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  amount: number;
  pricingSource: string;
  pricingSourceUrl?: string;
  isOptional: boolean;
  isCustom?: boolean;
}

export const projectExpenseApiService = {
  getTemplates: async (categoryId: string, scale: string = 'MEDIUM', location?: string, capital?: number, categoryName?: string) => {
    let url = API_BASE_URL + '/project-cost/templates?categoryId=' + categoryId + '&scale=' + scale;
    if (location) url += '&location=' + encodeURIComponent(location);
    if (capital) url += '&capital=' + capital;
    if (categoryName) url += '&categoryName=' + encodeURIComponent(categoryName);
    const res = await fetch(url);
    return res.json();
  },
  
  getPricing: async () => {
    const res = await fetch(API_BASE_URL + '/project-cost/pricing');
    return res.json();
  },

  getProjectExpenses: async (assessmentId: string) => {
    const token = localStorage.getItem('token') || '';
    const res = await fetch(API_BASE_URL + '/project-cost/' + assessmentId, {
      headers: { 'Authorization': 'Bearer ' + token }
    });
    return res.json();
  },

  saveProjectExpenses: async (assessmentId: string, expenses: ExpenseItem[]) => {
    const token = localStorage.getItem('token') || '';
    const res = await fetch(API_BASE_URL + '/project-cost/' + assessmentId + '/save', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      },
      body: JSON.stringify({ expenses })
    });
    return res.json();
  }
};

