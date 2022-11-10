import { createTheme, ThemeProvider } from "@mui/material";

const theme = createTheme({
    palette: {
        mode: "dark",
        primary: {
            main: "#6038C0",
            contrastText: "#fff"            
        },
        secondary: {
            main: "#4AA6F7",
            contrastText: "#fff"
        },
        error: {
            main: "#E61B41",
            contrastText: "#fff"
        },
        warning: {
            main: "#F9DC48",
            contrastText: "#fff"
        },
        info: {
            main: "#9F9F9F",
            contrastText: "#fff"
        },
        success: {
            main: "#15CB76",
            contrastText: "#fff"
        }
    },
    components: {
        MuiTableCell: {
            styleOverrides: {
                head: {
                    background: "transparent",
                    color: "#FFF",
                    fontWeight: 600,
                    fontSize: 16
                }
            }
        },
        MuiDialogTitle: {
            styleOverrides: {
                root: {
                    padding: "16px 24px!important"
                }
            }
        },
        MuiDialog: {
            styleOverrides: {
                paper: {
                    borderRadius: 16,
                    background: "#191D28"
                }
            }
        }

    }
});

export default function Theme({ children }: { children: React.ReactNode }) {
    return (
        <ThemeProvider theme={theme}>
            {children}
        </ThemeProvider>
    );
}