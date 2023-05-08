import { useEffect, useState } from "react";
import { Button, Modal, Alert } from "react-bootstrap";
import { format } from "date-fns";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import AddInventoryForm from "./AddInventoryForm";

export default function Inventory() {
  /**
   * @param content- Display Initial page with list of products in the inventory
   */
  const [content, setContent] = useState(<GetInventorylists />);

  return <>{content}</>;
}

/** Function to list the inventory*/
function GetInventorylists() {
  const [inventories, setInventories] = useState([]);
  const [show, setShow] = useState(false);
  const [showAddInventoryTitle, setShowAddInventoryTitle] = useState(false);
  const [selectedInventory, setSelectedInventory] = useState({});

  /**Display Server error message */
  const [errorMessage, setErrorMessage] = useState("");

  /**
   * Used to Display Delete success message
   */
  const [deleteSuccessMessage, setDeleteSucessMessage] = useState("");

  /**
   * Hide the Modal and Reload the products
   */
  const handleClose = () => {
    setShow(false);
    showInventory();
    setErrorMessage("");
  };

  /**
   * Show the Modal and Load the products
   * setShowAddTitle(true) Show the "Add new Product" title in Modal
   */
  const handleShow = () => {
    setShow(true);
    setShowAddInventoryTitle(true);
    setSelectedInventory({});
    setErrorMessage("");
  };

  /**
   * Show the Modal to edit the inventory llist
   * setShowAddInventoryTitle(false) Show the "Edit Inventory" title in Modal
   * setSelectedProduct(product) Send the selected inventory to the AddInventory Form Component
   */
  const handleEdit = (inventory) => {
    setShow(true);
    setSelectedInventory(inventory);
    setShowAddInventoryTitle(false);
    setErrorMessage("");
  };

  /**
   * Show the Inventory
   */
  function showInventory() {
    fetch("http://localhost:8080/inventories")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Unexpected Server Response");
        }
        return response.json();
      })
      .then((data) => {
        setInventories(data);
      })
      .catch((error) => console.log("Error: ", error));
  }

  useEffect(() => showInventory(), []);

  /**
   * Delete the Inventory
   */
  function handleDelete(inventoryId) {
    console.log("Deleting Inventory...");
    fetch("http://localhost:8080/deleteInventory/" + inventoryId, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Methods": "DELETE",
      },
    })
      .then((response) => {
        if (response.ok) {
          /**Display delete message and available Items in Inventory*/
          showInventory();
          setDeleteSucessMessage(
            <Alert variant="success">Inventory Deleted Successfully</Alert>
          );
        } else {
          /** Else Display Error Message */
          response.json().then((error) => {
            setDeleteSucessMessage("");
            setErrorMessage(<Alert variant="danger">{error.message}</Alert>);
            console.log("Error in deleting the Inventory ", error);
            showInventory();
          });
        }
      })
      .catch((error) => {
        console.log("Error in deleting the product ", error);
        setErrorMessage("An error occurred while deleting the product.");
      });
  }

  return (
    <>
      <div className="container">
        <h2 className="text-center mb-3">Inventory Management</h2>
        {deleteSuccessMessage || errorMessage}
        <table className="table">
          <thead>
            <tr>
              <th hidden>ID</th>
              <th>Product Name</th>
              <th>Max Capacity</th>
              <th>Available Capacity</th>
              <th>Last Refill Date</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {/**
             * Displays all the items in the inventory             */}
            {inventories.map((inventory) => (
              <tr key={inventory.inventoryId}>
                <td hidden>{inventory.product.productId}</td>
                <td>{inventory.product.productName}</td>
                <td>{inventory.maxCapacity}</td>
                <td>{inventory.availableCapacity}</td>
                <td>
                  {format(new Date(inventory.lastRefillDate), "MM/dd/yyyy")}
                </td>
                <td style={{ width: "10px", whiteSpace: "nowrap" }}>
                  <FontAwesomeIcon
                    icon={faEdit}
                    className="text-primary mx-2"
                    onClick={() => handleEdit(inventory)}
                  />
                  <FontAwesomeIcon
                    icon={faTrash}
                    className="text-danger"
                    onClick={() => handleDelete(inventory.inventoryId)}
                  />
                </td>
              </tr>
            ))}
            {
              /**
               * Modal is used to display the pop-up window
               * */
              <Modal
                show={show}
                onHide={handleClose}
                backdrop="static"
                keyboard={false}
              >
                <Modal.Header closeButton>
                  <Modal.Title>
                    {showAddInventoryTitle
                      ? "Add New Inventory"
                      : "Edit Inventory"}
                  </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <AddInventoryForm theInventory={selectedInventory} />
                </Modal.Body>
                <Modal.Footer>
                  <Button variant="secondary" onClick={handleClose}>
                    Close
                  </Button>
                </Modal.Footer>
              </Modal>
            }
          </tbody>
        </table>
        <div className="d-flex justify-content-center">
          <Button variant="success" onClick={handleShow}>
            Add New Inventory
          </Button>
        </div>
      </div>
    </>
  );
}
