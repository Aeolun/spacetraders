import {globalStyle, style} from "@vanilla-extract/css";

globalStyle("html, body", {
  margin: 0,
  padding: 0,
  fontFamily: "sans-serif",
  height: '100vh'
})
export const app = style({
  display: 'flex',
  flexDirection: "column",
  height: '100vh'
})

export const columns = style({
  display: 'flex',
  flexDirection: 'row',
  flex: 1,
})

export const column = style({
  display: 'flex',
  flexDirection: 'column',
  flex: 1,
  maxWidth: '200px'
});

export const mainColumn = style({
  display: 'flex',
  flexDirection: 'column',
  flex: 1
});

export const menu = style({
  display: 'flex',
});

export const menuItem = style({
  border: '1px solid gray',
  backgroundColor: 'darkgray',
  color: 'white',
  fontSize: '1.5em',
  padding: '0.5em',
  cursor: 'pointer',
  ":hover": {
    backgroundColor: 'gray',
  }
})