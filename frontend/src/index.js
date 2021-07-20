import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import {
  ThemeProvider,
  theme,
  ColorModeProvider,
  CSSReset
} from '@chakra-ui/core';

ReactDOM.render(
<ThemeProvider theme={theme}>
      <ColorModeProvider>
        <CSSReset />
       <App />
      </ColorModeProvider>
    </ThemeProvider>,
  document.getElementById("root")
);

