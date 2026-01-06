"use client";

import { useEffect, useState } from "react";
import Layout from "@/components/DashboardSidebar";
import {
  Modal,
  Input,
  Form,
  Button,
  message,
  Select,
} from "antd";
import { fetchWithAuth } from "@/lib/auth";
import { motion, AnimatePresence } from "framer-motion";
import {
  PlusOutlined,
  EditOutlined,
  SearchOutlined,
  CoffeeOutlined,
  DollarOutlined,
  FileTextOutlined,
  AppstoreOutlined,
} from "@ant-design/icons";

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

// Loading skeleton component
const LoadingSkeleton = () => (
  <div className="animate-pulse space-y-6">
    {[1, 2, 3].map((i) => (
      <div key={i} className="bg-white rounded-2xl p-6">
        <div className="h-6 bg-gray-200 rounded w-1/4 mb-6"></div>
        <div className="space-y-4">
          {[1, 2, 3].map((j) => (
            <div key={j} className="flex justify-between items-center">
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
                <div className="h-3 bg-gray-100 rounded w-1/2"></div>
              </div>
              <div className="h-8 bg-gray-200 rounded w-20"></div>
            </div>
          ))}
        </div>
      </div>
    ))}
  </div>
);

// Menu item card component
const MenuItemCard = ({
  item,
  onEdit,
  index,
}: {
  item: MenuItem;
  onEdit: (item: MenuItem) => void;
  index: number;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.05 }}
    className="group flex items-center justify-between p-4 rounded-xl hover:bg-[#f0f9fa] transition-all duration-200 border border-transparent hover:border-[#b0e0e6]/50"
  >
    <div className="flex-1 min-w-0">
      <h4 className="text-gray-800 font-medium truncate">{item.itemName}</h4>
      <p className="text-gray-500 text-sm truncate mt-1">{item.itemDescription}</p>
    </div>
    <div className="flex items-center gap-4 ml-4">
      <span className="text-[#5a9aa8] font-semibold whitespace-nowrap">
        ₹{item.itemPrice.toFixed(2)}
      </span>
      <button
        onClick={() => onEdit(item)}
        className="opacity-0 group-hover:opacity-100 p-2 rounded-lg bg-[#b0e0e6]/20 text-[#5a9aa8] hover:bg-[#b0e0e6]/40 transition-all duration-200"
      >
        <EditOutlined />
      </button>
    </div>
  </motion.div>
);

