import { FieldValues, UseFormRegister } from "react-hook-form";
import { OptionType } from "../selection/selection-interface";

interface InterfaceComponent {
  control?: any;
  rowData: any;
  ColumnsData: any;
  register: UseFormRegister<FieldValues | any>;
  isFilter?: boolean;
  isUpdate?: boolean;
  isDate?: boolean;
  isArea?: boolean;
  isDeleted?: boolean;
  handleOpenCreate?: () => void;
  handleEdit?: ({ editId }: { editId: number }) => void;
  handleDelete?: ({ deleteId }: { deleteId: number }) => void;
  handleApplyFilter?: () => void;
  handleFilterOpen?: ((argu: boolean) => void) | undefined;
  isTableLoading: boolean;
  SelectOption?: OptionType;
  deleteId?: number;

  isExport?: boolean;
  fileName?: string;
  //   necessary
  isCreate: boolean;
  isFilterValid: boolean;
  headingText: string;
  headerPassage: string;
}

export { InterfaceComponent };
