import { Button, Space, Table, Tag } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import type { CatalogItemType } from "./catalogItem.types";
interface Props {
  data: CatalogItemType[];
  onEdit: (item: CatalogItemType) => void;
  onDelete: (item: CatalogItemType) => void;
}

const CatalogItemTable: React.FC<Props> = ({ data, onEdit, onDelete }) => {
  const columns: ColumnsType<CatalogItemType> = [
    {
      title: "ID",
      dataIndex: "item_id",
      align: "center",
      key: "item_id",
      sorter: (a, b) => a.item_id - b.item_id,
      defaultSortOrder: 'ascend',
    },
    {
        title: "Item Type",
        dataIndex: "item_type",
        key: "item_type",
        align: "center",
    },
    {
        title: "Name",
        dataIndex: "name",
        key: "name",
        align: "center",
    
    },
    {
        title: "Description",
        dataIndex: "description",
        key: "description",
        align: "center",

    },
    {
        title: "Price",
        dataIndex: "price",
        key: "price",
        align: "center",
    },
    {
        title: "Purchase Price",
        dataIndex: "purchase_price",
        key: "purchase_price",
        align: "center",
    },

    {
        title: "Stock Quantity",
        dataIndex: "stock_quantity",
        key: "stock_quantity",
        align: "center",
    },
    {
      title: "Active",
      dataIndex: "is_active", 
      key: "is_active",
      align: "center",
      render: (is_active) => (
        <Tag color={is_active ? "green" : "red"}>
          {is_active ? "Active" : "Inactive"}
        </Tag>
      ),
    },
    {
      title: "Actions",
      align: "center",
      key: "action",
      render: (_, record) => (
        <Space>
          <Button type="primary" onClick={() => onEdit(record)}>
            <EditOutlined /> Edit
          </Button>
          <Button danger onClick={() => onDelete(record)}>
            <DeleteOutlined /> Delete
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={data}
      pagination={{ pageSize: 10,simple: true }}
      scroll={{x: 'max-content'}}
      rowKey="item_id"
    />
  );
};

export default CatalogItemTable;
