import React from 'react';
import { Row, Col, Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import './ActionHeader.css';

interface ActionHeaderProps {
    title: string;
    count: number;
    countLabel?: string;
    icon: React.ReactNode;
    onAdd?: () => void; 
    buttonText?: string;
}

const ActionHeader: React.FC<ActionHeaderProps> = ({ 
    title, 
    count, 
    countLabel = 'total',
    icon, 
    onAdd,
    buttonText = 'Add New'
}) => {
    return (
        <Row justify="space-between" align="middle" className="action-header">
            <Col>
                <div className="action-header-content">
                    <div className="action-header-icon">{icon}</div>
                    <div>
                        <h3 className="action-header-title">{title}</h3>
                        <p className="action-header-subtitle">
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
                        className="action-header-btn"
                        icon={<PlusOutlined />}
                    >
                        {buttonText}
                    </Button>
                </Col>
            )}
        </Row>
    );
};

export default ActionHeader;