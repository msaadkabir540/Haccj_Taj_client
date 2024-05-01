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
  created_by?: number;
  temperature_value: string;
}

export { UserTableRows, WidgetTableRows, RowsInterface, WedgetRowInterface };
