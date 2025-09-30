"use client";

import { useEffect, useState } from "react";
import Layout from "@/components/DashboardSidebar";
import {
    Typography,
    Spin,
    Modal,
    Input,
    Form,
    Button,
    message,
    Table,
    Card,
    Select,
} from "antd";
import { fetchWithAuth } from "@/lib/auth";

const { Title } = Typography;
const { Option } = Select;

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

    const [addModalVisible, setAddModalVisible] = useState(false); // For add modal
    const [form] = Form.useForm();
    const [addForm] = Form.useForm();

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

            const res = await fetchWithAuth(`api/items/${editingItem.itemId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(values),
            });


            const updatedItem = await res;

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

   const handleAdd = async () => {
    try {
        const values = await addForm.validateFields();
        const { groupId, itemName, itemDescription, itemPrice } = values;

        // fetchWithAuth returns JSON directly
        const newItem = await fetchWithAuth(`api/items/group/${groupId}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ itemName, itemDescription, itemPrice }),
        });

        setGroups((prevGroups) =>
            prevGroups.map((group) =>
                group.groupId === groupId
                    ? { ...group, items: [...group.items, newItem] }
                    : group
            )
        );

        message.success("Item added successfully");
        setAddModalVisible(false);
        addForm.resetFields();
    } catch (err) {
        console.error("Error adding item:", err);
        message.error("Failed to add item");
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
                <Button type="primary" onClick={() => handleEdit(record)}>
                    Edit
                </Button>
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

            {/* Add Item Floating Button */}
            <Button
                type="primary"
                style={{
                    position: "fixed",
                    bottom: 30,
                    right: 30,
                    borderRadius: "50%",
                    width: 60,
                    height: 60,
                    fontSize: 24,
                }}
                onClick={() => setAddModalVisible(true)}
            >
                +
            </Button>

            {/* Add Item Modal */}
            <Modal
                title="Add Menu Item"
                open={addModalVisible}
                onCancel={() => setAddModalVisible(false)}
                onOk={handleAdd}
            >
                <Form form={addForm} layout="vertical">
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
                    <Form.Item
                        label="Group"
                        name="groupId"
                        rules={[{ required: true, message: "Please select a group" }]}
                    >
                        <Select placeholder="Select group">
                            {groups.map((group) => (
                                <Option key={group.groupId} value={group.groupId}>
                                    {group.groupName}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>
                </Form>
            </Modal>
        </Layout>
    );
}
