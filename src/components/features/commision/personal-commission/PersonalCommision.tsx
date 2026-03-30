import { Card, Form, message } from "antd";
import ActionHeader from "../../../../shared/action-header/ActionHeader";
import { useAppModal } from "../../../../shared/modal/AppModalProvider";
import type { CommissionType } from "../commission.types";
import dayjs from "dayjs";
import PersonalCommissionForm from "./PersonalCommissionForm";
import CommissionTable from "./PersonalCommissionTable";
import { useSales } from "../../sales/SaleContext";
import React from "react";
import { useTranslation } from "react-i18next";

const PersonalCommission = () => {
  const [form] = Form.useForm();
  const { openModal, closeModal } = useAppModal();
  const { commissions, setCommissions } = useSales();
  const { t } = useTranslation();
  const personalCommissions = React.useMemo(
    () => commissions.filter((item) => !item.project?.trim()),
    [commissions]
  );

  const titleMap = {
    add: t("modal.addTitle", { name: t("title.persionalCommission") }),
    edit: t("modal.editTitle", { name: t("title.persionalCommission") }),
    delete: t("modal.deleteTitle", { name: t("title.persionalCommission") }),
  };
  const okTextMap = {
    add: t("modal.okText"),
    edit: t("modal.okText"),
    delete: t("modal.deleteOkText"),
  };

  const openAdd = () => {
    form.resetFields();
    form.setFieldsValue({
      commission_date: dayjs(),
      status: "Pending",
    });

    openModal("add", {
      titleMap,
      okTextMap,
      cancelText: t("modal.cancelText", { ns: "common" }),
      content: <PersonalCommissionForm form={form} />,
      onOk: async () => {
        await form.validateFields();
        const values = form.getFieldsValue();

        const newId =
          commissions.length > 0
            ? Math.max(...commissions.map((c) => c.commission_id)) + 1
            : 1;

        const newCommission: CommissionType = {
          key: String(newId),
          commission_id: newId,
          // project: "",           
          engineer: values.engineer,
          amount: Number(values.amount),
          commission_rate: Number(values.commission_rate),
          commission_date: dayjs(values.commission_date).format("YYYY-MM-DD"),
          description: values.description ?? "",
          status: values.status,
        };

        setCommissions((prev) => [...prev, newCommission]);
        message.success("Personal Commission added successfully");
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
      okTextMap,
      cancelText: t("modal.cancelText", { ns: "common" }),
      content: <PersonalCommissionForm form={form} />,
      onOk: async () => {
        await form.validateFields();
        const values = form.getFieldsValue();

        setCommissions((prev) =>
          prev.map((c) =>
            c.commission_id === commission.commission_id
              ? {
                ...c,
                ...values,
                commission_date: dayjs(values.commission_date).format("YYYY-MM-DD"),
                amount: Number(values.amount),
                commission_rate: Number(values.commission_rate),
              }
              : c
          )
        );

        message.success("Personal Commission updated successfully");
        closeModal();
      },
    });
  };

  const openDelete = (commission: CommissionType) => {
    openModal("delete", {
      titleMap,
      okTextMap,
      cancelText: t("modal.cancelText", { ns: "common" }),
      content: (
        <p>
          Are you sure you want to delete personal commission <b>#{commission.commission_id}</b>?
        </p>
      ),
      onOk: () => {
        setCommissions((prev) => prev.filter((c) => c.commission_id !== commission.commission_id));
        message.success("Personal Commission deleted successfully");
        closeModal();
      },
    });
  };

  return (
    <div className="table-container">
      <ActionHeader
        title={t("title.persionalCommission")}
        countLabel={t("title.persionalCommission", { ns: "common" })}
        onAdd={openAdd}
        buttonText={t("button.add")}
        count={personalCommissions.length}
        icon={undefined}
      />
      <Card>
        <CommissionTable
          data={personalCommissions}
          onEdit={openEdit}
          onDelete={openDelete}
        />
      </Card>
    </div>
  );
};

export default PersonalCommission;