export interface AppMenuItem {
  route?: string;
  children?: AppMenuItem[];
  key: string;
  icon?: React.ReactNode;
  label: React.ReactNode;
  hideInSidebar?: boolean;
}