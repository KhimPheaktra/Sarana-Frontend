import { EditOutlined } from "@ant-design/icons";
import { Button, Space, Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import type { WorkerType } from "./worker.types";

interface Props {
    data: WorkerType[];
    onEdit: (worker: WorkerType) => void;
    onDelete: (worker: WorkerType) => void;
}

const WorkerTable:React.FC<Props> = ({ data, onEdit, onDelete }) => {
    const columns: ColumnsType<WorkerType> = [
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
            title:"Phone",
            dataIndex:"phone_number",
            key:"phone_number",
            align: "center",
        },
        {
            title: "Adress",
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
                        Delete
                    </Button>
                </Space>
            )
        }
    ];

    return (
        <Table
            columns={columns}
            dataSource={data}
            pagination={{ pageSize: 5, simple: true }}
            scroll={{ x: 'max-content' }}
            rowKey="id"
        />
    );



}
export default WorkerTable;
