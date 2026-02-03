
import type { PaymentType } from "./payment.types";
import { Button, Space, Table, Tag } from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";


interface Props{
    data: PaymentType[];
    onEdit: (payment: PaymentType) => void;
    onDelete: (payment: PaymentType) => void;
}

const PaymentTable:React.FC<Props> = ({ data, onEdit, onDelete }) => {
  
    const columns: ColumnsType<PaymentType> = [
        {
            title: "ID",
            dataIndex: "payment_id",
            key: "payment_id",
            align: "center",
            sorter: (a, b) => a.payment_id - b.payment_id,
            defaultSortOrder: 'ascend',
        },
        {
            title: "Customer",
            dataIndex: "customer_name",
            key: "customer_name",
            align: "center",
        },
        {
            title: "Payment Type",
            dataIndex: "payment_type",
            key: "payment_type",
            align: "center",
        },
        {
            title: "Reference ID",
            dataIndex: "reference_id",
            key: "reference_id",
            align: "center",
        },
        {
            title: "Amount",
            dataIndex: "amount",
            key: "amount",
            align: "center",
        },
        {
            title: "Payment Date",
            dataIndex: "payment_date",
            key: "payment_date",
            align: "center",
        },
        {
            title: "Status",
            dataIndex: "status",
            key: "status",
            align: "center",
            render: (status) => (
            <Tag color={status === "Completed" ? "green" : status === "Pendding" ? "yellow" : "default"}>
            {status}
            </Tag>
        ),
        },
        {
            title:"Partial",
            dataIndex:"partial_percentage",
            key:"partial_percentage",
            align:"center", 
        },
        {
            title: "Note",
            dataIndex: "note",
            key: "note",
            align: "center",
        },
         {
            title: "Actions",
            key: "actions",
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
            )
        }

    ];

    return(
        <Table
        columns={columns}
        dataSource={data}
        rowKey="payment_id"
        pagination={{ pageSize: 10,simple:true }}
        scroll={{x: 'max-content'}}
        />
    )
};

export default PaymentTable;