import { FieldValues, UseFormRegister } from "react-hook-form";
import { OptionType } from "../selection/selection-interface";

interface InterfaceComponent {
  control?: any;
  rowData: any;
  ColumnsData: any;
  register: UseFormRegister<FieldValues | any>;
  isFilter?: boolean;
  isUpdate?: boolean;
  isAssignTo?: boolean;
  isDate?: boolean;
  isArea?: boolean;
  deleteId: number | undefined;
  isDeleted?: boolean;
  isAdmin?: boolean;
  handleOpenCreate?: () => void;
  handleEdit?: ({ editId }: { editId: number }) => void;
  handleDelete?: ({ deleteId }: { deleteId: number }) => void;
  handleApplyFilter?: () => void;
  handleFilterOpen?: ((argu: boolean) => void) | undefined;
  isTableLoading: boolean;
  SelectOption?: OptionType;

  isExport?: boolean;
  fileName?: string;
  //   necessary
  isCreate: boolean;
  isFilterValid: boolean;
  headingText: string;
  headerPassage: string;
}

export { InterfaceComponent };
