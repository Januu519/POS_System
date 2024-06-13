import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Button, Table, Modal } from 'react-bootstrap';
import NavbarHeader from "../NavbarHeader";
import { searchCustomerById } from "../controller/CustomerFormController";
import { loadAllItemCodes, searchItemById } from "../controller/ItemFormController";
import { showAlert } from "../Alerts";
import { placeOrder } from "../controller/PlaceOrderFormController";
import $ from "jquery";

const PlaceOrderForm = () => {
    const [customerID, setCustomerID] = useState('');
    const [itemCodes, setItemCodes] = useState([]); // State to store item codes
    const [selectedItemCode, setSelectedItemCode] = useState(''); // State for selected item code
    const [cart, setCart] = useState([]); // State to store cart items
    const [total, setTotal] = useState(0); // State for total amount

    // use effect
    useEffect(() => {
        // Load item codes when the component is mounted
        loadItemCodesOnClick();
    }, []);

    // customer state model
    const [customerDetails, setCustomerDetails] = useState({
        contact: '',
        name: '',
        address: '',
    });

    const handleCustomerIDChange = (event) => {
        setCustomerID(event.target.value);
    };

    // Function to handle item code selection
    const handleItemCodeChange = (event) => {
    
        setSelectedItemCode(event.target.value);
    };

    // Function to get item details based on the selected item code
    const getSelectedItemDetails = async (selectedCode) => {
        try {
            const itemData = await searchItemById(selectedCode);
            console.log(itemData);
            // Update the item details in the form
            $('#txtItemName').val(itemData.item_name);
            $('#txtUnitPrice').val(itemData.unit_price);
            $('#txtAvailableQTYOnHand').val(itemData.qty_on_hand);
        } catch (error) {
            console.error('Item not found:', error);
            showAlert('center', 'error', 'Invalid Item Code, No such item found!');
        }
    };

    // search customer after ID entered
    const handleKeyPress = async (event) => {
        if (event.key === 'Enter') {
            // set customer id
            setCustomerID(event.target.value);

            // search customer
            try {
                const customerData = await searchCustomerById(customerID);
                setCustomerDetails({
                    contact: customerData.contact,
                    name: customerData.name,
                    address: customerData.address,
                });
            } catch (error) {
                // Handle error if customer is not found
                console.error('Customer not found:', error);
                // trigger alert
                showAlert("center", "error", "Invalid Customer ID, No such customer found!");
            }
        }
    };

    const handleKeyPressItem = async (event) => {
        if (event.key === 'Enter') {
            // set customer id
            setSelectedItemCode(event.target.value);

            // search customer
            try {
                const customerData = await searchItemById(selectedItemCode);

                // Update the item details in the form
                $('#txtItemName').val(customerData.item_name);
                $('#txtUnitPrice').val(customerData.unit_price);
                $('#txtAvailableQTYOnHand').val(customerData.qty_on_hand);

            
            } catch (error) {
                // Handle error if customer is not found
                console.error('Customer not found:', error);
                // trigger alert
                showAlert("center", "error", "Invalid Customer ID, No such customer found!");
            }
        }
    };

    // Function to load item codes when the combo box is clicked
    const loadItemCodesOnClick = async () => {
        try {
            const codes = await loadAllItemCodes();
            setItemCodes(codes);
        } catch (error) {
            console.error('Error fetching item codes:', error);
            showAlert('center', 'error', 'Error fetching item codes.');
        }
    };

    const addToCart = () => {
        const itemCode = selectedItemCode;
        const itemName = $('#txtItemName').val();
        const unitPrice = parseFloat($('#txtUnitPrice').val());
        const qtyBought = parseInt($('#selectQTY').val());

        if (itemCode === 'None' || !qtyBought) {
            showAlert('center', 'error', 'Please select an item and enter quantity.');
            return;
        }

        const newItem = {
            item_code: itemCode,
            item_name: itemName,
            unit_price: unitPrice,
            qty_bought: qtyBought,
        };

        setCart([...cart, newItem]);

        // Update the total
        const newTotal = total + unitPrice * qtyBought;
        setTotal(newTotal);
    };

    const confirmOrder = async () => {
        const orderObj = {
            o_id: 2,
            date: "26-07-2023",
            customer_id: customerID,
            items: cart,
            total_amount: total,
            tot_discount_issued: total,
        };

        try {
            const success = await placeOrder(orderObj);
            if (success) {
                showAlert('center', 'success', 'Order placed successfully!');
                setCart([]);
                setTotal(0);
            } else {
                showAlert('center', 'success', 'Order placed successfully!');
            }
        } catch (error) {
            showAlert('center', 'error', 'Process failed!');
        }
    };

    return (
        <>
            <NavbarHeader/>
            <Container fluid className="bg-light row me-0 pe-0 ms-0 ps-0 mt-5">
                {/* Heading */}
                <h4 className="fw-semibold fst-italic col-12 pt-4 pb-2 ps-4">Place Order Form</h4>

                {/* Invoice Details */}
                <Container className="card ps-0 pe-0 col-md-4 ms-3 row col-sm-12">
                    <h5 className="card-header bg-primary text-white">Invoice Details</h5>
                    <div className="card-body border-0 p-0">
                        <Row className="g-2 mt-1 ms-2">
                            <Col md={6}>
                                <label className="form-label">Date : </label>
                                <input id="date" type="date" className="form-control" placeholder="" aria-label=""/>
                            </Col>
                            <Col md={5}>
                                <label className="form-label">Order ID : </label>
                                <input
                                    id="cbxSelectOrderID"
                                    className="form-control fw-semibold"
                                    type="text"
                                    value=""
                                    aria-label="Disabled input example"
                                    disabled
                                />
                            </Col>
                            <Col md={5}>
                                <label className="form-label">Enter Customer ID : </label>
                                <input
                                    id="cbxSelectCustID"
                                    className="form-control fw-semibold"
                                    type="text"
                                    value={customerID}
                                    onChange={handleCustomerIDChange}
                                    onKeyDown={handleKeyPress}
                                    aria-label=""
                                />
                            </Col>
                            <Col md={6}>
                                <label className="form-label">Customer Contact : </label>
                                <input
                                    id="txtCusContact"
                                    className="form-control text-danger"
                                    type="text"
                                    value={customerDetails.contact}
                                    aria-label="Disabled input example"
                                    disabled
                                    readOnly
                                />
                            </Col>
                            <Col md={11}>
                                <label className="form-label">Customer Name : </label>
                                <input
                                    id="txtCusName"
                                    className="form-control text-danger"
                                    type="text"
                                    value={customerDetails.name}
                                    aria-label="Disabled input example"
                                    disabled
                                    readOnly
                                />
                            </Col>
                            <Col md={11} className="mb-3">
                                <label className="form-label">Customer Address : </label>
                                <input
                                    id="txtCusAddress"
                                    className="form-control text-danger"
                                    type="text"
                                    value={customerDetails.address}
                                    aria-label="Disabled input example"
                                    disabled
                                    readOnly
                                />
                            </Col>
                        </Row>
                    </div>
                </Container>

                {/* Select Item */}
                <Container className="card ps-0 pe-0 col-md-4 ms-4 row col-sm-12">
                    <h5 className="card-header bg-primary text-white">Select Item</h5>
                    <div className="card-body border-0 p-0">
                        <Row className="g-2 mt-1 ms-2">
                            <Col md={5}>
                                <label className="form-label">Select Item Code : </label>
                            
                                <input
                                    id="cbxSelectItemCode"
                                    className="form-control fw-semibold"
                                    type="text"
                                    value={selectedItemCode}
                                    onChange={handleItemCodeChange}
                                    onKeyDown={handleKeyPressItem}
                                    aria-label=""
                                />
                            </Col>
                            <Col md={6}>
                                <label className="form-label">Available Quantity On Hand : </label>
                                <input
                                    id="txtAvailableQTYOnHand"
                                    className="form-control text-danger"
                                    type="number"
                                    value=""
                                    aria-label="Disabled input example"
                                    disabled
                                    readOnly
                                />
                            </Col>
                            <Col md={11}>
                                <label className="form-label">Item Name : </label>
                                <input
                                    id="txtItemName"
                                    className="form-control text-danger"
                                    type="text"
                                    value=""
                                    aria-label="Disabled input example"
                                    disabled
                                    readOnly
                                />
                            </Col>
                            <Col md={4}>
                                <label className="form-label">Unit Price : </label>
                                <input
                                    id="txtUnitPrice"
                                    className="form-control text-danger"
                                    type="number"
                                    value=""
                                    aria-label="Disabled input example"
                                    disabled
                                    readOnly
                                />
                            </Col>
                            <Col md={3}>
                                <label className="form-label">Select Quantity : </label>
                                <input id="selectQTY" type="number" className="form-control text-danger"
                                       placeholder="" aria-label=""/>
                            </Col>
                            <Col md={5} style={{marginTop: '8%'}}>
                                <Button id="btnAddToCart" type="button" className="btn btn-warning" onClick={addToCart}>+ Add To
                                    Cart</Button>
                            </Col>
                            <Col md={12} className="row justify-content-end gap-2" style={{marginTop: '8%'}}>
                                <Button
                                    id="btnRemoveItemFromCart"
                                    type="button"
                                    className="btn btn-danger col-4"
                                    data-bs-toggle="modal"
                                    data-bs-target="#staticBackdrop9"
                                    disabled
                                >
                                    - Remove Item
                                </Button>
                            </Col>
                        </Row>
                    </div>
                </Container>

                {/* Remove Item from Cart Modal */}
                <Modal show={false} backdrop="static" keyboard={false} id="staticBackdrop9" tabIndex="-1"
                       aria-labelledby="staticBackdropLabel" aria-hidden="true">
                    <Modal.Dialog dialogClassName="modal-dialog-top">
                        <Modal.Header closeButton>
                            <Modal.Title id="staticBackdropLabel9">Remove Item</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <div className="mb-3">
                                <label htmlFor="formGroupExampleInput" className="form-label">
                                    Are you sure you want to remove this item from the cart?
                                </label>
                                <br/>
                                <label htmlFor="formGroupExampleInput2" className="form-label fw-semibold">
                                    Code :{' '}
                                </label>
                                <label id="lbl_Cart_Remove_Item_Code" htmlFor="formGroupExampleInput"
                                       className="form-label fw-semibold"></label>
                                <br/>
                                <label htmlFor="formGroupExampleInput" className="form-label fw-semibold">
                                    Name :{' '}
                                </label>
                                <label id="lbl_Cart_Remove_Item_Name" htmlFor="formGroupExampleInput"
                                       className="form-label fw-semibold"></label>
                            </div>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" data-bs-dismiss="modal">
                                No
                            </Button>
                            <Button id="btnDeleteFromCart" variant="danger">
                                Yes
                            </Button>
                        </Modal.Footer>
                    </Modal.Dialog>
                </Modal>

                {/* Confirm Order */}
                <Container className="card ps-0 pe-0 col-md-3 ms-5 row col-sm-12">
                    <div className="card-body border-0 p-0">
                        <h5 className="mt-3 ms-4 col-5 text-danger text-start fs-3" style={{display: 'inline-block'}}>
                            Total :
                        </h5>
                        <h5 id="lblGrandTotal" className="mt-3 col-6 text-danger text-start fs-3"
                            style={{display: 'inline-block'}}>
                            {total.toFixed(2)} /=
                        </h5>
                        <h5 className="mt-1 ms-4 col-5 text-danger text-start fs-3" style={{display: 'inline-block'}}>
                            Sub Total :
                        </h5>
                        <h5 id="lblSubTotal" className="mt-1 col-5 text-danger text-start fs-3"
                            style={{display: 'inline-block'}}>
                            {(total - (parseFloat($('#txtDiscountGiven').val()) || 0)).toFixed(2)} /=
                        </h5>

                        <Row className="col-12 mt-2">
                            <Col md={7} className="ms-3">
                                <label className="form-label">Cash : </label>
                                <input id="txtCashAmt" type="number" className="form-control"
                                       placeholder="Ex: 5000.00" aria-label=""/>
                            </Col>
                            <Col md={4}>
                                <label className="form-label">Discount : </label>
                                <input id="txtDiscountGiven" type="number" className="form-control"
                                       placeholder="Ex: 15" aria-label=""/>
                            </Col>
                            <Col md={11} className="ms-3 mt-3">
                                <label className="form-label">Balance : </label>
                                <input id="txtBalanceAmt" type="number" className="form-control"
                                       placeholder="" aria-label="" disabled/>
                            </Col>
                            <Col md={12}>
                                <Button id="btnConfirmOrder" variant="success" size="lg" className="col-11 ms-4 mt-4
                                 mb-3 h-75"
                                        onClick={confirmOrder}>
                                    Confirm Order
                                </Button>
                            </Col>
                        </Row>
                    </div>
                </Container>

                {/* Place Order Details Table */}
                <Container className="mt-2 justify-content-center col-md-12 col-sm-12">
                    <Table bordered hover>
                        <thead className="table-primary">
                        <tr>
                            <th scope="col" className="text-center">
                                Item Code
                            </th>
                            <th scope="col" className="text-center">
                                Item Name
                            </th>
                            <th scope="col" className="text-center">
                                Unit Price
                            </th>
                            <th scope="col" className="text-center">
                                Quantity Bought
                            </th>
                        </tr>
                        </thead>
                        <tbody id="tbl_Cart_Body">
                            {cart.map((item, index) => (
                                <tr key={index}>
                                    <td className="text-center">{item.item_code}</td>
                                    <td className="text-center">{item.item_name}</td>
                                    <td className="text-center">{item.unit_price.toFixed(2)}</td>
                                    <td className="text-center">{item.qty_bought}</td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </Container>
            </Container>
        </>
    );
};

export default PlaceOrderForm;
