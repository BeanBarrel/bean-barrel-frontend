import Layout from "@/app/dashboard/layout";
import { Typography, Paper } from "@mui/material";

export default function CustomersPage() {
  return (
    <Layout pageTitle="Customers">
      <Typography variant="h4" gutterBottom>
        Customer Management
      </Typography>
      <Paper sx={{ p: 3 }}>View and manage your customers here.</Paper>
    </Layout>
  );
}
