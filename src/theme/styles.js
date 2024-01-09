export const getMainPageStyle = (portrait) => {
  return ({
  minHeight: "93.5vh",
  backgroundImage: `url("/static/rolltopia background image.png")`,
  backgroundSize: portrait ? "auto 100%" : "100% auto",
  backgroundRepeat: "repeat",
  backgroundColor: "transparent",
  overflow: "auto",
  backgroundAttachment: "fixed"  // Added this line
  })
};

export const buttonHoverStyle = {
  "&:hover::before": {
    content: '""',
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    zIndex: 1,
  },
};

export const homeMainCardStyle = {
  backgroundColor: "rgba(20, 20, 20, .95)",
  width: {
    xs: "90%",
    sm: "80%",
    md: "70%",
    lg: "55%",
    xl: "40%",
  },
  margin: "5vh auto 2vh auto",
  padding: { xs: "1rem", sm: "2rem" },
  boxSizing: "border-box",
  borderRadius: "35px",
  position: "relative",
  "&::-webkit-scrollbar": {
    width: "0px",
  },
  "&:hover::-webkit-scrollbar-thumb": {
    backgroundColor: "rgba(46, 44, 44, 0.5)",
  },
};

export const mainButtonStyle = {
  backgroundColor: "#FF4d0d",
  color: "white",
  fontFamily: "Chango",
  padding: "20px 40px",
  borderRadius: "5",
  border: "none",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "24px",
  marginBottom: "20px",
  width: "90%",
};

export const globalScrollbarStyles = `
  ::-webkit-scrollbar {
    width: 8px;
  }

  ::-webkit-scrollbar-track {
    background: transparent;
  }

  ::-webkit-scrollbar-thumb {
    background-color: rgba(0, 0, 0, 0.2);
    border-radius: 4px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background-color: rgba(0, 0, 0, 0.5);
  }

  ::-webkit-scrollbar-thumb:active {
    background-color: rgba(0, 0, 0, 0.9);
  }
`;

export const signupButtonStyle = {
  color: "white",
  fontFamily: "Chango",
  backgroundColor: "#FF4d0d",
  "&:hover": {
    backgroundColor: "#FF4d0d",
    boxShadow: `3px 3px 8px rgba(0, 0, 0, 0.5)`,
  },
  width: {
    xs: "100%",
    sm: "75%",
    md: "75%",
    lg: "60%",
    xl: "60%",
  },
  cursor: "pointer",
  boxShadow: `3px 3px 8px rgba(0, 0, 0, 0.5)`,
  position: "relative",
  "&:hover::before": {
    content: '""',
    position: "absolute",
    borderRadius: "5px",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    zIndex: 1,
  },
  fontSize: {
    xs: "16px",
    sm: "16px",
    md: "24px",
    lg: "24px",
    xl: "24px",
  },
};

export const signupTextfieldStyle = {
  marginBottom: "2em",
  width: {
    xs: "100%",
    sm: "75%",
    md: "75%",
    lg: "60%",
    xl: "60%",
  },
  backgroundColor: "white",
  color: "black",
  borderRadius: "5px",
  "& .MuiInputBase-input": {
    height: "60px",
    padding: "0 8px",
    boxSizing: "border-box",
    fontSize: {
      xs: "16px",
      sm: "16px",
      md: "24px",
      lg: "24px",
      xl: "24px",
    },
    fontFamily: "Chango",
  },
};

export const signupCardStyle = {
  backgroundColor: "rgba(0, 0, 0, 0.9)",
  width: {
    xs: "90%",
    sm: "75%",
    md: "65%",
    lg: "55%",
    xl: "40%",
  },
  margin: "2vh auto 2vh auto",
  overflowY: "auto",
  padding: {
    xs: ".5em 0em",
    sm: ".5em",
    md: "1em",
    lg: "1em",
    xl: "2em",
  },
  boxSizing: "border-box",
  borderRadius: "15px",
  "&::-webkit-scrollbar": {
    width: "0px",
  },
  "&:hover::-webkit-scrollbar-thumb": {
    backgroundColor: "rgba(46, 44, 44, 0.5)",
  },
};

export const whiteChangoOutlineStyle = {
  textAlign: "center",
  margin: "auto",
  WebkitTextStroke: "1px white",
  letterSpacing: "-2px",
  textShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)", // Example drop shadow
};

export const whiteChangoOutlineStyleNavbar = {
  textAlign: "center",
  margin: "auto",
  WebkitTextStroke: ".5px white",
  letterSpacing: "-1px",
  textShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)", // Example drop shadow
};

export const whiteChangoOutlineStyleLegacy = {
  textAlign: "center",
  margin: "auto",
  textShadow: `
2px 2px 0 white, 
-2px -2px 0 white, 
2px -2px 0 white, 
-2px 2px 0 white,
3px 3px 8px rgba(0, 0, 0, 0.5)
`,
};

export const rolliePageCardStyle = {
  width: {
    xs: "90%",
    sm: "80%",
    md: "70%",
    lg: "70%",
    xl: "60%",
  },
  margin: "3vh auto 2vh auto",
  overflowY: "auto",
  padding: "1rem",
  boxSizing: "border-box",
  borderRadius: "25px",
  "&::-webkit-scrollbar": {
    width: "0px",
  },
  "&:hover::-webkit-scrollbar-thumb": {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
};

export const rollieDetailPageCardStyle = {
  width: {
    xs: "90%",
    sm: "50%",
    md: "45%",
    lg: "40%",
    xl: "40%",
  },
  height: "87vh",
  margin: "2vh auto 0 auto",
  overflowY: "auto",
  padding: {xs:".5rem", md:"1rem"},
  boxSizing: "border-box",
  borderRadius: "25px",
  "&::-webkit-scrollbar": {
    width: "0px",
  },
  "&:hover::-webkit-scrollbar-thumb": {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
};

export const rolliePageButtonStyle = {
  color: "white",
  fontFamily: "Chango",
  backgroundColor: "#FF4d0d",
  "&:hover": {
    backgroundColor: "#FF4d0d",
    boxShadow: `3px 3px 8px rgba(0, 0, 0, 0.5)`,
  },
  border: "2px solid white",
  width: {
    xs: "90%",
    sm: "75%",
    md: "75%",
    lg: "60%",
    xl: "50%",
  },
  cursor: "pointer",
  boxShadow: `3px 3px 8px rgba(0, 0, 0, 0.5)`,
  position: "relative",
  "&:hover::before": {
    content: '""',
    position: "absolute",
    borderRadius: "5px",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    zIndex: 1,
  },
  fontSize: {
    xs: "16px",
    sm: "16px",
    md: "16px",
    lg: "20px",
    xl: "24px",
  },
};

