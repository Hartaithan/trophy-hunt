"use client";

import { Box, Button, TextInput } from "@mantine/core";
import { type FC } from "react";

const ForgotForm: FC = () => {
  return (
    <Box component="form" w="100%" maw={400}>
      <TextInput
        required
        type="email"
        label="Email"
        placeholder="Enter your email"
      />
      <Button type="submit" mt="xl" fullWidth>
        Submit
      </Button>
    </Box>
  );
};

export default ForgotForm;
