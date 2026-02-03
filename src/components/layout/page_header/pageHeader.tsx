import React from 'react';
import { Row, Col, Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import './pageHeader.css';

interface PageHeaderProps {
    title: string;
    count: number;
    countLabel?: string;
    icon: React.ReactNode;
    onAdd?: () => void; 
    buttonText?: string;
}

const PageHeader: React.FC<PageHeaderProps> = ({ 
    title, 
    count, 
    countLabel = 'total',
    icon, 
    onAdd,
    buttonText = 'Add New'
}) => {
    return (
        <Row justify="space-between" align="middle" className="page-header">
            <Col>
                <div className="page-header-content">
                    <div className="page-header-icon">{icon}</div>
                    <div>
                        <h3 className="page-header-title">{title}</h3>
                        <p className="page-header-subtitle">
                            Total: {count} {countLabel}
                        </p>
                    </div>
                </div>
            </Col>
        
            {onAdd && (
                <Col>
                    <Button 
                        type="primary" 
                        onClick={onAdd}
                        size="large"
                        className="page-header-btn"
                        icon={<PlusOutlined />}
                    >
                        {buttonText}
                    </Button>
                </Col>
            )}
        </Row>
    );
};

export default PageHeader;