import { Button, Empty, Space, Table } from "antd";
import type { CusType } from "./cus.types";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import { useTranslation } from "react-i18next";

interface Props {
    data: CusType[];
    onEdit: (customer: CusType) => void;
    onDelete: (customer: CusType) => void;
}

const CustomerTable: React.FC<Props> = ({ data, onEdit, onDelete }) => {
    const { t } = useTranslation(["customer", "common"]);

    const columns: ColumnsType<CusType> = [
        {
            title: t("table.id", { ns: "customer" }),
            dataIndex: "id",
            key: "id",
            align: "center",
            sorter: (a, b) => a.id - b.id,
            defaultSortOrder: 'ascend',
        },
        {
            title: t("table.name", { ns: "customer" }),
            dataIndex: "name",
            key: "name",
            align: "center",
        },
        {
            title: t("table.phone", { ns: "customer" }),
            dataIndex: "phone_number",
            key: "phone_number",
            align: "center",
        },
        {
            title: t("table.email", { ns: "customer" }),
            dataIndex: "email",
            key: "email",
            align: "center",
        },
        {
            title: t("table.address", { ns: "customer" }),
            dataIndex: "address",
            key: "address",
            align: "center",
        },
        {
            title: t("table.actions", { ns: "customer" }),
            key: "actions",
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
            )
        }
    ];

    return (
        <Table
            columns={columns}
            dataSource={data}
            pagination={{ pageSize: 10, simple: true }}
            scroll={{ x: 'max-content' }}
            rowKey="id"
            locale={{ emptyText: <Empty description={t("table.noData", { ns: "customer" })} /> }}
            size="small"
        />
    );
};

export default CustomerTable;