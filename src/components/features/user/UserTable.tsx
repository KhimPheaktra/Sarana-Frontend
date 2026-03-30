import { Button, Space, Table, Tag } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import type { UserType } from "./user.types";
import { useTranslation } from "react-i18next";

interface Props {
  data: UserType[];
  onEdit: (user: UserType) => void;
  onDelete: (user: UserType) => void;
}

const UserTable: React.FC<Props> = ({ data, onEdit, onDelete }) => {
  const { t } = useTranslation(["user", "common"]);

  const columns: ColumnsType<UserType> = [
    {
      title: t("table.id", { ns: "user" }),
      dataIndex: "id",
      align: "center",
      key: "id",
      sorter: (a, b) => a.id - b.id,
      defaultSortOrder: "ascend",
    },
    {
      title: t("table.name", { ns: "user" }),
      dataIndex: "username",
      key: "username",
      align: "center",
    },
    {
      title: t("table.role", { ns: "user" }),
      dataIndex: "role",
      key: "role",
      align: "center",
    },
    {
      title: t("table.phone", { ns: "user" }),
      dataIndex: "phone_number",
      key: "phone_number",
      align: "center",
    },
    {
      title: t("table.status", { ns: "user" }),
      dataIndex: "status",
      key: "status",
      align: "center",
      render: (status) => (
        <Tag color={status === "active" ? "green" : "red"}>
          {status === "active" ? t("status.active", { ns: "user" }) : t("status.inactive", { ns: "user" })}
        </Tag>
      ),
    },
    {
      title: t("table.actions", { ns: "user" }),
      align: "center",
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
      rowKey="id"
      locale={{ emptyText: t("table.noData", { ns: "user" }) }}
    />
  );
};

export default UserTable;