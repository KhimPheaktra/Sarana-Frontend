import { Button, Space, Table } from "antd";
import type { CusType } from "./cus.types";
import { EditOutlined,DeleteOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";


interface Props {
    data: CusType[];
    onEdit: (customer: CusType) => void;
    onDelete: (customer: CusType) => void;
}

const CustomerTable:React.FC<Props> = ({ data, onEdit, onDelete }) => {
    const columns: ColumnsType<CusType> = [
        {
            title: "ID",
            dataIndex: "id",
            key: "id",
            align: "center",
            sorter: (a, b) => a.id - b.id,
            defaultSortOrder: 'ascend',
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
            rowKey="id"
        />
    );
};
export default CustomerTable;