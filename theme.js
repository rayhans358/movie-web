import { extendTheme } from "@chakra-ui/react";
import { mode } from "@chakra-ui/theme-tools";

const config = {
  initialColorMode: "dark",
  useSystemColorMode: false,
};

const styles = {
  global: (props) => ({
    body: {
      bg: mode(
        props.theme.semanticTokens.colors["chakra-body-bg"]._dark,
        "blackAlpha.800"
      )(props),
      // color: mode (
      //   props.theme.semanticTokens.colors["chakra-body-bg"]._light,
      //   "gray.800"
      // )(props),
    },
  }),
};

const theme = extendTheme({ config, styles });

export default theme;
