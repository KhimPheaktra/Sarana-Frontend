import { Card } from 'antd';
import { FileDoneOutlined } from '@ant-design/icons';
import type { InvoiceType } from './invoice.types';
import InvoiceTable from './InvoiceTable';
import PageHeader from '../../layout/pageHeader/PageHeader';

const Invoice = () => {
  
    const invoices: InvoiceType[] = [
        {key:"1",invoice_id:1,customer_id:1,quote_id:1,invoice_date:"02-02-2026",item_id:1,unit_price:100,quantity:1,total_amount: 100,status: "Completed"},
        {key:"2",invoice_id:2,customer_id:2,quote_id:2,invoice_date:"02-02-2026",item_id:1,unit_price:120,quantity:2,total_amount: 240,status: "Completed"},
    ]
    

    const onView = () => {

    }
    const onDelete = () => {

    }
return (
       <>
        <PageHeader
                title="Invoices"
                count={invoices.length}
                countLabel="invoices"
                icon={<FileDoneOutlined />}
            />
        <Card>
            <InvoiceTable 
                data={invoices}
                onView={onView}
                onDelete={onDelete}
            />
        </Card>
       </>
    )
}

export default Invoice;