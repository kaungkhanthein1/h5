export interface ApiData {
  data: GoodsData;
  msg: string;
}

export interface GoodsData {
  /**
   * 商品列表
   */
  list: List[];
  /**
   * 页码
   */
  page: number;
  /**
   * 页大小
   */
  pageSize: number;
  /**
   * 总数
   */
  total: number;
}

export interface List {
  /**
   * 创建时间
   */
  create_time: number;
  /**
   * 现价
   */
  current_price: number;
  /**
   * 折扣
   */
  discount: number;
  /**
   * 商品ID
   */
  id: number;
  /**
   * 图片
   */
  image: string;
  /**
   * 标签
   */
  label: string;
  /**
   * 原价
   */
  original_price: number;
  /**
   * 库存
   */
  stock: number;
  /**
   * 标题
   */
  title: string;
  require_coupon : number
}

export interface DetailData {
  data: any;
  label: string;

  /**
   * 创建时间
   */
  create_time: number;
  /**
   * 现价
   */
  current_price: number;
  /**
   * 自定义表单
   */
  custom_form: CustomForm[];
  /**
   * 折扣
   */
  discount: number;
  /**
   * 商品ID
   */
  id: number;
  /**
   * 商品图
   */
  image: string;
  /**
   * 商品描述
   */
  introduction: string;
  /**
   * 原价
   */
  original_price: number;
  /**
   * 库存
   */
  stock: number;
  /**
   * 商品标题
   */
  title: string;
  /**
   * 浏览量
   */
  view: number;
  require_coupon: number;
}

export interface CustomForm {
  /**
   * 输入框名称
   */
  name?: string;
  /**
   * 输入框占位
   */
  placeholder?: string;
  /**
   * 是否必填
   */
  required?: number;
  /**
   * 输入框类型
   */
  type?: string;
  /**
   * 默认值
   */
  value?: string;
}
