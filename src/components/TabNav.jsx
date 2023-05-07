import { Tab, Tabs } from "react-bootstrap";
import Products from "../pages/Products";
import Inventory from "./Inventory";

function TabNav() {
  return (
    <>
      <Tabs
        defaultActiveKey="products"
        id="uncontrolled-tab-example"
        className="mb-3"
      >
        <Tab eventKey="products" title="Products List">
          <Products />
        </Tab>
        <Tab eventKey="inventory" title="Inventory">
          <Inventory />
        </Tab>
      </Tabs>
    </>
  );
}

export default TabNav;
