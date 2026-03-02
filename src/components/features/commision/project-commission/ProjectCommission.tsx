import { Card, Form, message } from "antd";
import PageHeader from "../../../../shared/action-header/ActionHeader";
import { useAppModal } from "../../../../shared/modal/AppModalProvider";
import type { CommissionType } from "../commission.types";
import dayjs from "dayjs";
import { useSales } from "../../sales/SaleContext";
import ProjectCommissionForm from "./ProjectCommissionForm";
import ProjectCommissionTable from "./ProjectCommissionTable";
import React from "react"; 

const ProjectCommission = () => {
  const [form] = Form.useForm();
  const { openModal, closeModal } = useAppModal();
  const { commissions, setCommissions } = useSales();

  const projectCommissions = React.useMemo(
    () => commissions.filter((item) => item.project?.trim()),
    [commissions]
  );

  const titleMap = {
    add: "Add Project Commission",
    edit: "Edit Project Commission",
    delete: "Delete Project Commission",
  };

  const openAdd = () => {
    form.resetFields();
    form.setFieldsValue({
      commission_date: dayjs(),
      commission_rate: 30,       
      status: "Pending",
    });
    openModal("add", {
      titleMap,
      content: <ProjectCommissionForm form={form} />,
      onOk: async () => {
        await form.validateFields();
        const v = form.getFieldsValue();
        const newId =
          commissions.length > 0
            ? Math.max(...commissions.map((c) => c.commission_id)) + 1
            : 1;

        const newCommission: CommissionType = {
          key: String(newId),
          commission_id: newId,
          project: v.project?.trim() || "",
          engineer: v.engineer,
          amount: Number(v.amount),
          invoice_total: Number(v.invoice_total),
          commission_rate: Number(v.commission_rate),
          commission_date: dayjs(v.commission_date).format("YYYY-MM-DD"),
          description: v.description ?? "",
          status: v.status,
        };

        setCommissions((prev) => [...prev, newCommission]);
        message.success("Project Commission added successfully");
        closeModal();
      },
    });
  };

  const openEdit = (commission: CommissionType) => {
    form.setFieldsValue({
      ...commission,
      commission_date: commission.commission_date ? dayjs(commission.commission_date) : undefined,
    });

    openModal("edit", {
      titleMap,
      content: <ProjectCommissionForm form={form} />,
      onOk: async () => {
        await form.validateFields();
        const v = form.getFieldsValue();
        setCommissions((prev) =>
          prev.map((c) =>
            c.commission_id === commission.commission_id
              ? {
                  ...c,
                  ...v,
                  project: v.project?.trim() || "",
                  commission_date: dayjs(v.commission_date).format("YYYY-MM-DD"),
                  amount: Number(v.amount),
                  invoice_total: Number(v.invoice_total ?? c.invoice_total),
                  commission_rate: Number(v.commission_rate),
                }
              : c
          )
        );
        message.success("Project Commission updated successfully");
        closeModal();
      },
    });
  };

  const openDelete = (commission: CommissionType) => {
    openModal("delete", {
      titleMap,
      content: (
        <p>
          Are you sure you want to delete project commission <b>#{commission.commission_id}</b>?
        </p>
      ),
      onOk: () => {
        setCommissions((prev) => prev.filter((c) => c.commission_id !== commission.commission_id));
        message.success("Project Commission deleted successfully");
        closeModal();
      },
    });
  };

  return (
    <div className="table-container">
      <PageHeader
        title="Project Commissions"
        onAdd={openAdd}
        buttonText="Add Commission"
        count={projectCommissions.length}
        icon={undefined}
      />
      <Card>
        <ProjectCommissionTable
          data={projectCommissions}  
          onEdit={openEdit}
          onDelete={openDelete}
        />
      </Card>
    </div>
  );
};

export default ProjectCommission;