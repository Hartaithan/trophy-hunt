"use client";

import { type FC } from "react";
import {
  Combobox,
  InputBase,
  Input,
  useCombobox,
  Group,
  Text,
  Avatar,
  ScrollArea,
} from "@mantine/core";
import { locales } from "@/constants/locales";
import { type Locale } from "@/models/LocaleModel";

interface Props {
  value: string | null;
  required?: boolean;
  withinPortal?: boolean;
  onChange: (value: string | null) => void;
}

interface OptionProps {
  item: Locale;
}

const Option: FC<OptionProps> = (props) => {
  const { label, icon_url } = props.item;
  return (
    <Group>
      <Avatar size={24} src={icon_url} />
      <Text size="sm">{label}</Text>
    </Group>
  );
};

const LanguageSelect: FC<Props> = (props) => {
  const { value, required = false, withinPortal = false, onChange } = props;
  const combobox = useCombobox({
    onDropdownClose: () => {
      combobox.resetSelectedOption();
    },
  });
  const selectedOption = locales.find((item) => item.value === value);

  const options = locales.map((item) => (
    <Combobox.Option value={item.value} key={item.id}>
      <Option item={item} />
    </Combobox.Option>
  ));

  return (
    <Combobox
      store={combobox}
      withinPortal={withinPortal}
      onOptionSubmit={(val) => {
        onChange(val);
        combobox.closeDropdown();
      }}>
      <Combobox.Target>
        <InputBase
          label="Language"
          component="button"
          type="button"
          pointer
          rightSection={<Combobox.Chevron />}
          onClick={() => {
            combobox.toggleDropdown();
          }}
          rightSectionPointerEvents="none"
          multiline
          required={required}>
          {selectedOption != null ? (
            <Option item={selectedOption} />
          ) : (
            <Input.Placeholder>Pick value</Input.Placeholder>
          )}
        </InputBase>
      </Combobox.Target>
      <Combobox.Dropdown>
        <Combobox.Options>
          <ScrollArea.Autosize type="scroll" mah={220}>
            {options}
          </ScrollArea.Autosize>
        </Combobox.Options>
      </Combobox.Dropdown>
    </Combobox>
  );
};

export default LanguageSelect;
