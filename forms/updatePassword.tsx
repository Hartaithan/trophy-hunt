"use client";

import { Box, Button, Flex, Grid, PasswordInput } from "@mantine/core";
import { type FC } from "react";

const UpdatePasswordForm: FC = () => {
  return (
    <Box>
      <Grid>
        <Grid.Col span={6}>
          <PasswordInput
            id="current_password"
            label="Password"
            placeholder="Password"
          />
        </Grid.Col>
        <Grid.Col span={6}>
          <PasswordInput
            id="new_password"
            label="Confirm password"
            placeholder="Confirm password"
          />
        </Grid.Col>
      </Grid>
      <Flex justify="flex-end">
        <Button type="submit" w={150} mt="xl">
          Update!
        </Button>
      </Flex>
    </Box>
  );
};

export default UpdatePasswordForm;
