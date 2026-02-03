import type { MenuProps } from "antd";
import type { AppMenuItem } from "./menuItem";

type AntdMenuItem = Required<MenuProps>["items"][number];

export const mapToAntdMenuItems = (
  items: AppMenuItem[]
): AntdMenuItem[] =>
  items.map((item) => ({
    key: item.key,
    icon: item.icon,
    label: item.label,
    children: item.children
      ? mapToAntdMenuItems(item.children)
      : undefined,
  }));
