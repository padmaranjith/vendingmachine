import { useEffect, useState } from "react";
import { Alert, Button } from "react-bootstrap";
import { useForm } from "react-hook-form";

export default function AddInventoryForm({ theInventory }) {
  /**
   * set the available products
   */
  const [products, setProducts] = useState([]);
  /**
   * Used to Display success and updated messages
   */
  const [AddSuccessMessage, setAddSucessMessage] = useState("");
  const [updateSuccessMessage, setUpdateSucessMessage] = useState("");
  const [capacityValidateMessage, setcapacityValidateMessage] = useState("");

  /**
   * Sets the product values that need to be updated
   */
  const [editInventoryId, setinventoryId] = useState(theInventory.inventoryId);
  const [editProductId, setProductId] = useState(
    theInventory.product && theInventory.product.productId
  );
  const [editProductName, setProductName] = useState(
    theInventory.product && theInventory.product.productName
  );
  const [editMaxCapactiy, setMaxCapacity] = useState(theInventory.maxCapacity);
  const [editavailableCapactiy, setavailableCapactiy] = useState(
    theInventory.availableCapacity
  );
  const [lastRefilldate, setLastRefilldate] = useState(new Date());

  /**
   * Show the list of products
   */
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
  useEffect(() => fetchProducts(), []);

  /**
   * React Hook Form to validate and set default Values
   */
  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm({
    defaultValues: {
      inventoryId: editInventoryId ? editInventoryId : "",
      productName: editProductName ? editProductName : "",
      maxCapacity: editMaxCapactiy ? editMaxCapactiy : "",
      availableCapacity: editavailableCapactiy ? editavailableCapactiy : "",
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
      productId: parseInt(editProductId),
      maxCapacity: parseInt(formData.maxCapacity),
      availableCapacity: parseInt(formData.availableCapacity),
      lastRefilldate: new Date(),
    };

    /**
     * If Product Id is available, performs edit operation .
     * Else Creates a New product
     */
    if (editInventoryId) {
      /**
       * Update the Inventory
       * */
      try {
        console.log(newFormData);
        const response = await fetch(
          "http://localhost:8080/addInventory/" + editInventoryId,
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
            <Alert variant="success">Inventory Updated Successfully</Alert>
          );
          console.log("Successfully updated the Inventory");
        } else {
          console.log("Error updating the Inventory");
        }
      } catch (error) {
        console.log("Error in updating Inventory");
      }
    } else {
      /**
       * Create new Inventory
       */
      try {
        const response = await fetch("http://localhost:8080/addInventory/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newFormData),
        });

        if (response.ok) {
          setAddSucessMessage(
            <Alert variant="success">Inventory Added Successfully</Alert>
          );
          console.log("Successfully added");
        } else {
          console.log("Error in adding");
        }
      } catch (error) {
        console.log("Error in Creating a new Inventory");
      }
    }
  };

  return (
    <div className="row">
      <div className="col-lg-8 mx-auto">
        {/* Displays success/update Messages */}
        {AddSuccessMessage || updateSuccessMessage || capacityValidateMessage}

        {/* Form to display the Inventory */}
        <form onSubmit={handleSubmit(handleSave)} noValidate>
          <div className="row">
            <label className="col-sm-8 col-form-label" htmlFor="Product">
              Choose Product
            </label>
            <div className="col-sm-12">
              <select
                className="form-select"
                {...register("productId", {
                  required: "Please select product ",
                })}
                placeholder=" "
              >
                <option>{editProductName ? editProductName : ""}</option>
                {products.map((product, index) => {
                  if (product.productName === editProductName) {
                    return null;
                  }
                  return (
                    <option key={index} value={product.productId}>
                      {product.productName}
                    </option>
                  );
                })}
              </select>
              <p>{errors.productId?.message}</p>
            </div>
          </div>

          <div className="row">
            <label className="col-sm-8 col-form-label" htmlFor="maxCapacity">
              Max Capacity
            </label>
            <div className="col-sm-12">
              <input
                className="form-control"
                {...register("maxCapacity", {
                  valueAsNumber: true,
                  required: "This field is required",
                  min: {
                    value: 1,
                    message: "Minimum  Inventory size is 1",
                  },
                  max: {
                    value: 50,
                    message: "Maximum Inventory size is 50",
                  },
                })}
                type="number"
                placeholder="Enter Max Capacity"
              />
              <p>{errors.maxCapacity?.message}</p>
            </div>
          </div>
          <div className="row">
            <label
              className="col-sm-8 col-form-label"
              htmlFor="availableCapacity"
            >
              Available Capacity
            </label>
            <div className="col-sm-12">
              <input
                className="form-control"
                {...register("availableCapacity", {
                  valueAsNumber: true,
                  required: "This field is required",
                  min: {
                    value: 1,
                    message: "Minimum  Available size is 1",
                  },
                  max: {
                    value: 50,
                    message: "Maximum Available size is 50",
                  },
                  validate: {
                    lessThanMaxCapacity: (value) =>
                      value < getValues("maxCapacity")
                        ? true
                        : "Available capacity should be less than Max capacity",
                  },
                })}
                type="number"
                placeholder="Enter Available Capacity"
              />
              <p>{errors.availableCapacity?.message}</p>
            </div>
          </div>

          <div className="d-grid gap-2">
            <Button size="lg" variant="outline-success" type="submit">
              Save Inventory
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
