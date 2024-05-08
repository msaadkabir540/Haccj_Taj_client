import { OptionType } from "../selection/selection-interface";

interface InterfaceComponent {
  control?: any;
  rowData: any;
  ColumnsData: any;
  isFilter?: boolean;
  isDate?: boolean;
  handleOpenCreate?: () => void;
  handleApplyFilter?: () => void;
  handleFilterOpen?: ((argu: boolean) => void) | undefined;
  isTableLoading: boolean;
  SelectOption?: OptionType;
  //   necessary
  isCreate: boolean;
  isFilterValid: boolean;
  headingText: string;
  headerPassage: string;
}

export { InterfaceComponent };
