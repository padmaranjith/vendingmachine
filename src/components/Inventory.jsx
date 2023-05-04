import { Tab, Tabs } from "react-bootstrap";
import Products from "../pages/Products";

function Inventory() {
  return (
    <>
      <h1>Inventory page</h1>
      <Tabs
        defaultActiveKey="products"
        id="uncontrolled-tab-example"
        className="mb-3"
      >
        <Tab eventKey="products" title="Products List">
          <Products />
        </Tab>
        <Tab eventKey="inventory" title="Inventory">
          Tab content for Inventory
        </Tab>
      </Tabs>
    </>
  );
}

export default Inventory;
