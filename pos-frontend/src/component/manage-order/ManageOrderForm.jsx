import React, { useState, useEffect } from 'react';
import { Container, Table } from 'react-bootstrap';
import NavbarHeader from "../NavbarHeader";
import { getOrderDetails } from "../controller/ManageOrderFormController";

const OrderList = () => {
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        loadOrders();
    }, []);

    const loadOrders = async () => {
        try {
            const ordersData = await getOrderDetails();
            setOrders(ordersData);
        } catch (error) {
            console.error('Error fetching orders:', error);
        }
    };

    return (
        <>
            <NavbarHeader />
            <Container fluid className="bg-light row me-0 pe-0 ms-0 ps-0 mt-5">
                <h4 className="fw-semibold fst-italic col-12 pt-4 pb-2 ps-4">Orders List</h4>
                <Container className="card ps-0 pe-0 col-md-10 ms-1 row col-sm-12">
                    <Table bordered hover>
                        <thead className="table-primary">
                            <tr>
                                <th scope="col" className="text-center">Order ID</th>
                                <th scope="col" className="text-center">Date</th>
                                <th scope="col" className="text-center">Customer ID</th>
                                <th scope="col" className="text-center">Total Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map(order => (
                                <tr key={order.o_id}>
                                    <td>{order.o_id}</td>
                                    <td>{order.date}</td>
                                    <td>{order.customer_id}</td>
                                    <td>{order.tot_discount_issued}</td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </Container>
            </Container>
        </>
    );
};

export default OrderList;
