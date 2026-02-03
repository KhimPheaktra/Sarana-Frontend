
import type { ExpensesType } from "./expenses.types";
import { Button, Space, Table } from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
interface Props{
    data: ExpensesType[];
    onEdit: (expenses: ExpensesType) => void;
    onDelete: (expenses: ExpensesType) => void;
}

const ExpensesTable:React.FC<Props> = ({data,onEdit,onDelete}) => {
    const columns: ColumnsType<ExpensesType> = [
        {
            title: "Expenses ID",
            dataIndex: "expenses_id",
            align: "center",
            key: "expenses_id",
            sorter: (a, b) => a.expenses_id - b.expenses_id,
            defaultSortOrder: 'ascend',
        },
        {
            title: "Description",
            dataIndex: "description",
            key: "description",
            align:"center",
        },
        {
            title: "Amount",
            dataIndex: "amount",
            key: "amount",
            align:"center",
        },
        {
            title: "Date",
            dataIndex: "expenses_date",
            key: "expenses_date",
            align:"center",
        },
        {
            title: "Category",
            dataIndex: "category",
            key: "category",
            align:"center",
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
            rowKey="expenses_id"
            pagination={{pageSize: 10,simple:true}}
            scroll={{x: 'max-content'}}
        />
    );
};

export default ExpensesTable