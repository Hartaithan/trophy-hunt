import { Box, Button, PasswordInput, Stack } from "@mantine/core";
import { type FC } from "react";

const SetPasswordForm: FC = () => {
  return (
    <Box component="form" w="100%" maw={400}>
      <Stack>
        <PasswordInput label="New password" placeholder="New password" />
        <PasswordInput
          label="Confirm Password"
          placeholder="Confirm Password"
        />
      </Stack>
      <Button type="submit" mt="xl" fullWidth>
        Confirm!
      </Button>
    </Box>
  );
};

export default SetPasswordForm;
