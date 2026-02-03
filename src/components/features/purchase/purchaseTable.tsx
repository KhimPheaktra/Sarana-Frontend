import type { ColumnsType } from "antd/es/table";
import type { PurchaseType } from "./purchase.types";
import { Space, Table } from "antd";
import { Button } from "antd";
import { EyeOutlined,EditOutlined,DeleteOutlined } from "@ant-design/icons";


interface Props {
    data: PurchaseType[];
    onView: (purchase: PurchaseType) => void;
    onEdit: (purchase: PurchaseType) => void;
    onDelete: (purchase: PurchaseType) => void;
}
const PurchaseTable:React.FC<Props> = ({ data, onView, onEdit, onDelete }) => {
    const columns: ColumnsType<PurchaseType> = [
        {
            title: "ID",
            dataIndex: "purchase_id",
            key: "purchase_id",
            align: "center",
            sorter: (a, b) => a.purchase_id - b.purchase_id,
            defaultSortOrder: 'ascend',
        },
        {
            title: "Supplier ID",
            dataIndex: "supplier_id",
            key: "supplier_id",
            align: "center",
        },
        {
            title: "Purchase Date",
            dataIndex: "purchase_date",
            key: "purchase_date",
            align: "center",
        },
        {
            title: "Item Id",
            dataIndex: "item_id",
            key: "item_id",
            align: "center",
        },
        {
            title: "Quantity",
            dataIndex: "quantity",
            key: "quantity",
            align: "center",
        },
        {
            title: "Unit Price",
            dataIndex: "unit_price",   
            key: "unit_price",
            align: "center",
        },
        {
            title: "Subtotal",
            dataIndex: "subtotal",
            key: "subtotal",
            align: "center",
        },
        {
            title: "Total Amount",
            dataIndex: "total_amount",
            key: "total_amount",
            align: "center",
        },
       
           {
            title: "Actions",
            key: "actions",
            align: "center",
            render: (_, record) => (
                <Space>
                    <Button type="primary" onClick={() => onView(record)}>
                        <EyeOutlined /> View
                        </Button>
                    <Button type="primary" onClick={() => onEdit(record)}>
                        <EditOutlined /> Edit
                        </Button>
                    <Button danger onClick={() => onDelete(record)}>
                        <DeleteOutlined /> Delete
                    </Button>
                </Space>
            )
        }

    ];

    return (
        <Table
            columns={columns}
            dataSource={data}
            pagination={{ pageSize: 10,simple: true }}
            scroll={{x: 'max-content'}}
            rowKey="purchase_id"
        />
    );

};

export default PurchaseTable;