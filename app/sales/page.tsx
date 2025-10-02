"use client";

import { useEffect, useState } from "react";
import Layout from "@/components/DashboardSidebar";
import {
  Card,
  DatePicker,
  Table,
  Pagination,
  message,
  Typography,
  Row,
  Col,
  Spin,
  Select,
} from "antd";
import dayjs from "dayjs";
import { fetchWithAuth } from "@/lib/auth";

const { Title } = Typography;
const { Option } = Select;

export default function SalesPage() {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(false);
  const [date, setDate] = useState(dayjs().format("YYYY-MM-DD"));
  const [page, setPage] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [store, setStore] = useState(0); // Default: Ernakulam

  const pageSize = 20;

  useEffect(() => {
    async function loadSales() {
      setLoading(true);
      try {
        const res = await fetchWithAuth(
          `api/sales/by-date-store?date=${date}&store=${store}&page=${page}&size=${pageSize}`
        );
        setSales(res.content || []);
        setTotalElements(res.totalElements || 0);
      } catch (err) {
        console.error("Failed to fetch sales:", err);
        message.error("Failed to load sales data");
      } finally {
        setLoading(false);
      }
    }

    loadSales();
  }, [date, page, store]);

  const columns = [
    {
      title: "Bill #",
      dataIndex: "billNumber",
      key: "billNumber",
    },
    {
      title: "Token",
      dataIndex: "tokenNumber",
      key: "tokenNumber",
    },
    {
      title: "Store",
      dataIndex: "store",
      key: "store",
      render: (value: number) => (value === 0 ? "Ernakulam" : "Aluva"),
    },
    {
      title: "Customer",
      dataIndex: "customerName",
      key: "customerName",
    },
    {
      title: "Payment",
      dataIndex: "paymentMethod",
      key: "paymentMethod",
    },
    {
      title: "Total",
      dataIndex: "totalAmount",
      key: "totalAmount",
      render: (val: number) => `$${val}`,
    },
    {
      title: "Date/Time",
      dataIndex: "dateTime",
      key: "dateTime",
    },
  ];

  return (
    <Layout pageTitle="Sales">
      <Title level={3}>Sales Dashboard</Title>

      <Card style={{ marginBottom: 16 }}>
        <Row gutter={16} align="middle">
          <Col>
            <DatePicker
              value={dayjs(date)}
              onChange={(d) => {
                setPage(0);
                setDate(d ? d.format("YYYY-MM-DD") : dayjs().format("YYYY-MM-DD"));
              }}
            />
          </Col>

          <Col>
            <Select
              value={store}
              style={{ width: 180 }}
              onChange={(value) => {
                setPage(0);
                setStore(value);
              }}
            >
              <Option value={0}>Ernakulam</Option>
              <Option value={1}>Aluva</Option>
            </Select>
          </Col>
        </Row>
      </Card>

      <Card>
        {loading ? (
          <Spin />
        ) : (
          <>
            <Table
              dataSource={sales}
              columns={columns}
              rowKey="id"
              pagination={false}
            />
            <Pagination
              style={{ marginTop: 16, textAlign: "right" }}
              current={page + 1}
              total={totalElements}
              pageSize={pageSize}
              onChange={(p) => setPage(p - 1)}
            />
          </>
        )}
      </Card>
    </Layout>
  );
}
