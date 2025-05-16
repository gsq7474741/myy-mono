/**
 * 通用类型定义
 */

// 表单数据类型
export interface FormData {
  [key: string]: string | number | boolean | string[] | null | undefined | Record<string, unknown> | File | FileData;
}

// 文件数据类型
export interface FileData {
  name: string;
  size: number;
  type: string;
  url?: string;
}

// 表单提交事件类型
export interface FormSubmitEvent {
  preventDefault: () => void;
  target: {
    elements: {
      [key: string]: { value: string };
    };
  };
}

// 表单字段变更事件类型
export interface FieldChangeEvent {
  target: {
    name?: string;
    value: string | number | boolean;
    checked?: boolean;
  };
}

// 选项类型
export interface SelectOption {
  value: string;
  label: string;
}

// 分页参数类型
export interface PaginationParams {
  page: number;
  limit: number;
}

// 排序参数类型
export interface SortParams {
  field: string;
  direction: 'asc' | 'desc';
}

// 通用响应类型
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// 文件类型
export interface FileData {
  name: string;
  size: number;
  type: string;
  url?: string;
  file?: File;
}
