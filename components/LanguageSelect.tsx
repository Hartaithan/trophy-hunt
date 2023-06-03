import { locales } from "@/constants/locales";
import { type ILocale } from "@/models/LocaleModel";
import {
  Avatar,
  Group,
  Input,
  Select,
  type SelectProps,
  Text,
  createStyles,
  type SelectItem,
} from "@mantine/core";
import { forwardRef, type FC } from "react";

interface ILanguageSelectProps extends Omit<SelectProps, "data"> {
  data?: ReadonlyArray<string | SelectItem>;
}

const useStyles = createStyles(({ spacing }) => ({
  language: {
    position: "relative",
  },
  languageIcon: {
    position: "absolute",
    top: "50%",
    left: spacing.xs,
    transform: "translateY(-50%)",
    zIndex: 10,
  },
}));

const SelectStyles: SelectProps["styles"] = () => ({
  input: {
    paddingLeft: 46,
  },
});

const CustomSelectItem = forwardRef<HTMLDivElement, ILocale>(
  ({ id: _, label, icon_url, ...rest }: ILocale, ref) => (
    <div ref={ref} {...rest}>
      <Group noWrap>
        <Avatar size={24} src={icon_url} />
        <Text size="sm">{label}</Text>
      </Group>
    </div>
  )
);

const LanguageSelect: FC<ILanguageSelectProps> = (props) => {
  const {
    value,
    data = locales,
    searchable = true,
    styles = SelectStyles,
    itemComponent = CustomSelectItem,
    ...rest
  } = props;
  const { classes } = useStyles();

  return (
    <Input.Wrapper label="Language" required>
      <div className={classes.language}>
        <Avatar
          className={classes.languageIcon}
          size={24}
          src={locales.find((i) => i.value === value)?.icon_url}
        />
        <Select
          data={data}
          value={value}
          searchable={searchable}
          styles={styles}
          itemComponent={itemComponent}
          {...rest}
        />
      </div>
    </Input.Wrapper>
  );
};

export default LanguageSelect;
