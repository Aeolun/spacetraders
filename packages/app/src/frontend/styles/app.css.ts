import {globalStyle, style, styleVariants} from "@vanilla-extract/css";

globalStyle("html, body", {
  margin: 0,
  padding: 0,
  fontFamily: "sans-serif",
  height: '100vh',
  background: 'black',
  color: 'white',
})
export const app = style({
  display: 'flex',
  flexDirection: "column",
  height: '100vh'
})

export const error = style({
  color: 'red',
  fontSize: '1.5em',
  padding: '0.5em'
})

export const columns = style({
  display: 'flex',
  flexDirection: 'row',
  flex: 1,
  overflow: 'hidden'
})


const defaultRowStyle = style({
  '&:nth-child(odd) td': {
    backgroundColor: '#292929'
  }
});
export const rowStyle = styleVariants({
  default: [defaultRowStyle],
  nonexistent: [defaultRowStyle, style({
    color: '#aaaaaa'
  })]
})

export const defaultCellStyle = style({
  padding: '0.5em',
});

export const deadShip = style({
  color: 'red'
});


export const columnStyle = styleVariants({
  default: [defaultCellStyle, style({
    textAlign: 'left'
  })],
  right: [defaultCellStyle, style({
    textAlign: 'right'
  })],
})

export const tradeActivity = style({
  display: 'flex',
  flexDirection: 'row',
  gap: '0.5em',
});

export const tradeActivityVolume = style({
  textAlign: 'right',
  minWidth: '50px'
});
export const tradeActivitySection = style({
  display: 'flex',
  flexDirection: 'row',
  gap: '4px',
  border: '1px solid #494949',
  padding: '0.25em',
  '& > *': {
    width: '16px',
    height: '16px',
    textAlign: 'center'
  }
})

export const link = style({
  color: 'white',
  textDecoration: 'underline',
  cursor: 'pointer',
})

export const dataTable = style({
  width: '100%',
  borderCollapse: 'collapse',
})

export const tagList = style({
  display: 'flex',
  flexDirection: 'row',
  flexWrap: 'wrap',
  gap: '0.25em',
  padding: '0.25em'
})
export const tag = style({
  backgroundColor: 'black',
  color: 'white',
  border: '1px solid #888888',
  padding: '0.25em'
})

export const pill = style({
  display: 'inline-block',
  backgroundColor: 'white',
  color: 'black',
  border: '1px solid #888888',
  padding: '0.25em',
  borderRadius: '1em',
})

export const column = style({
  display: 'flex',
  flexDirection: 'column',
  flex: 1,
  maxWidth: '600px',
  borderLeft: '1px solid #292929',
  borderRight: '1px solid #292929',
  overflow: 'auto',
  color: 'white'
});

export const pageColumn = style({
  display: 'flex',
  flexDirection: 'column',
  flex: 1,
  overflow: 'auto',
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

export const agentInfo = style({
  display: 'flex',
  alignSelf: 'center',
  justifySelf: 'flex-end',
  fontSize: '1.5em',
  marginLeft: 'auto',
  padding: '0.5em',
  color: 'white'
});

const defaultMarketRow = style({
  display: 'grid',
  gridTemplateColumns: '24px 2fr 24px 24px 24px 1fr 1fr 1fr',
  flexDirection: 'row',
  borderBottom: '1px solid #292929',
  justifyContent: 'space-between',
  '*': {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'left',
    overflow: 'hidden'
  }
})
export const marketRow = styleVariants({
  default: [defaultMarketRow],
  header: [defaultMarketRow, {
    backgroundColor: 'white',
    color: 'black',
  }]
});

const defaultSystemMarketRow = style({
  display: 'grid',
  gridTemplateColumns: '24px 3fr 2fr 2fr 2fr 1fr 1fr',
  borderBottom: '1px solid #292929',
  '*': {
    overflow: 'hidden'
  }
})
export const systemMarketRow = styleVariants({
  default: [defaultSystemMarketRow],
  header: [defaultSystemMarketRow, {
    backgroundColor: 'white',
    color: 'black',
  }],
  win: [defaultSystemMarketRow, {
    backgroundColor: 'green',
  }]
});


export const marketRowNumber = style({
  display: 'flex',
  justifyContent: 'right'
})

const defaultShipyardRow = style({
  display: 'grid',
  gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr',
  flexDirection: 'row',
  borderBottom: '1px solid #292929',
  justifyContent: 'space-between',
})
export const shipyardRow = styleVariants({
  default: [defaultShipyardRow],
  header: [defaultShipyardRow, {
    backgroundColor: 'white',
    color: 'black',
  }]
});