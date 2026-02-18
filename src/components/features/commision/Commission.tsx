import { Card, Form, message } from "antd";
import PageHeader from "../../../shared/action-header/ActionHeader";
import CommissionTable from "./CommissionTable";
import { useAppModal } from "../../../shared/modal/AppModalProvider";
import type { CommissionType } from "./commission.types";
import dayjs from "dayjs";
import CommissionForm from "./CommissionForm";
const Commision = () => {
    const [form] = Form.useForm();
    const {openModal,closeModal} = useAppModal();

    const commissions: CommissionType[] = [
        {
            key: "1",
            commission_id: 1,
            amount: 50,
            commission_date: "2026-02-01",
            description: "Sales Commission",
            engineer: "Long",
        },
    ];

    const titleMap ={
        add: "Add Commission",
        edit: "Edit Commission",
        delete: "Delete Commission",
    };
    const openAdd = () => {
        form.resetFields();
        form.setFieldsValue({
            commission_date: dayjs(),
        });
        openModal("add", {
            titleMap,
            content: <CommissionForm form={form} />,
            onOk: async () => {
                await form.validateFields();
                message.success("Commission added successfully");
                closeModal();
            },            
        });
    };
    const openEdit = (commission: CommissionType) => {
        form.setFieldsValue({
            ...commission,
            commission_date: commission.commission_date 
            ? dayjs(commission.commission_date)
            : undefined,
        });
        openModal("edit", {
            titleMap,
            content: <CommissionForm form={form} />,
            onOk: async () => {
                await form.validateFields();
                message.success("Commission updated successfully");
                closeModal();
            }
        });
    };

    const openDelete = (commission: CommissionType) => {
        openModal("delete", {
            titleMap,
            content: (
                <p>
                    Are you sure you want to delete commission {" "}
                    <b>#{commission.commission_id}</b>?

                </p>
            ),
            onOk: () => {
                message.success("Commission deleted successfully");
                closeModal();
            },
        });
    };
    
    return (
           <div className="table-container">
            <PageHeader 
                title="Commissions"
                onAdd={openAdd}
                buttonText="Add Commission" 
                count={commissions.length} 
                icon={undefined}                  
            />
            <Card>
                <CommissionTable
                    data={commissions}
                    onEdit={openEdit}
                    onDelete={openDelete}
                />
            </Card>
           </div>
        )
}

export default Commision;