import { Card, Statistic } from "antd";
import React from "react";

export interface StatCardProps {
    label: string;
    value: number;
    borderColor?: string;
    bgColor: string;
    textColor: string;
    prefix?: string;
    icon?: React.ReactNode;      
    suffix?: React.ReactNode;   
}

export function StatCard({ label, value, borderColor, textColor, bgColor, icon, suffix }: StatCardProps) {
    return (
        <Card
            variant="borderless"
            style={{
                borderRadius: '8px',
                boxShadow: '0 1px 8px rgba(0,0,0,0.08)',
            }}
        >
            <Statistic
                title={<span style={{ fontSize: 14, color: '#8c8c8c' }}>{label}</span>}
                value={value}
                precision={2}
                prefix={
                    <span style={{
                        fontSize: 20,
                        color: textColor,
                        backgroundColor: bgColor ?? `${borderColor}20`,
                        padding: '6px 10px',
                        borderRadius: '8px',
                        marginRight: '8px',
                    }}>
                        {icon ?? '$'}
                    </span>
                }
                suffix={suffix}
                style={{ color: textColor, fontWeight: 600 }}
            />
        </Card>
    );
}