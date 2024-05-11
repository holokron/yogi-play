import { Link } from "react-router-dom";
import DefaultTemplate from "../../templates/DefaultTemplate";
import Container from "../../components/Container";
import Row from "../../components/Row";
import { Col } from "reactstrap";

export default function Request(): React.ReactElement<{}> {
  return (
    <DefaultTemplate>
      <Container>
        <Row>
          <Col className="text-center">
            <h1 className="display-4">Wkrótce</h1>
            <p className="lead">
              Tutaj będzie można wysłać prośbę o dodanie swojego dźwieku.
            </p>
            <br />
            <Link className="btn btn-primary" to="/">
              Home
            </Link>
          </Col>
        </Row>
      </Container>
    </DefaultTemplate>
  );
}
