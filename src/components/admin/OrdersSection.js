import React, { useState } from 'react';
import { useWebsite } from '../../context/WebsiteContext';
import Modal from '../Modal';

const OrdersSection = () => {
  const { orders } = useWebsite();

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [updateStatus, setUpdateStatus] = useState('');

  // Sample orders (would normally come from database)
  const sampleOrders = orders.length > 0 ? orders : [
    {
      id: 'ORD-001',
      date: '2023-10-15',
      customer: {
        name: 'John Smith',
        email: 'john.smith@example.com',
        phone: '(555) 123-4567',
        address: '123 Main St, Austin, TX 78701'
      },
      items: [
        { id: 1, name: 'Handcrafted Leather Wallet', quantity: 1, price: '$95' },
        { id: 2, name: 'Artisan Belt', quantity: 1, price: '$120' }
      ],
      status: 'Pending',
      total: '$215'
    },
    {
      id: 'ORD-002',
      date: '2023-10-12',
      customer: {
        name: 'Sarah Johnson',
        email: 'sarah.j@example.com',
        phone: '(555) 987-6543',
        address: '456 Oak Dr, Austin, TX 78704'
      },
      items: [
        { id: 3, name: 'Desert Messenger Bag', quantity: 1, price: '$275' }
      ],
      status: 'Shipped',
      total: '$275'
    }
  ];

  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    setIsViewModalOpen(true);
  };

  const handleUpdateClick = (order) => {
    setSelectedOrder(order);
    setUpdateStatus(order.status);
    setIsUpdateModalOpen(true);
  };

  const handleUpdateStatus = () => {
    // In a real app, this would update the order status in the database
    setIsUpdateModalOpen(false);
    // For now, we're just closing the modal without updating state
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-green-100 text-green-800';
      case 'delivered':
        return 'bg-purple-100 text-purple-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="animate-fadeIn">
      <h2 className="text-xl font-semibold mb-4">Customer Orders</h2>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-2 px-4 text-left border-b">Order ID</th>
              <th className="py-2 px-4 text-left border-b">Date</th>
              <th className="py-2 px-4 text-left border-b">Customer</th>
              <th className="py-2 px-4 text-left border-b">Status</th>
              <th className="py-2 px-4 text-left border-b">Total</th>
              <th className="py-2 px-4 text-left border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sampleOrders.map((order) => (
              <tr key={order.id} className="border-b hover:bg-gray-50">
                <td className="py-2 px-4">{order.id}</td>
                <td className="py-2 px-4">{order.date}</td>
                <td className="py-2 px-4">{order.customer.name}</td>
                <td className="py-2 px-4">
                  <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                </td>
                <td className="py-2 px-4">{order.total}</td>
                <td className="py-2 px-4">
                  <button
                    onClick={() => handleViewOrder(order)}
                    className="text-blue-600 hover:text-blue-800 mr-2"
                  >
                    View
                  </button>
                  <button
                    onClick={() => handleUpdateClick(order)}
                    className="text-green-600 hover:text-green-800"
                  >
                    Update
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* View Order Modal */}
      <Modal isOpen={isViewModalOpen} onClose={() => setIsViewModalOpen(false)} title={`Order Details: ${selectedOrder?.id}`}>
        {selectedOrder && (
          <div className="space-y-4">
            <div className="flex justify-between">
              <div>
                <h3 className="font-medium">Date</h3>
                <p>{selectedOrder.date}</p>
              </div>
              <div>
                <h3 className="font-medium">Status</h3>
                <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(selectedOrder.status)}`}>
                  {selectedOrder.status}
                </span>
              </div>
            </div>

            <div className="border-t pt-4">
              <h3 className="font-medium mb-2">Customer Information</h3>
              <p><span className="font-medium">Name:</span> {selectedOrder.customer.name}</p>
              <p><span className="font-medium">Email:</span> {selectedOrder.customer.email}</p>
              <p><span className="font-medium">Phone:</span> {selectedOrder.customer.phone}</p>
              <p><span className="font-medium">Address:</span> {selectedOrder.customer.address}</p>
            </div>

            <div className="border-t pt-4">
              <h3 className="font-medium mb-2">Order Items</h3>
              <table className="min-w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="py-1 px-2 text-left">Item</th>
                    <th className="py-1 px-2 text-center">Qty</th>
                    <th className="py-1 px-2 text-right">Price</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedOrder.items.map((item) => (
                    <tr key={item.id} className="border-b">
                      <td className="py-2 px-2">{item.name}</td>
                      <td className="py-2 px-2 text-center">{item.quantity}</td>
                      <td className="py-2 px-2 text-right">{item.price}</td>
                    </tr>
                  ))}
                  <tr className="font-medium">
                    <td className="py-2 px-2" colSpan={2}>Total</td>
                    <td className="py-2 px-2 text-right">{selectedOrder.total}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="text-right">
              <button
                onClick={() => setIsViewModalOpen(false)}
                className="px-4 py-2 border rounded"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Update Status Modal */}
      <Modal isOpen={isUpdateModalOpen} onClose={() => setIsUpdateModalOpen(false)} title="Update Order Status">
        {selectedOrder && (
          <div className="space-y-4">
            <p className="mb-4">
              Updating status for order <span className="font-medium">{selectedOrder.id}</span>
            </p>

            <div>
              <label className="block mb-2 font-medium">Order Status</label>
              <select
                value={updateStatus}
                onChange={(e) => setUpdateStatus(e.target.value)}
                className="w-full p-2 border rounded"
              >
                <option value="Pending">Pending</option>
                <option value="Processing">Processing</option>
                <option value="Shipped">Shipped</option>
                <option value="Delivered">Delivered</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <button
                onClick={() => setIsUpdateModalOpen(false)}
                className="px-4 py-2 border rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateStatus}
                className="px-4 py-2 bg-green-600 text-white rounded"
              >
                Update Status
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default OrdersSection;
