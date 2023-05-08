import { useEffect, useState } from "react";
import { Alert, Button } from "react-bootstrap";
import { useForm } from "react-hook-form";

export default function AddProductForm({ theProduct }) {
  /**
   * set the available categories
   */
  const [category, setCategories] = useState([]);
  /**
   * Used to Display success and updated messages
   */
  const [successMessage, setSucessMessage] = useState("");
  const [updateSuccessMessage, setUpdateSucessMessage] = useState("");

  /**
   * Sets the product values that need to be updated
   */
  const [editProductId, setProductId] = useState(theProduct.productId);
  const [editProductName, setProductName] = useState(theProduct.productName);
  const [editPrice, setPrice] = useState(theProduct.price);
  const [editCategoryId, setCategoryId] = useState(
    theProduct.category && theProduct.category.categoryId
  );
  const [editCategoryName, setCategoryName] = useState(
    theProduct.category && theProduct.category.categoryName
  );

  /**
   * Fetches the categories availabe in the Database
   */
  function fetchcategories() {
    fetch("http://localhost:8080/categories")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Unexpected Server Response");
        }
        return response.json();
      })
      .then((data) => {
        setCategories(data);
      })
      .catch((error) => console.log("Error: ", error));
  }
  useEffect(() => fetchcategories(), []);

  /**
   * React Hook Form to validate and set default Values
   */
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      productId: editProductId ? editProductId : "",
      productName: editProductName ? editProductName : "",
      price: editPrice ? editPrice : "",
      categoryName: editCategoryName ? editCategoryName : "",
    },
    mode: "all",
  });

  /**
   *
   * @param {*} formData Passes the user specified form data
   * handleSave- Saves the data
   */
  const handleSave = async (formData) => {
    const newFormData = {
      productName: formData.productName,
      price: parseFloat(formData.price),
      categoryId: parseInt(formData.categoryId),
    };

    /**
     * If Product Id is available, performs edit operation .
     * Else Creates a New product
     */
    if (editProductId) {
      /**
       * Update the Product
       * */
      try {
        const response = await fetch(
          "http://localhost:8080/addproduct/" + editProductId,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(newFormData),
          }
        );

        if (response.ok) {
          setUpdateSucessMessage(
            <Alert variant="success">Product Updated Successfully</Alert>
          );
          console.log("Successfully added the product");
        } else {
          console.log("Error in adding the product");
        }
      } catch (error) {
        console.log("Error in Creating a new product");
      }
    } else {
      /**
       * Create new product
       */
      try {
        const response = await fetch("http://localhost:8080/addproduct/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newFormData),
        });

        if (response.ok) {
          setSucessMessage(
            <Alert variant="success">Product Added Successfully</Alert>
          );
          console.log("Successfully added");
        } else {
          console.log("Error in adding");
        }
      } catch (error) {
        console.log("Error in Creating a new product");
      }
    }
  };

  return (
    <div className="row">
      <div className="col-lg-8 mx-auto">
        {/* Displays success/update Messages */}
        {successMessage || updateSuccessMessage}

        {/* Form to display the products */}
        <form onSubmit={handleSubmit(handleSave)} noValidate>
          <div className="row">
            <label className="col-sm-8 col-form-label" htmlFor="ProductName">
              Product Name
            </label>
            <div className="col-sm-12">
              <input
                className="form-control"
                {...register("productName", {
                  required: "This field is required",
                  pattern: {
                    value: /^[A-Za-z0-9 ]+$/,
                    message: "Only accepts alphanumeric",
                  },
                })}
                type="text"
                placeholder="Enter Product Name"
              />
              <p>{errors.productName?.message}</p>
            </div>
          </div>
          <div className="row">
            <label className="col-sm-8 col-form-label" htmlFor="price">
              Product Price (USD)
            </label>
            <div className="col-sm-12">
              <input
                className="form-control"
                {...register("price", {
                  valueAsNumber: true,
                  required: "This field is required",
                  pattern: {
                    value: /^[A-Za-z0-9]+$/,
                    message: "Please enter price in digits",
                  },
                  min: {
                    value: 1,
                    message: "Minimum  acceptable price is 1",
                  },
                  max: {
                    value: 10,
                    message: "Maximum acceptable price is 10",
                  },
                })}
                type="number"
                placeholder="Enter Product Price"
              />
              <p>{errors.price?.message}</p>
            </div>
          </div>
          <div className="row">
            <label className="col-sm-8 col-form-label" htmlFor="Category">
              Choose Category
            </label>
            <div className="col-sm-12">
              <select
                className="form-select"
                {...register("categoryId", {
                  required: "Please select category ",
                })}
                placeholder=" "
              >
                <option>{editCategoryName ? editCategoryName : ""}</option>
                {category.map((category, index) => {
                  if (category.categoryName === editCategoryName) {
                    return null;
                  }
                  return (
                    <option key={index} value={category.categoryId}>
                      {category.categoryName}
                    </option>
                  );
                })}
              </select>
              <p>{errors.categoryId?.message}</p>
            </div>
          </div>
          <div className="d-grid gap-2">
            <Button size="lg" variant="outline-success" type="submit">
              Save Product
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
