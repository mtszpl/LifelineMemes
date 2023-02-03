import { createContext, useMemo, useState } from "react"
import { Theme, createTheme } from "@mui/material/styles"

export const tokens = (mode: string) => ({
    ...(mode === "dark") ? {
        primary: {
            100: "#e0e0e0",
            200: "#c2c2c2",
            300: "#a3a3a3",
            400: "#858585",
            500: "#666666",
            600: "#525252",
            700: "#3d3d3d",
            800: "#292929",
            900: "#141414"
        },
        red: {
            100: "#f2d8d9",
            200: "#e6b2b2",
            300: "#d98b8c",
            400: "#cd6565",
            500: "#c03e3f",
            600: "#9a3232",
            700: "#732526",
            800: "#4d1919",
            900: "#260c0d"
        },
        white: {
            100: "#ffffff",
            200: "#ffffff",
            300: "#ffffff",
            400: "#ffffff",
            500: "#ffffff",
            600: "#cccccc",
            700: "#999999",
            800: "#666666",
            900: "#333333"
        },
        indigo: {
            100: "#e1e2fe",
            200: "#c3c6fd",
            300: "#a4a9fc",
            400: "#868dfb",
            500: "#6870fa",
            600: "#535ac8",
            700: "#3e4396",
            800: "#2a2d64",
            900: "#151632"
        }
    } :
        {
            primary: {
                100: "#141414",
                200: "#292929",
                300: "#3d3d3d",
                400: "#525252",
                500: "#666666",
                600: "#858585",
                700: "#a3a3a3",
                800: "#c2c2c2",
                900: "#e0e0e0"
            },
            red: {
                100: "#260c0d",
                200: "#4d1919",
                300: "#732526",
                400: "#9a3232",
                500: "#c03e3f",
                600: "#cd6565",
                700: "#d98b8c",
                800: "#e6b2b2",
                900: "#f2d8d9"
            },
            white: {
                100: "#333333",
                200: "#666666",
                300: "#999999",
                400: "#cccccc",
                500: "#ffffff",
                600: "#ffffff",
                700: "#ffffff",
                800: "#ffffff",
                900: "#ffffff"
            },
            indigo: {
                100: "#151632",
                200: "#2a2d64",
                300: "#3e4396",
                400: "#535ac8",
                500: "#6870fa",
                600: "#868dfb",
                700: "#a4a9fc",
                800: "#c3c6fd",
                900: "#e1e2fe"
            }
        }
})

export const themeSettings = (mode: any) => {
    const colors = tokens(mode)

    return {
        palette: {
            mode: mode,
            ...(mode === "dark" ? {
                primary: {
                    main: colors.primary[500]
                },
                secondary: {
                    main: colors.white[500]
                },
                neutral: {
                    dark: colors.indigo[700],
                    main: colors.indigo[500],
                    light: colors.indigo[100]
                },
                background: {
                    default: colors.primary[500]
                }
            } : {
                primary: {
                    main: colors.primary[100]
                },
                secondary: {
                    main: colors.white[500]
                },
                neutral: {
                    dark: colors.indigo[700],
                    main: colors.indigo[500],
                    light: colors.indigo[100]
                },
                background: {
                    default: "#fcfcfc"
                }
            })
        },
        typography: {
            fontFamily: ["Oxygen", "sans-serif"].join(","),
            fontSize: 12,
            h1: {
                fontFamily: ["Oxygen", "sans-serif"].join(","),
                fontSize: 40,
                '@media (max-width:600px)': {
                    fontSize: 20
                }
            },
            h2: {
                fontFamily: ["Oxygen", "sans-serif"].join(","),
                fontSize: 32,
                '@media (max-width:600px)': {
                    fontSize: 16
                }
            },
            h3: {
                fontFamily: ["Oxygen", "sans-serif"].join(","),
                fontSize: 24,
                '@media (max-width:600px)': {
                    fontSize: 12
                }
            },
            h4: {
                fontFamily: ["Oxygen", "sans-serif"].join(","),
                fontSize: 20,
                '@media (max-width:600px)': {
                    fontSize: 10
                }
            },
            h5: {
                fontFamily: ["Oxygen", "sans-serif"].join(","),
                fontSize: 16,
                '@media (max-width:600px)': {
                    fontSize: 8
                }
            },
            h6: {
                fontFamily: ["Oxygen", "sans-serif"].join(","),
                fontSize: 14,
                '@media (max-width:600px)': {
                    fontSize: 7
                }
            }
        }
    }
}

export const ColorModeContext = createContext({
    toggleColorMode: () => {}
})

export const useMode = () => {
    const [mode, setMode] = useState("dark")

    const colorMode = useMemo(
        () => ({
        toggleColorMode: () => {
            setMode((prev) => (
                prev === "light" ? "dark" : "light"
            ))
        }}), []
    )

    const theme: Theme = useMemo(() => createTheme(themeSettings(mode)), [mode])

    return [theme, colorMode] as const
}