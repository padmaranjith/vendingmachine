import { useEffect, useState } from "react";

export default function Products() {
  /**
   * @param content- displays the initial page with list of products
   */
  const [content, setContent] = useState(
    <ListProducts showAddProduct={showAddProduct} />
  );

  /**
   * @method showProductlist- called when admin clicks cancel from AddProduct Form
   * @method showAddProduct- Used to show AddProduct Form when user clicks create
   */

  function showProductlist() {
    setContent(<ListProducts showAddProduct={showAddProduct} />);
  }

  function showAddProduct() {
    setContent(<AddProduct showProductlist={showProductlist} />);
  }

  return (
    <>
      <h1>Tab content for Products Components</h1>
      {content}
    </>
  );
}
/** Function to list all the products */
function ListProducts(props) {
  const [products, setProducts] = useState([]);

  function fetchProducts() {
    fetch("http://localhost:8080/products")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Unexpected Server Response");
        }
        return response.json();
      })
      .then((data) => {
        console.log(data);
        setProducts(data);
      })
      .catch((error) => console.log("Error: ", error));
  }

  useEffect(() => fetchProducts(), []);

  return (
    <>
      <h2 className="text-center mb-3">Products</h2>
      <button
        className="btn btn-primary me-2"
        onClick={() => props.showAddProduct()}
        type="button"
      >
        Create
      </button>
      <table className="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Category</th>
            <th>Price</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product, index) => {
            return (
              <tr key={index}>
                <td>{product.productId}</td>
                <td>{product.productName}</td>
                <td>{product.category.categoryName}</td>
                <td>{product.price}</td>

                <td style={{ width: "10px", whiteSpace: "nowrap" }}>
                  <button className="btn btn-primary btn-sm me-2" type="button">
                    Edit
                  </button>
                  <button className="btn btn-danger btn-sm" type="button">
                    Delete
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </>
  );
}

/** Function to add new product */
function AddProduct(props) {
  return (
    <>
      <h2 className="text-center">Create New Product</h2>
      <button
        className="btn btn-secondary me-2"
        onClick={() => props.showProductlist()}
        type="button"
      >
        Cancel
      </button>
    </>
  );
}
