import React, { useState } from "react";

import WorkerTable from "./workerTable";
import { Card, Form, message } from "antd";
import type { ModalMode, WorkerType } from "./worker.types";
import WorkerModal from "./workerModal";
import { TeamOutlined } from "@ant-design/icons";
import PageHeader from "../../layout/page_header/pageHeader";
const Worker: React.FC = () => {
    const [form] = Form.useForm();
    const [modalMode, setModalMode] = useState<ModalMode>(null);
    const [selectedWorker, setSelectedWorker] = useState<WorkerType | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const workers: WorkerType[] = [
        { key: "1", id: 1, name: "Tra", phone_number: "012312313", address: "Sangkat 1" },
        { key: "2", id: 2, name: "Long", phone_number: "0214142121", address: "Sangkat 2" },
    ];

    const openAdd = () => {
    setModalMode("add");
    setSelectedWorker(null);
    form.resetFields();
    setIsModalOpen(true);
  };

  const openEdit = (worker: WorkerType) => {
    setModalMode("edit");
    setSelectedWorker(worker);
    form.setFieldsValue(worker);
    setIsModalOpen(true);
  };

  const openDelete = (worker: WorkerType) => {
    setModalMode("delete");
    setSelectedWorker(worker);
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    await form.validateFields();
    if(modalMode === "edit"){
      message.success("Worker updated successfully  ");
    }else{
      message.success("Worker added successfully");
    }
    closeModal();
  };

  const handleDelete = () => {
    message.success("Worker deleted successfully");
    closeModal();
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalMode(null);
    setSelectedWorker(null);
  };

    return (
        <>
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

        <WorkerModal
        open={isModalOpen}
        mode={modalMode}
        worker={selectedWorker}
        form={form}
        onCancel={closeModal}
        onSave={handleSave}
        onDelete={handleDelete}
      />
      </div>
        </>
    )

};

export default Worker;