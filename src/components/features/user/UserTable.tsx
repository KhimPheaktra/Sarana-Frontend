import { Button, Space, Table, Tag } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import type { UserType } from "./user.types";

interface Props {
  data: UserType[];
  onEdit: (user: UserType) => void;
  onDelete: (user: UserType) => void;
}

const UserTable: React.FC<Props> = ({ data, onEdit, onDelete }) => {
  const columns: ColumnsType<UserType> = [
    {
      title: "ID",
      dataIndex: "id",
      align: "center",
      key: "id",
      sorter: (a, b) => a.id - b.id,
      defaultSortOrder: 'ascend',
    },
    {
      title: "Name",
      dataIndex: "name",
      key:"name",
      align: "center",
    },
    {
      title: "Role",
      dataIndex: "role",
      key:"role",
      align: "center",
   
    },
        {
      title: "Phone",
      dataIndex: "phone_number",
      key:"phone_number",
      align: "center",
   
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      align: "center",
      render: (status) => (
        <Tag color={status === "active" ? "green" : "red"}>
          {status}
        </Tag>
      ),
    },
    {
      title: "Actions",
      align: "center",
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
      rowKey="id"
    />
  );
};

export default UserTable;
