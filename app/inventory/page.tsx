import Layout from "@/app/dashboard/layout";
import { Typography, Paper } from "@mui/material";

export default function InventoryPage() {
  return (
    <Layout pageTitle="Inventory">
      <Typography variant="h4" gutterBottom>
        Inventory Dashboard
      </Typography>
      <Paper sx={{ p: 3 }}>Manage your stock and inventory levels here.</Paper>
    </Layout>
  );
}
