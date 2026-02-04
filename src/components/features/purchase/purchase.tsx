import { Card, Form, message } from "antd";
import { useState } from "react";
import type {  ModalMode, PurchaseType } from "./purchase.types";
import PageHeader from "../../layout/pageHeader/pageHeader";
import PurchaseTable from "./purchaseTable";
import { ShoppingCartOutlined } from "@ant-design/icons";
import PurchaseModal from "./purchaseModal";
import dayjs from 'dayjs';


const Purchase = () => {
    const [form] = Form.useForm();
    const [modalMode, setModalMode] = useState<ModalMode>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedPurchase, setSelectedPurchase] = useState<PurchaseType | null>(null);

    const purchases: PurchaseType[] = [
        { key: "1", purchase_id: 1, supplier_id: 1, purchase_date: "2026-01-01", total_amount: 500, item_id: 1, quantity: 5, unit_price: 50, subtotal: 250 },
        { key: "2", purchase_id: 2, supplier_id: 2, purchase_date: "2026-01-05", total_amount: 300, item_id: 3, quantity: 15, unit_price: 20, subtotal: 300 },
    ];
    const openAdd = () => {
    setModalMode("add");
    setSelectedPurchase(null);
    form.resetFields();
    setIsModalOpen(true);
     form.setFieldsValue({
    purchase_date: dayjs() 
  });
  };
    const openView = (purchase: PurchaseType) => {
    setModalMode("view");
    setSelectedPurchase(purchase);
    form.setFieldsValue({
      ...purchase,
      purchase_date: purchase.purchase_date ? dayjs(purchase.purchase_date) : undefined
    });
    setIsModalOpen(true);
  };

  const openEdit = (purchase: PurchaseType) => {
    setModalMode("edit");
    setSelectedPurchase(purchase);
    form.setFieldsValue({
      ...purchase,
      purchase_date: purchase.purchase_date ? dayjs(purchase.purchase_date) : undefined
    });
    setIsModalOpen(true);
  };

  const openDelete = (purchase: PurchaseType) => {
    setModalMode("delete");
    setSelectedPurchase(purchase);
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    await form.validateFields();
    if(modalMode === "edit"){
      message.success("Purchase updated successfully  ");
    }else{
      message.success("Purchase added successfully");
    }
    closeModal();
  };

  const handleDelete = () => {
    message.success("Purchase deleted successfully");
    closeModal();
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalMode(null);
    setSelectedPurchase(null);
  };
  

    return (
       <>
        <div className="table-container">
        <PageHeader
                title="Purchase Management"
                count={purchases.length}
                countLabel="purchases"
                onAdd={openAdd}
                icon={<ShoppingCartOutlined />}
            />
        <Card>
            <PurchaseTable
                data={purchases}
                onView={openView}
                onEdit={openEdit}
                onDelete={openDelete}
            />
                
        </Card>
          <PurchaseModal
            open={isModalOpen}
            mode={modalMode}
            purchase={selectedPurchase}
            form={form}
            onCancel={closeModal}
            onSave={handleSave}
            onDelete={handleDelete}
        />

      
      </div>
        </>
    )
        
};

export default Purchase;

