interface UserTableRows {
  _id: string;
  id?: string;
  status: boolean;
  username: string;
  email: string;
  roles: string[];
  updatedAt: string;
  actions?: string;
}
interface WedgetRowInterface {
  _id: string;
  actions?: string;
  updatedAt: string;
  description: string;
  templateName: string;
  mediaFilesCount: number;
  templateVideoUrl?: string;
  templateVideoThumbnailUrl?: string;
}

interface WidgetTableRows {
  name: string;
  active: boolean;
  _id: string;
  id?: string;
  status: boolean;
  role: string;
}

interface RowsInterface {
  id: number;
  employeecode?: number;
  name?: string;
  cleaning_area?: string;
  created_by_name?: string;
  assign_start?: string;
  assign_end?: string;
  product_name?: string;
  expire_at?: string;
  assign_to_name?: string;
  decision?: string;
  task?: string;
  message?: string;
  machine_name?: string;
  machine_type?: string;
  oil_temperature?: string;
  employeeName?: string;
  email?: string;
  dob?: string;
  contact_no?: string;
  address?: string;
  department?: string;
  isadmin?: number;
  quit?: string;
  quit_date?: string;
  CREATED_AT?: string;
  updated_at?: string;
  actions?: any;
  equipment_name?: string;
  product_type?: string;
  created_by?: number;
  index?: number;
  temperature_value: string;

  trasability_name?: string;
  trasability_type?: string;
  image: string;
  image_name?: string;
  created_at?: string;
}

export { UserTableRows, WidgetTableRows, RowsInterface, WedgetRowInterface };
