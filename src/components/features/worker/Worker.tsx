import { Card, Form, message } from "antd";
import type { WorkerType } from "./worker.types";
import PageHeader from "../../layout/pageHeader/PageHeader";
import WorkerTable from "./WorkerTable";
import WorkerForm from "./WorkerForm"; 
import { TeamOutlined } from "@ant-design/icons";
import { useAppModal } from "../../../shared/modal/AppModalProvider";

const Worker = () => {
  const [form] = Form.useForm();
  const { openModal, closeModal } = useAppModal();

  const workers: WorkerType[] = [
    { key: "1", id: 1, name: "Tra", phone_number: "012312313", address: "Sangkat 1" },
    { key: "2", id: 2, name: "Long", phone_number: "0214142121", address: "Sangkat 2" },
  ];

  const titleMap = {
    add: "Add Worker",
    edit: "Edit Worker",
    delete: "Delete Worker",
  };

  const openAdd = () => {
    form.resetFields();
    openModal("add", {
      titleMap,
      content: <WorkerForm form={form} />,
      onOk: async () => {
        await form.validateFields();
        message.success("Worker added successfully");
        closeModal();
      },
    });
  };

  const openEdit = (worker: WorkerType) => {
    form.setFieldsValue(worker);
    openModal("edit", {
      titleMap,
      content: <WorkerForm form={form} />,
      onOk: async () => {
        await form.validateFields();
        message.success("Worker updated successfully");
        closeModal();
      },
    });
  };

  const openDelete = (worker: WorkerType) => {
    openModal("delete", {
      titleMap,
      content: (
        <p>
          Are you sure you want to delete worker <b>{worker.name}</b>?
        </p>
      ),
      onOk: () => {
        message.success("Worker deleted successfully");
        closeModal();
      },
    });
  };

  return (
    <div className="table-container">
      <PageHeader
        title="Worker Management"
        count={workers.length}
        countLabel="workers"
        icon={<TeamOutlined />}
        onAdd={openAdd}
        buttonText="Add Worker"
      />

      <Card>
        <WorkerTable
          data={workers}
          onEdit={openEdit}
          onDelete={openDelete}
        />
      </Card>
    </div>
  );
};

export default Worker;
