interface TryNowFormInterface {
  email: string;
  contactNumber: string;
  employeecode: string;
  contact_no: string;
  address: string;
  department: string;
  name: string;
}
const defaultFormValues = {
  email: "",
  contactNumber: "",
  employeecode: "",
  contact_no: "",
  address: "",
  department: "",
  name: "",
};

interface EmployeeDataInterface {
  id: number;
  employeecode: number;
  name: string;
  email: string;
  dob: string;
  contact_no: string;
  address: string;
  department: string;
  isadmin: number;
  quit: string;
  quit_date: string;
  CREATED_AT: string;
  updated_at: string;
}

export { defaultFormValues, TryNowFormInterface, EmployeeDataInterface };