export default function MenuPage() {
  const [groups, setGroups] = useState<MenuGroup[]>([]);
  const [filteredGroups, setFilteredGroups] = useState<MenuGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGroup, setSelectedGroup] = useState<string>("all");

  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [addModalVisible, setAddModalVisible] = useState(false);

  const [form] = Form.useForm();
  const [addForm] = Form.useForm();

  useEffect(() => {
    async function loadGroups() {
      try {
        const res = await fetchWithAuth("api/groups");
        setGroups(res);
        setFilteredGroups(res);
      } catch (err) {
        console.error("Failed to fetch groups:", err);
        message.error("Failed to load menu groups");
      } finally {
        setLoading(false);
      }
    }
    loadGroups();
  }, []);

  // Filter logic
  useEffect(() => {
    let result = groups;

    // Filter by group
    if (selectedGroup !== "all") {
      result = result.filter((g) => g.groupId.toString() === selectedGroup);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result
        .map((group) => ({
          ...group,
          items: group.items.filter(
            (item) =>
              item.itemName.toLowerCase().includes(query) ||
              item.itemDescription.toLowerCase().includes(query)
          ),
        }))
        .filter((group) => group.items.length > 0);
    }

    setFilteredGroups(result);
  }, [searchQuery, selectedGroup, groups]);

  const handleEdit = (item: MenuItem) => {
    setEditingItem(item);
    form.setFieldsValue(item);
    setModalVisible(true);
  };

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      if (!editingItem) return;

      const updatedItem = await fetchWithAuth(`api/items/${editingItem.itemId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

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

  const totalItems = groups.reduce((acc, group) => acc + group.items.length, 0);

  return (
    <Layout pageTitle="Menu">
      <div className="min-h-screen bg-gradient-to-br from-[#f8fbfc] via-[#f0f7f9] to-[#e8f4f6]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-3xl font-light text-gray-800">
              Menu <span className="font-semibold">Management</span>
            </h1>
            <p className="text-gray-500 mt-1">
              Manage your menu items and categories
            </p>
          </motion.div>

          {/* Stats Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
          >
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-[#b0e0e6]/30">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#b0e0e6] to-[#7cb9c4] flex items-center justify-center">
                  <AppstoreOutlined className="text-white" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Categories</p>
                  <p className="text-xl font-bold text-gray-800">{groups.length}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-[#b0e0e6]/30">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#10B981] to-[#059669] flex items-center justify-center">
                  <CoffeeOutlined className="text-white" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Total Items</p>
                  <p className="text-xl font-bold text-gray-800">{totalItems}</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl shadow-sm border border-[#b0e0e6]/30 p-4 mb-6"
          >
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <SearchOutlined className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search menu items..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#b0e0e6] focus:border-[#5a9aa8] transition-all outline-none"
                />
              </div>
              <select
                value={selectedGroup}
                onChange={(e) => setSelectedGroup(e.target.value)}
                className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#b0e0e6] focus:border-[#5a9aa8] transition-all outline-none bg-white min-w-[180px]"
              >
                <option value="all">All Categories</option>
                {groups.map((group) => (
                  <option key={group.groupId} value={group.groupId.toString()}>
                    {group.groupName}
                  </option>
                ))}
              </select>
            </div>
          </motion.div>

          {/* Content */}
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <LoadingSkeleton />
              </motion.div>
            ) : filteredGroups.length === 0 ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-2xl p-12 text-center shadow-sm border border-[#b0e0e6]/30"
              >
                <CoffeeOutlined className="text-5xl text-gray-300 mb-4" />
                <p className="text-gray-500">No menu items found</p>
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="mt-4 text-[#5a9aa8] hover:underline"
                  >
                    Clear search
                  </button>
                )}
              </motion.div>
            ) : (
              <motion.div
                key="content"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-6"
              >
                {filteredGroups.map((group, groupIndex) => (
                  <motion.div
                    key={group.groupId}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: groupIndex * 0.1 }}
                    className="bg-white rounded-2xl shadow-sm border border-[#b0e0e6]/30 overflow-hidden"
                  >
                    {/* Group Header */}
                    <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-[#f8fbfc] to-white">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-[#b0e0e6]/30 flex items-center justify-center">
                            <CoffeeOutlined className="text-[#5a9aa8]" />
                          </div>
                          <h3 className="text-lg font-semibold text-gray-800">
                            {group.groupName}
                          </h3>
                        </div>
                        <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                          {group.items.length} items
                        </span>
                      </div>
                    </div>

                    {/* Items List */}
                    <div className="divide-y divide-gray-50">
                      {group.items.map((item, index) => (
                        <MenuItemCard
                          key={item.itemId}
                          item={item}
                          onEdit={handleEdit}
                          index={index}
                        />
                      ))}
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Floating Add Button */}
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setAddModalVisible(true)}
            className="fixed bottom-8 right-8 w-14 h-14 rounded-full bg-gradient-to-br from-[#7cb9c4] to-[#5a9aa8] text-white shadow-lg hover:shadow-xl flex items-center justify-center transition-shadow"
          >
            <PlusOutlined className="text-xl" />
          </motion.button>

          {/* Edit Modal */}
          <Modal
            title={null}
            open={modalVisible}
            onCancel={() => setModalVisible(false)}
            footer={null}
            centered
            className="custom-modal"
          >
            <div className="p-2">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#b0e0e6] to-[#7cb9c4] flex items-center justify-center">
                  <EditOutlined className="text-white" />
                </div>
                <h2 className="text-xl font-semibold text-gray-800">Edit Menu Item</h2>
              </div>

              <Form form={form} layout="vertical">
                <Form.Item
                  label={<span className="text-gray-600 font-medium">Item Name</span>}
                  name="itemName"
                  rules={[{ required: true, message: "Please enter item name" }]}
                >
                  <Input
                    prefix={<CoffeeOutlined className="text-gray-400 mr-2" />}
                    className="rounded-xl py-2"
                    placeholder="Enter item name"
                  />
                </Form.Item>
                <Form.Item
                  label={<span className="text-gray-600 font-medium">Description</span>}
                  name="itemDescription"
                  rules={[{ required: true, message: "Please enter description" }]}
                >
                  <Input.TextArea
                    className="rounded-xl"
                    rows={3}
                    placeholder="Enter description"
                  />
                </Form.Item>
                <Form.Item
                  label={<span className="text-gray-600 font-medium">Price</span>}
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
                  <Input
                    type="number"
                    prefix={<span className="text-gray-400 mr-1">₹</span>}
                    className="rounded-xl py-2"
                    placeholder="0.00"
                  />
                </Form.Item>
              </Form>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setModalVisible(false)}
                  className="flex-1 py-3 rounded-xl border border-gray-200 text-gray-600 font-medium hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="flex-1 py-3 rounded-xl bg-gradient-to-r from-[#7cb9c4] to-[#5a9aa8] text-white font-medium hover:opacity-90 transition-opacity"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </Modal>

          {/* Add Modal */}
          <Modal
            title={null}
            open={addModalVisible}
            onCancel={() => setAddModalVisible(false)}
            footer={null}
            centered
            className="custom-modal"
          >
            <div className="p-2">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#10B981] to-[#059669] flex items-center justify-center">
                  <PlusOutlined className="text-white" />
                </div>
                <h2 className="text-xl font-semibold text-gray-800">Add Menu Item</h2>
              </div>

              <Form form={addForm} layout="vertical">
                <Form.Item
                  label={<span className="text-gray-600 font-medium">Category</span>}
                  name="groupId"
                  rules={[{ required: true, message: "Please select a category" }]}
                >
                  <Select
                    placeholder="Select category"
                    className="rounded-xl"
                    size="large"
                  >
                    {groups.map((group) => (
                      <Option key={group.groupId} value={group.groupId}>
                        {group.groupName}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
                <Form.Item
                  label={<span className="text-gray-600 font-medium">Item Name</span>}
                  name="itemName"
                  rules={[{ required: true, message: "Please enter item name" }]}
                >
                  <Input
                    prefix={<CoffeeOutlined className="text-gray-400 mr-2" />}
                    className="rounded-xl py-2"
                    placeholder="Enter item name"
                  />
                </Form.Item>
                <Form.Item
                  label={<span className="text-gray-600 font-medium">Description</span>}
                  name="itemDescription"
                  rules={[{ required: true, message: "Please enter description" }]}
                >
                  <Input.TextArea
                    className="rounded-xl"
                    rows={3}
                    placeholder="Enter description"
                  />
                </Form.Item>
                <Form.Item
                  label={<span className="text-gray-600 font-medium">Price</span>}
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
                  <Input
                    type="number"
                    prefix={<span className="text-gray-400 mr-1">₹</span>}
                    className="rounded-xl py-2"
                    placeholder="0.00"
                  />
                </Form.Item>
              </Form>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setAddModalVisible(false)}
                  className="flex-1 py-3 rounded-xl border border-gray-200 text-gray-600 font-medium hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAdd}
                  className="flex-1 py-3 rounded-xl bg-gradient-to-r from-[#10B981] to-[#059669] text-white font-medium hover:opacity-90 transition-opacity"
                >
                  Add Item
                </button>
              </div>
            </div>
          </Modal>
        </div>
      </div>
    </Layout>
  );
}