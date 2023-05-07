import { useEffect, useState } from "react";
import { Button, Modal, Alert } from "react-bootstrap";
import AddProductForm from "./AddProductForm";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";

export default function Products() {
  /**
   * @param content- Display Initial page with list of products
   */
  const [content, setContent] = useState(<ListProducts />);

  return <>{content}</>;
}
/** Function to list all the products */
function ListProducts() {
  const [products, setProducts] = useState([]);
  const [show, setShow] = useState(false);
  const [showAddTitle, setShowAddTitle] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState({});

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
    fetchProducts();
    setErrorMessage("");
  };

  /**
   * Show the Modal and Load the products
   * setShowAddTitle(true) Show the "Add new Product" title in Modal
   */
  const handleShow = () => {
    setShow(true);
    setShowAddTitle(true);
    setSelectedProduct({});
    setErrorMessage("");
  };

  /**
   * Show the Modal to edit the products
   * setShowAddTitle(false) Show the "Edit Product" title in Modal
   * setSelectedProduct(product) Send the selected product to the AddProduct Form Component
   */
  const handleEdit = (product) => {
    setShow(true);
    setSelectedProduct(product);
    setShowAddTitle(false);
    setErrorMessage("");
  };

  /**
   * Fetches the available products
   */
  function fetchProducts() {
    fetch("http://localhost:8080/products")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Unexpected Server Response");
        }
        return response.json();
      })
      .then((data) => {
        setProducts(data);
      })
      .catch((error) => console.log("Error: ", error));
  }

  /**
   * Delete the product
   */
  function handleDelete(productId) {
    console.log("Product deleting...");
    fetch("http://localhost:8080/deleteproduct/" + productId, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Methods": "DELETE",
      },
    })
      .then((response) => {
        if (response.ok) {
          /**Display delete message and available products*/
          fetchProducts();
          setDeleteSucessMessage(
            <Alert variant="success">Product Deleted Successfully</Alert>
          );
        } else {
          /** Else Display Error Message */
          response.json().then((error) => {
            setErrorMessage(<Alert variant="danger">{error.message}</Alert>);
            console.log("Error in deleting the product ", error);
            fetchProducts();
          });
        }
      })
      .catch((error) => {
        console.log("Error in deleting the product ", error);
        setErrorMessage("An error occurred while deleting the product.");
      });
  }

  useEffect(() => fetchProducts(), []);

  return (
    <>
      <div className="container">
        <h2 className="text-center mb-3">Products</h2>

        {deleteSuccessMessage || errorMessage}
        <table className="table">
          <thead>
            <tr>
              <th hidden>ID</th>
              <th>Name</th>
              <th>Category</th>
              <th>Price</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {/**
             * Iterates all the products and display each product in a row
             *
             */}
            {products.map((product) => (
              <tr key={product.productId}>
                <td hidden>{product.productId}</td>
                <td>{product.productName}</td>
                <td>{product.category.categoryName}</td>
                <td>{product.price}</td>
                <td style={{ width: "10px", whiteSpace: "nowrap" }}>
                  <FontAwesomeIcon
                    icon={faEdit}
                    className="text-primary mx-2"
                    onClick={() => handleEdit(product)}
                  />
                  <FontAwesomeIcon
                    icon={faTrash}
                    className="text-danger"
                    onClick={() => handleDelete(product.productId)}
                  />
                </td>
              </tr>
            ))}
            {/**
             * Modal is used to display the pop-up window
             * */}
            <Modal
              show={show}
              onHide={handleClose}
              backdrop="static"
              keyboard={false}
            >
              <Modal.Header closeButton>
                <Modal.Title>
                  {showAddTitle ? "Add New Product" : "Edit Product"}
                </Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <AddProductForm theProduct={selectedProduct} />
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                  Close
                </Button>
              </Modal.Footer>
            </Modal>
          </tbody>
        </table>
        <div className="d-flex justify-content-center">
          <Button variant="success" onClick={handleShow}>
            Add New Product
          </Button>
        </div>
      </div>
    </>
  );
}
