"use client";

import { useEffect, useState } from "react";
import Layout from "@/components/DashboardSidebar";
import { Typography, Spin, Modal, Input, Form, Button, message, Table, Card } from "antd";
import { fetchWithAuth } from "@/lib/auth";

const { Title } = Typography;

interface MenuItem {
    itemId: number;
    itemName: string;
    itemDescription: string;
    itemPrice: number;
}

interface MenuGroup {
    groupId: number;
    groupName: string;
    items: MenuItem[];
}

export default function MenuPage() {
    const [groups, setGroups] = useState<MenuGroup[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
    const [modalVisible, setModalVisible] = useState(false);
   

    const [form] = Form.useForm();

    useEffect(() => {
        async function loadGroups() {
            try {
                const res = await fetchWithAuth("api/groups");
                setGroups(res);
            } catch (err) {
                console.error("Failed to fetch groups:", err);
                message.error("Failed to load menu groups");
            } finally {
                setLoading(false);
            }
        }

        loadGroups();
    }, []);

    const handleEdit = (item: MenuItem) => {
        setEditingItem(item);
        form.setFieldsValue(item);
        setModalVisible(true);
    };

    const handleSave = async () => {
        try {
            const values = await form.validateFields();
            if (!editingItem) return;

            console.log("Editing item ID:", editingItem.itemId);
            console.log("Values to be sent:", values);

            const res = await fetchWithAuth(`api/items/${editingItem.itemId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(values),
            });

            if (!res.ok) {
                const text = await res.text();
                throw new Error(text || "Failed to update item");
            }

            const updatedItem = await res.json();
            console.log("Updated item from server:", updatedItem);

            setGroups((prevGroups) =>
                prevGroups.map((group) => ({
                    ...group,
                    items: group.items.map((item) =>
                        item.itemId === updatedItem.itemId ? updatedItem : item
                    ),
                }))
            );

            message.success("Item updated successfully");
            setModalVisible(false);
            setEditingItem(null);
        } catch (err) {
            console.error("Error updating item:", err);
            message.error("Failed to update item");
        }
    };


    const columns = [
        {
            title: "Item Name",
            dataIndex: "itemName",
            key: "itemName",
        },
        {
            title: "Description",
            dataIndex: "itemDescription",
            key: "itemDescription",
        },
        {
            title: "Price",
            dataIndex: "itemPrice",
            key: "itemPrice",
            render: (price: number) => `₹${price.toFixed(2)}`,
        },
        {
            title: "Action",
            key: "action",
            render: (_: unknown, record: MenuItem) => (
                <div style={{ display: "flex", gap: "8px" }}>
                    <Button type="primary" onClick={() => handleEdit(record)}>
                        Edit
                    </Button>
                 
                </div>
            ),
        },
    ];

    if (loading) {
        return (
            <Layout pageTitle="Menu">
                <Spin size="large" style={{ display: "block", margin: "50px auto" }} />
            </Layout>
        );
    }

    return (
        <Layout pageTitle="Menu">
            <Title level={4}>Menu Management</Title>
            {groups.map((group) => (
                <Card key={group.groupId} title={group.groupName} style={{ marginBottom: 24 }}>
                    <Table rowKey="itemId" columns={columns} dataSource={group.items} pagination={false} />
                </Card>
            ))}

            {/* Edit Modal */}
            <Modal
                title="Edit Menu Item"
                open={modalVisible}
                onCancel={() => setModalVisible(false)}
                onOk={handleSave}
            >
                <Form form={form} layout="vertical">
                    <Form.Item
                        label="Item Name"
                        name="itemName"
                        rules={[{ required: true, message: "Please enter item name" }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="Description"
                        name="itemDescription"
                        rules={[{ required: true, message: "Please enter description" }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="Price"
                        name="itemPrice"
                        rules={[
                            { required: true, message: "Please enter price" },
                            {
                                type: "number",
                                min: 0,
                                transform: (value) => Number(value),
                                message: "Price must be a positive number",
                            },
                        ]}
                    >
                        <Input type="number" />
                    </Form.Item>
                </Form>
            </Modal>

          
        </Layout>
    );
}
