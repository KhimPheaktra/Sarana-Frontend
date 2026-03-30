import { Button, Space, Table, Tag } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import type { CatalogItemType } from "./catalogItem.types";
import { useTranslation } from "react-i18next";

interface Props {
  data: CatalogItemType[];
  onEdit: (item: CatalogItemType) => void;
  onDelete: (item: CatalogItemType) => void;
}

const CatalogItemTable: React.FC<Props> = ({ data, onEdit, onDelete }) => {
  const { t } = useTranslation(["catalogItem", "common"]);

  const columns: ColumnsType<CatalogItemType> = [
    {
      title: t("table.id", { ns: "catalogItem" }),
      dataIndex: "item_id",
      align: "center",
      key: "item_id",
      sorter: (a, b) => a.item_id - b.item_id,
      defaultSortOrder: "ascend",
    },
    {
      title: t("table.itemType", { ns: "catalogItem" }),
      dataIndex: "item_type",
      key: "item_type",
      align: "center",
    },
    {
      title: t("table.name", { ns: "catalogItem" }),
      dataIndex: "name",
      key: "name",
      align: "center",
    },
    {
      title: t("table.description", { ns: "catalogItem" }),
      dataIndex: "description",
      key: "description",
      align: "center",
    },
    {
      title: t("table.price", { ns: "catalogItem" }),
      dataIndex: "price",
      key: "price",
      align: "center",
      render: (value: number) =>
        new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(value),
    },
    {
      title: t("table.purchasePrice", { ns: "catalogItem" }),
      dataIndex: "purchase_price",
      key: "purchase_price",
      align: "center",
      render: (value: number) =>
        new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(value),
    },
    {
      title: t("table.stockQuantity", { ns: "catalogItem" }),
      dataIndex: "stock_quantity",
      key: "stock_quantity",
      align: "center",
    },
    {
      title: t("table.status", { ns: "catalogItem" }),
      dataIndex: "is_active",
      key: "is_active",
      align: "center",
      render: (is_active: boolean) => (
        <Tag color={is_active ? "green" : "red"}>
          {is_active ? t("active", { ns: "catalogItem" }) : t("inactive", { ns: "common" })}
        </Tag>
      ),
    },
    {
      title: t("table.actions", { ns: "catalogItem" }),
      align: "center",
      key: "action",
      render: (_, record) => (
        <Space>
          <Button type="primary" onClick={() => onEdit(record)}>
            <EditOutlined /> {t("button.edit", { ns: "common" })}
          </Button>
          <Button danger onClick={() => onDelete(record)}>
            <DeleteOutlined /> {t("button.delete", { ns: "common" })}
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={data}
      pagination={{ pageSize: 10, simple: true }}
      scroll={{ x: "max-content" }}
      rowKey="item_id"
      size="small"
      locale={{ emptyText: t("table.noData") }}
    />
  );
};

export default CatalogItemTable;