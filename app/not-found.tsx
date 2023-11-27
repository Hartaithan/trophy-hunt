import NotFound from "@/components/NotFound/NotFound";
import { type Page } from "@/models/AppModel";
import { Container } from "@mantine/core";

const NotFoundPage: Page = () => (
  <Container id="main">
    <NotFound />
  </Container>
);

export default NotFoundPage;
