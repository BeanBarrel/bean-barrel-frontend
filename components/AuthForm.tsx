"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { login } from "@/lib/auth";
import { Form, Input, Button, Card } from "antd";
import { Snackbar, Alert } from "@mui/material";
import { motion } from "framer-motion";
import { LockOutlined, UserOutlined } from "@ant-design/icons";

// Floating Particles Background
const FloatingParticles = () => {
  const particles = Array.from({ length: 15 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: 6 + Math.random() * 12,
    duration: 20 + Math.random() * 15,
    delay: Math.random() * 5,
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full bg-[#b0e0e6]/40"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: particle.size,
            height: particle.size,
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            delay: particle.delay,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
};

export default function AuthForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState<string | null>(null);

  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error";
  }>({ open: false, message: "", severity: "success" });

  async function handleSubmit(values: { username: string; password: string }) {
    setLoading(true);
    try {
      await login(values.username, values.password);
      setSnackbar({ open: true, message: "Welcome back! Redirecting...", severity: "success" });
      setTimeout(() => router.push("/dashboard"), 1000);
    } catch (e) {
      setSnackbar({ open: true, message: "Invalid credentials. Please try again.", severity: "error" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#f8fbfc] via-[#e8f4f6] to-[#d4eef2] relative overflow-hidden">
      <FloatingParticles />
      
      {/* Ambient glow effects */}
      <motion.div
        className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#b0e0e6]/30 rounded-full blur-[120px]"
        animate={{ opacity: [0.4, 0.6, 0.4] }}
        transition={{ duration: 8, repeat: Infinity }}
      />
      <motion.div
        className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-[#b0e0e6]/40 rounded-full blur-[100px]"
        animate={{ opacity: [0.5, 0.7, 0.5] }}
        transition={{ duration: 10, repeat: Infinity }}
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-md px-4"
      >
        <Card 
          className="w-full border-0 overflow-hidden"
          style={{ 
            borderRadius: '20px',
            background: 'rgba(255, 255, 255, 0.85)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(176, 224, 230, 0.4)',
            boxShadow: '0 25px 50px -12px rgba(176, 224, 230, 0.3)',
          }}
          styles={{ body: { padding: '48px 40px' } }}
        >
          {/* Header Section */}
          <motion.div 
            className="text-center mb-10"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            {/* Brand Mark */}
            <motion.div 
              className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-6"
              style={{
                background: 'linear-gradient(135deg, #b0e0e6 0%, #7cb9c4 100%)',
                boxShadow: '0 10px 40px -10px rgba(124, 185, 196, 0.5)',
              }}
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              <span className="text-2xl font-bold text-white">BB</span>
            </motion.div>
            
            <h1 className="text-3xl font-light text-gray-800 tracking-wide mb-2">
              Bean <span className="font-semibold">Barrel</span>
            </h1>
            
            <motion.div 
              className="flex items-center justify-center gap-3 mt-4"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              <div className="h-px w-16 bg-gradient-to-r from-transparent to-[#7cb9c4]"/>
              <span className="text-[#5a9aa8] text-xs font-medium uppercase tracking-[0.3em]">
                Admin
              </span>
              <div className="h-px w-16 bg-gradient-to-l from-transparent to-[#7cb9c4]"/>
            </motion.div>
          </motion.div>

          {/* Login Form */}
          <Form layout="vertical" onFinish={handleSubmit}>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Form.Item
                name="username"
                rules={[{ required: true, message: "Username is required" }]}
                className="mb-5"
              >
                <Input
                  prefix={
                    <UserOutlined 
                      className={`transition-colors duration-300 mr-2 ${
                        focused === 'username' ? 'text-[#5a9aa8]' : 'text-gray-400'
                      }`}
                    />
                  }
                  placeholder="Username"
                  size="large"
                  onFocus={() => setFocused('username')}
                  onBlur={() => setFocused(null)}
                  style={{ 
                    height: '56px',
                    fontSize: '15px',
                    background: '#fff',
                    border: '1px solid #d4eef2',
                    borderRadius: '12px',
                    color: '#333',
                  }}
                  className="hover:border-[#b0e0e6] focus:border-[#7cb9c4] transition-all duration-300"
                />
              </Form.Item>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Form.Item
                name="password"
                rules={[{ required: true, message: "Password is required" }]}
                className="mb-8"
              >
                <Input.Password
                  prefix={
                    <LockOutlined 
                      className={`transition-colors duration-300 mr-2 ${
                        focused === 'password' ? 'text-[#5a9aa8]' : 'text-gray-400'
                      }`}
                    />
                  }
                  placeholder="Password"
                  size="large"
                  onFocus={() => setFocused('password')}
                  onBlur={() => setFocused(null)}
                  style={{ 
                    height: '56px',
                    fontSize: '15px',
                    background: '#fff',
                    border: '1px solid #d4eef2',
                    borderRadius: '12px',
                    color: '#333',
                  }}
                  className="hover:border-[#b0e0e6] focus:border-[#7cb9c4] transition-all duration-300"
                />
              </Form.Item>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Form.Item className="mb-0">
                <Button
                  type="primary"
                  htmlType="submit"
                  block
                  loading={loading}
                  size="large"
                  className="font-medium text-base tracking-wide transition-all duration-300 hover:opacity-90"
                  style={{
                    height: '56px',
                    borderRadius: '12px',
                    background: 'linear-gradient(135deg, #7cb9c4 0%, #5a9aa8 100%)',
                    border: 'none',
                    color: '#fff',
                    boxShadow: '0 10px 40px -10px rgba(90, 154, 168, 0.4)',
                  }}
                >
                  {loading ? 'Signing in...' : 'Sign In'}
                </Button>
              </Form.Item>
            </motion.div>
          </Form>

          {/* Footer */}
          <motion.div 
            className="text-center mt-10 pt-6 border-t border-[#d4eef2]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <p className="text-gray-400 text-xs tracking-wide">
              © {new Date().getFullYear()} Bean Barrel Coffee Co.
            </p>
          </motion.div>
        </Card>

        {/* Forgot password link */}
        <motion.p 
          className="text-center mt-6 text-[#5a9aa8] text-sm hover:text-[#7cb9c4] transition-colors cursor-pointer"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          Forgot your password?
        </motion.p>
      </motion.div>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          severity={snackbar.severity}
          onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
          sx={{ 
            width: "100%",
            borderRadius: '12px',
            fontWeight: 500,
            '&.MuiAlert-standardSuccess': {
              backgroundColor: '#d4eef2',
              color: '#2d5a63',
            },
            '&.MuiAlert-standardError': {
              backgroundColor: '#ffeaea',
              color: '#c53030',
            },
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
}