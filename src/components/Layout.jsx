import { Container, Nav, Navbar } from "react-bootstrap";

export default function Layout() {
  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <Container>
        <Navbar.Brand href="home">Vending Machine</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href="/home">Home</Nav.Link>
            <Nav.Link href="/manageInventory">Manage Inventory</Nav.Link>
            <Nav.Link href="/purchase">User Purchase</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export function Footer() {
  return (
    <footer>
      <div className="container p-3 mt-5 border-top">
        <small className="d-block text-muted text-center">
          &copy; Vending Machine - 2023
        </small>
      </div>
    </footer>
  );
}
