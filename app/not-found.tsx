import { type NextPage } from "next";
import NotFound from "@/components/NotFound/NotFound";
import { Container } from "@mantine/core";

const NotFoundPage: NextPage = () => (
  <Container id="main">
    <NotFound />
  </Container>
);

export default NotFoundPage;
