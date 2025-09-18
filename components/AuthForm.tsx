"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { login } from "@/lib/auth";
import { Form, Input, Button, Card, Typography } from "antd";
import { Snackbar, Alert } from "@mui/material";

const { Title } = Typography;

export default function AuthForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error";
  }>({ open: false, message: "", severity: "success" });

  async function handleSubmit(values: { username: string; password: string }) {
    setLoading(true);
    try {
      await login(values.username, values.password);
      setSnackbar({ open: true, message: "Logged in successfully", severity: "success" });
      router.push("/dashboard");
    } catch (err) {
      setSnackbar({ open: true, message: "Invalid credentials", severity: "error" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <Card className="w-full max-w-md shadow-lg rounded-xl">
        <div className="text-center mb-6">
          <Title level={3}>Welcome Back</Title>
          <p className="text-gray-500">Please log in to continue</p>
        </div>

        <Form layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            label="Username"
            name="username"
            rules={[{ required: true, message: "Please enter your username" }]}
          >
            <Input placeholder="Enter your username" />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: "Please enter your password" }]}
          >
            <Input.Password placeholder="Enter your password" />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              block
              loading={loading}
              className="rounded-md"
            >
              Login
            </Button>
          </Form.Item>
        </Form>
      </Card>

      {/* MUI Snackbar for alerts */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          severity={snackbar.severity}
          onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
}
