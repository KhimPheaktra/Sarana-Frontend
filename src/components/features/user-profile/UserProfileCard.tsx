import { Avatar, Button, Col, Divider, Row, Typography } from "antd";
import { EditOutlined } from "@ant-design/icons";
import type { UserType } from "../user/user.types";
import { useAuth } from "../../cores/auth/authContext";
import { useEffect } from "react";

const { Text, Title } = Typography;

interface Props {
  user?: UserType;
}

const sectionCard: React.CSSProperties = {
  background: "#fff",
  borderRadius: 12,
  padding: "20px 24px",
  marginBottom: 16,
  boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
  border: "1px solid #f0f0f0",
};

const labelStyle: React.CSSProperties = {
  fontSize: 12,
  color: "#9ca3af",
  display: "block",
  marginBottom: 2,
};

const valueStyle: React.CSSProperties = {
  fontSize: 14,
  fontWeight: 600,
  color: "#111827",
};

const EditBtn: React.FC = () => (
  <Button
    size="small"
    icon={<EditOutlined style={{ fontSize: 12 }} />}
    style={{
      borderRadius: 20,
      fontSize: 12,
      color: "#6b7280",
      border: "1px solid #e5e7eb",
      background: "#fff",
      height: 28,
      paddingInline: 12,
      display: "flex",
      alignItems: "center",
      gap: 4,
    }}
  >
    Edit
  </Button>
);

const InfoField: React.FC<{ label: string; value?: string }> = ({ label, value }) => (
  <div style={{ marginBottom: 16 }}>
    <Text style={labelStyle}>{label}</Text>
    <Text style={valueStyle}>{value || "—"}</Text>
  </div>
);

const UserProfileCard: React.FC<Props> = ({ user }) => {
    const {username, setUsername} = useAuth();
    const displayRole = user?.role ?? "Admin";
    const firstName  = user?.first_name ?? "Pheak";
    const lastName   = user?.last_name  ?? "Tra";
    const displayName = [firstName, lastName].filter(Boolean).join(" ");
    const email = user?.email ?? "tra@gmail.com";
    const phone = user?.phone_number ?? "012312312";
    const country = user?.country ?? "Cambodia";
    const city = user?.city ?? "SHV, Sangkat 1";

    useEffect(() => {
        if(!username || username === 'User') {
            const storedUsername = sessionStorage.getItem('username');
            if(storedUsername && setUsername){
                setUsername(storedUsername);
            }
        }
    });

  return (
    <>
      <style>{`
        .my-profile-wrapper {
          background: #f0f4f8;
          min-height: 100vh;
          padding: 32px 24px;
          font-family: 'Segoe UI', sans-serif;
        }
        .my-profile-inner {
          width: 100%; 
        }
      `}</style>

      <div className="my-profile-wrapper">
        <div className="my-profile-inner">
          <Title level={4} style={{ marginBottom: 20, color: "#111827", fontWeight: 700 }}>
            My Profile
          </Title>

          {/* ── Profile Header Card ── */}
          <div style={sectionCard}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <Avatar
                  size={64}
                  src={user?.avatar}
                  style={{
                    background: "linear-gradient(135deg, #93c5fd, #3b82f6)",
                    fontSize: 24,
                    fontWeight: 700,
                    flexShrink: 0,
                  }}
                >
                  {!user?.avatar &&
                    displayName
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()
                      .slice(0, 2)}
                </Avatar>
                <div>
                  <Title level={5} style={{ margin: 0, color: "#111827", fontSize: 17 }}>
                    {username}
                  </Title>
                  <Text style={{ color: "#6b7280", fontSize: 13 }}>{displayRole}</Text>
                  <br />
                  <Text style={{ color: "#9ca3af", fontSize: 12 }}>
                    {city}, {country}
                  </Text>
                </div>
              </div>
              <EditBtn />
            </div>
          </div>

          {/* Personal Information Card  */}
          <div style={sectionCard}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 20,
              }}
            >
              <Title level={5} style={{ margin: 0, color: "#111827", fontWeight: 700 }}>
                Personal Information
              </Title>
              <EditBtn />
            </div>

            <Row gutter={[24, 0]}>
              <Col xs={12}>
                <InfoField label="First Name" value={firstName} />
              </Col>
              <Col xs={12}>
                <InfoField label="Last Name" value={lastName} />
              </Col>
            </Row>

            <Divider style={{ margin: "4px 0 16px" }} />

            <Row gutter={[24, 0]}>
              <Col xs={12}>
                <InfoField label="Email Address" value={email} />
              </Col>
              <Col xs={12}>
                <InfoField label="Phone" value={phone} />
              </Col>
            </Row>

            <Divider style={{ margin: "4px 0 16px" }} />

            <InfoField label="Role" value={displayRole} />
          </div>

          {/* Address Card  */}
          <div style={sectionCard}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 20,
              }}
            >
              <Title level={5} style={{ margin: 0, color: "#111827", fontWeight: 700 }}>
                Address
              </Title>
              <EditBtn />
            </div>

            <Row gutter={[24, 0]}>
              <Col xs={12}>
                <InfoField label="Country" value={country} />
              </Col>
              <Col xs={12}>
                <InfoField label="City/State" value={city} />
              </Col>
            </Row>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserProfileCard;