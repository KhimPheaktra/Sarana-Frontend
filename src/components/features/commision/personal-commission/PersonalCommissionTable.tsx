import type { ColumnsType } from "antd/es/table";
import type { CommissionType } from "../commission.types";
import { Button, Col, DatePicker, Form, Grid, Row, Space, Table } from "antd";
import { ClearOutlined, DeleteOutlined, EditOutlined } from "@ant-design/icons";
import React, { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import dayjs, { Dayjs } from "dayjs";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
const { useBreakpoint } = Grid;
dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);


interface Props {
    data: CommissionType[];
    onEdit: (commission: CommissionType) => void;
    onDelete: (commission: CommissionType) => void;
}

const PersonalCommissionTable: React.FC<Props> = ({ data, onEdit, onDelete }) => {
    const [form] = Form.useForm();
    const screens = useBreakpoint();
    const isMobile = !screens.md;
    const { t } = useTranslation(["commission", "common"]);
    const [filteredCommission, setFilteredCommission] = useState<CommissionType[]>(data);


    useEffect(() => {
        setFilteredCommission(data);
    }, [data]);

    const handleDateChange = useCallback(() => {
        const values = form.getFieldsValue();
        let fromDate: Dayjs | null = null;
        let toDate: Dayjs | null = null;

        if (isMobile) {
            fromDate = values.commission_date_from ?? null;
            toDate = values.commission_date_to ?? null;
        } else {
            if (values.commission_date_range) {
                [fromDate, toDate] = values.commission_date_range;
            }
        }
        if (fromDate && toDate) {
            const filtered = data.filter((invoices) => {
                const commissionDate = dayjs(invoices.commission_date);
                return (
                    commissionDate.isSameOrAfter(fromDate, "day") &&
                    commissionDate.isSameOrBefore(toDate, "day")
                );
            })
            setFilteredCommission(filtered);
        } else {
            setFilteredCommission(data);
        }
    }, [form, data, isMobile]);
    const handleClear = useCallback(() => {
        form.resetFields();
        setFilteredCommission(data);
    }, [form, data]);
    const columns: ColumnsType<CommissionType> = [
        {
            title: t("table.id", { ns: "commission" }),
            dataIndex: "commission_id",
            key: "commission_id",
            align: "center",
            sorter: (a, b) => a.commission_id - b.commission_id,
            defaultSortOrder: "ascend",
        },
        {
            title: t("table.amount", { ns: "commission" }),
            dataIndex: "amount",
            key: "amount",
            align: "center",
        },
        {
            title: t("table.date", { ns: "commission" }),
            dataIndex: "commission_date",
            key: "commission_date",
            align: "center",
        },
        {
            title: t("table.description", { ns: "commission" }),
            dataIndex: "description",
            key: "description",
            align: "center",
        },
        {
            title: t("table.engineer", { ns: "commission" }),
            dataIndex: "engineer",
            key: "engineer",
        },
        {
            title: t("table.actions", { ns: "commission" }),
            key: "actions",
            align: "center",
            render: (_, record) => (
                <Space>
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
                                <Form.Item label={t("filterDate.from_date", { ns: "common" })} name="commission_date_from">
                                    <DatePicker
                                        placeholder={t("filterDate.from_date", { ns: "common" })}
                                        format="YYYY-MMMM-DD"
                                        style={{ width: "100%" }}
                                        onChange={handleDateChange}
                                    />
                                </Form.Item>
                            </Col>
                            <Col xs={24} sm={12}>
                                <Form.Item label={t("filterDate.to_date", { ns: "common" })} name="commission_date_to">
                                    <DatePicker
                                        placeholder={t("filterDate.to_date", { ns: "common" })}
                                        format="YYYY-MMMM-DD"
                                        style={{ width: "100%" }}
                                        onChange={handleDateChange}
                                    />
                                </Form.Item>
                            </Col>
                        </>
                    ) : (
                        <Col xs={24} sm={24} md={8}>
                            <Form.Item label={t("commission.dateRange", { ns: "commission" })} name="commission_date_range">
                                <DatePicker.RangePicker
                                    placeholder={[
                                        t("filterDate.from_date", { ns: "common" }),
                                        t("filterDate.to_date", { ns: "common" }),
                                    ]}
                                    format="YYYY-MMMM-DD"
                                    style={{ width: "100%" }}
                                    onChange={handleDateChange}
                                />
                            </Form.Item>
                        </Col>
                    )}
                    <Col xs={24} sm={12} md={6}>
                        <Form.Item>
                            <Button onClick={handleClear} icon={<ClearOutlined />} block={isMobile}>

                            </Button>
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
            <Table
                columns={columns}
                dataSource={filteredCommission}
                pagination={{ pageSize: 10, simple: true }}
                rowKey="commission_id"
                scroll={{ x: "max-content" }}
                size="small"
                locale={{ emptyText: t("table.noDataPersonal", { ns: "commission" }) }}
            />
        </div>
    );
};

export default PersonalCommissionTable;