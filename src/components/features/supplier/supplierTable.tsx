import { EditOutlined,DeleteOutlined } from "@ant-design/icons";
import { Button, Space, Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import type { SupplierType } from "./supplier.types";


interface Props {
    data: SupplierType[];
    onEdit: (item: SupplierType) => void;
    onDelete: (item: SupplierType) => void;
}
const SupplierTable:React.FC<Props> = ({ data, onEdit, onDelete }) => {
    const columns: ColumnsType<SupplierType> = [
        {
            title: "ID",
            dataIndex: "supplier_id",
            align: "center",
        },
   {
            title: "Name",
            dataIndex: "name",  
            key: "name",
            align: "center",
        },
           {
            title: "Phone",
            dataIndex: "phone_number",  
            key: "phone_number",
            align: "center",
        },
           {
            title: "Email",
            dataIndex: "email",  
            key: "email",
            align: "center",
        },
           {
            title: "Address",
            dataIndex: "address",  
            key: "address",
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
    return (
        <Table
            columns={columns}
            dataSource={data}
            pagination={{ pageSize: 10, simple: true }}
            scroll={{ x: 'max-content' }}
            rowKey="supplier_id"
        />
    );



};

export default SupplierTable;