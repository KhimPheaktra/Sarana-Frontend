import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { Button, Space, Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import type { SupplierType } from "./supplier.types";
import { useTranslation } from "react-i18next";

interface Props {
    data: SupplierType[];
    onEdit: (supplier: SupplierType) => void;
    onDelete: (supplier: SupplierType) => void;
}

const SupplierTable: React.FC<Props> = ({ data, onEdit, onDelete }) => {
    const { t } = useTranslation(["supplier", "common"]);

    const columns: ColumnsType<SupplierType> = [
        {
            title: t("table.id", { ns: "supplier" }),
            dataIndex: "supplier_id",
            key: "supplier_id",
            align: "center",
            sorter: (a, b) => a.supplier_id - b.supplier_id,
            defaultSortOrder: "ascend",
        },
        {
            title: t("table.name", { ns: "supplier" }),
            dataIndex: "name",
            key: "name",
            align: "center",
        },
        {
            title: t("table.phone", { ns: "supplier" }),
            dataIndex: "phone_number",
            key: "phone_number",
            align: "center",
        },
        {
            title: t("table.email", { ns: "supplier" }),
            dataIndex: "email",
            key: "email",
            align: "center",
        },
        {
            title: t("table.address", { ns: "supplier" }),
            dataIndex: "address",
            key: "address",
            align: "center",
        },
        {
            title: t("table.actions", { ns: "supplier" }),
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
            ),
        },
    ];

    return (
        <Table
            columns={columns}
            dataSource={data}
            pagination={{ pageSize: 10, simple: true }}
            scroll={{ x: "max-content" }}
            rowKey="supplier_id"
            locale={{ emptyText: t("table.noData", { ns: "supplier" }) }}
        />
    );
};

export default SupplierTable;