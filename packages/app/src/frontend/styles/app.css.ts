import {globalStyle, style} from "@vanilla-extract/css";

globalStyle("html, body", {
  margin: 0,
  padding: 0,
  fontFamily: "sans-serif",
  height: '100vh',
  background: 'black',
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
  maxWidth: '600px',
  borderLeft: '1px solid #292929',
  borderRight: '1px solid #292929',
  color: 'white'
});

export const mainColumn = style({
  display: 'flex',
  flexDirection: 'column',
  position: 'relative',
  flex: 1
});

export const menu = style({
  display: 'flex',
  borderBottom: '1px solid #292929',
});

export const menuItem = style({
  backgroundColor: 'black',
  color: 'white',
  borderRight: '1px solid #292929',
  fontSize: '1.5em',
  padding: '0.5em',
  cursor: 'pointer',
  ":hover": {
    backgroundColor: 'gray',
  }
})

export const marketRow = style({
  display: 'grid',
  gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr 1fr',
  flexDirection: 'row',
  borderBottom: '1px solid #292929',
  justifyContent: 'space-between',
});