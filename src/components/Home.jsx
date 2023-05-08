import { Container, Row, Col, Image } from "react-bootstrap";
import vendingMachineImage from "../images/vendingmachine.png";

function Home() {
  return (
    <Container fluid>
      <Row
        className="d-flex align-items-center justify-content-center"
        style={{ height: "100vh" }}
      >
        <Col xs={12} md={6}>
          <Image src={vendingMachineImage} fluid style={{ height: "100vh" }} />
        </Col>
        <Col xs={12} md={6}>
          <h1>
            <b>
              <i>SNACK HEALTHY VENDING</i>
            </b>
          </h1>
          <h3>
            <em> Snack Happy, Snack Often</em>
          </h3>
        </Col>
      </Row>
    </Container>
  );
}

export default Home;
