import { Container, Nav, Navbar, Row, Col } from "react-bootstrap";
import "../index.css";

export default function Layout() {
  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <Container>
        <Navbar.Brand href="home">Snack Healthy Vending</Navbar.Brand>
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
    <footer className="footer fixed-bottom bg-light text-muted text-center">
      <Container>
        <p>&copy; Snack Healthy Vending Machine - 2023.</p>
      </Container>
    </footer>
  );
}
