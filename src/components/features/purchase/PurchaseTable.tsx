import type { ColumnsType } from "antd/es/table";
import type { PurchaseType } from "./purchase.types";
import { Space, Table, Form, Row, Col, DatePicker, Button, Grid } from "antd";
import { EyeOutlined, EditOutlined, DeleteOutlined, ClearOutlined } from "@ant-design/icons";
import { useCallback, useEffect, useState, type Key } from "react";
import { useTranslation } from "react-i18next";
const { useBreakpoint } = Grid;
import dayjs, { Dayjs } from "dayjs";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";

dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);
interface Props {
    data: PurchaseType[];
    onView: (purchase: PurchaseType) => void;
    onEdit: (purchase: PurchaseType) => void;
    onDelete: (purchase: PurchaseType) => void;
}

const PurchaseTable: React.FC<Props> = ({ data, onView, onEdit, onDelete }) => {
    const [form] = Form.useForm();
    const screens = useBreakpoint();
    const isMobile = !screens.md;
    const { t } = useTranslation(["purchase", "common"]);
    const [filteredPurchases, setFilteredPurchases] = useState<PurchaseType[]>(data);
    const renderItems = (record: PurchaseType, render: (item: any) => React.ReactNode) => (
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            {record.items?.map((item: any, index: Key | null | undefined) => (
                <div key={index} style={{ lineHeight: "22px" }}>
                    {render(item)}
                </div>
            ))}
        </div>
    );

    useEffect(() => {
        setFilteredPurchases(data);
    }, [data])

    const handleDateChange = useCallback(() => {
        const values = form.getFieldsValue();
        let fromDate: Dayjs | null = null;
        let toDate: Dayjs | null = null;

        if (isMobile) {
            fromDate = values.purchase_date_from ?? null;
            toDate = values.purchase_date_to ?? null;
        } else {
            if (values.purchase_date_range) {
                [fromDate, toDate] = values.purchase_date_range;
            }
        }

        if (fromDate && toDate) {
            const filtered = data.filter((purchase) => {
                const purchaseDate = dayjs(purchase.purchase_date);
                return (
                    purchaseDate.isSameOrAfter(fromDate, "day") &&
                    purchaseDate.isSameOrBefore(toDate, "day")
                );
            });
            setFilteredPurchases(filtered);
        } else {
            setFilteredPurchases(data);
        }
    }, [form, isMobile, data]);

    const handleClear = useCallback(() => {
        form.resetFields();
        setFilteredPurchases(data);
    }, [form, data]);

    const columns: ColumnsType<PurchaseType> = [
        {
            title: t("table.id", { ns: "purchase" }),
            dataIndex: "purchase_id",
            key: "purchase_id",
            align: "center",
            sorter: (a, b) => a.purchase_id - b.purchase_id,
            defaultSortOrder: "ascend",
        },
        {
            title: t("table.supplier", { ns: "purchase" }),
            dataIndex: "supplier_name",
            key: "suppsupplier_namelier",
            align: "center",
        },
        {
            title: t("table.purchaseDate", { ns: "purchase" }),
            dataIndex: "purchase_date",
            key: "purchase_date",
            align: "center",
        },
        {
            title: t("table.itemName", { ns: "purchase" }),
            dataIndex: "item_name",
            key: "item_name",
            align: "center",
            render: (_, record) => renderItems(record, (item) => item.item_name),
        },
        {
            title: t("table.qty", { ns: "purchase" }),
            dataIndex: "qty",
            key: "qty",
            align: "center",
            render: (_, record) => renderItems(record, (item) => item.qty),
        },
        {
            title: t("table.unitPrice", { ns: "purchase" }),
            dataIndex: "unit_price",
            key: "unit_price",
            align: "center",
            render: (_, record) =>
                renderItems(record, (item) =>
                    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(item.unit_price)
                ),
        },
        {
            title: t("table.subtotal", { ns: "purchase" }),
            dataIndex: "subtotal",
            key: "subtotal",
            align: "center",
            render: (_, record) =>
                renderItems(record, (item) =>
                    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(item.subtotal ?? 0)
                ),
        },
        {
            title: t("table.totalAmount", { ns: "purchase" }),
            dataIndex: "total_amount",
            key: "total_amount",
            align: "center",
            render: (value: number) =>
                new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value),
        },
        {
            title: t("table.actions", { ns: "purchase" }),
            key: "actions",
            align: "center",
            render: (_, record) => (
                <Space>
                    <Button type="primary" onClick={() => onView(record)}>
                        <EyeOutlined /> {t("button.view", { ns: "common" })}
                    </Button>
                    <Button type="primary" onClick={() => onEdit(record)}>
                        <EditOutlined /> {t("button.edit", { ns: "common" })}
                    </Button>
                    <Button danger onClick={() => onDelete(record)}>
                        <DeleteOutlined /> {t("button.delete", { ns: "common" })}
                    </Button>
                </Space>
            ),
        },
    ];

    return (
        <div style={{ overflow: "visible", minHeight: "600px" }}>
            <Form form={form} layout="vertical" requiredMark={false}>
                <Row gutter={16} align="bottom">
                    {isMobile ? (
                        <>
                            <Col xs={24} sm={12}>
                                <Form.Item
                                    label={t("filterDate.from_date", { ns: "common" })}
                                    name="purchase_date_from"  
                                >
                                    <DatePicker
                                        placeholder={t("filterDate.from_date", { ns: "common" })}
                                        format="YYYY-MM-DD"
                                        style={{ width: "100%" }}
                                        onChange={handleDateChange}
                                    />
                                </Form.Item>
                            </Col>
                            <Col xs={24} sm={12}>
                                <Form.Item
                                    label={t("filterDate.to_date", { ns: "common" })}
                                    name="purchase_date_to"
                                >
                                    <DatePicker
                                        placeholder={t("filterDate.to_date", { ns: "common" })}
                                        format="YYYY-MM-DD"
                                        style={{ width: "100%" }}
                                        onChange={handleDateChange}
                                    />
                                </Form.Item>
                            </Col>
                        </>
                    ) : (
                        <Col xs={24} sm={24} md={8}>
                            <Form.Item
                                label={t("purchase.dateRange", { ns: "purchase" })}
                                name="purchase_date_range"
                            >
                                <DatePicker.RangePicker
                                    placeholder={[
                                        t("filterDate.from_date", { ns: "common" }),
                                        t("filterDate.to_date", { ns: "common" }),
                                    ]}
                                    format="YYYY-MM-DD"
                                    style={{ width: "100%" }}
                                    onChange={handleDateChange}
                                />
                            </Form.Item>
                        </Col>
                    )}
                    <Col xs={24} sm={12} md={3}>
                        <Form.Item>
                            <Button
                                onClick={handleClear}
                                icon={<ClearOutlined />}
                                block={isMobile}
                            >

                            </Button>
                        </Form.Item>
                    </Col>
                </Row>
            </Form>

            <Table
                columns={columns}
                dataSource={filteredPurchases}
                pagination={{ pageSize: 10, simple: true }}
                scroll={{ x: "max-content" }}
                rowKey="purchase_id"
                locale={{ emptyText: t("table.noData", { ns: "purchase" }) }}
                size="small"
            />
        </div>
    );
};

export default PurchaseTable;