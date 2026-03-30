import React from 'react';
import { Row, Col, Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import './ActionHeader.css';
import { useTranslation } from 'react-i18next';

interface ActionHeaderProps {
    title: string;
    count?: number;
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
const { i18n } = useTranslation();

  const displayCount = count !== undefined
    ? i18n.language === 'km'
      ? count.toLocaleString('km-KH')
      : count.toLocaleString()
    : null;

  const subtitle = count !== undefined
    ? i18n.language === 'km'
      ? `សរុប ${displayCount} ${countLabel}`
      : `Total ${displayCount} ${countLabel}`
    : countLabel;

    return (
        <Row justify="space-between" align="middle" className="action-header">
            <Col>
                <div className="action-header-content">
                    <div className="action-header-icon">{icon}</div>
                    <div>
                        <h3 className="action-header-title">{title}</h3>
                        <p className="action-header-subtitle">
                           {subtitle}
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