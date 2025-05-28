import serviceAxios from '../utils/request'

export const getItems = (params: any): any => {
  return serviceAxios({
    url: "/integral_goods/items",
    method: "get",
    params,
  });
};



export const itemDetail = (item_id: any): any => {
  return serviceAxios({
    url: `/integral_goods/items/${item_id}`,
    method: "get",
  });
};


export const getArticles = (): any => {
  return serviceAxios({
    url: `/help_center/articles`,
    method: "get",
  });
};


export const getArticleDetail = (id: any): any => {
  return serviceAxios({
    url: `/help_center/articles/${id}`,
    method: "get",
  });
};


export const sendOrder = (item_id: any, data: any): any => {
  return serviceAxios({
    url: `/integral_goods/items/${item_id}/order`,
    method: "post",
    data: data
  });
};


export const getOrder = (order_id: any): any => {
  return serviceAxios({
    url: `/user/integral_orders/${order_id}`,
    method: "get",
  });
};

export interface getOrderListParams {
  /**
   * 页码
   */
  page?: number;
  /**
   * 页大小
   */
  pageSize?: number;
  /**
   * 状态 pending,processing,completed,failed,cancelled 为空获取全部
   */
  status?: string;
}

export const getOrderList = (params: getOrderListParams): any => {
  return serviceAxios({
    url: `/user/integral_orders`,
    method: "get",
    params
  });
};


export const cancelOrder = (orderId: string): any => {
  return serviceAxios({
    url: `/user/integral_orders/${orderId}/cancel`,
    method: "put",
  });
};

export const removeOrder = (orderId: string): any => {
  return serviceAxios({
    url: `/user/integral_orders/${orderId}`,
    method: "delete",
  });
};


export const reOrder = (orderId: any, data: any): any => {
  return serviceAxios({
    url: `/user/integral_orders/${orderId}/reorder`,
    method: "post",
    data: data
  });
};


export const getLotteryItems = (): any => {
  return serviceAxios({
    url: `/integral_lottery/items`,
    method: "get",
  });
};


export const sendSpin = (): any => {
  return serviceAxios({
    url: `/integral_lottery/spin`,
    method: "post",
  });
};


export const getRecords = (params: any): any => {
  return serviceAxios({
    url: `/integral_lottery/records`,
    method: "get",
    params
  });
};
