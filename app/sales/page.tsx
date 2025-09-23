import Layout from "@/components/DashboardSidebar";
import { Typography, Paper } from "@mui/material";

export default function SalesPage() {
  return (
    <Layout pageTitle="Sales">
      <Typography variant="h4" gutterBottom>
        Sales Dashboard
      </Typography>
      <Paper sx={{ p: 3 }}>Track your sales, revenue, and orders here.</Paper>
    </Layout>
  );
}
