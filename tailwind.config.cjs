/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        indigo: {
          50: "#eef2ff",
          100: "#e0e7ff",
          200: "#c7d2fe",
          300: "#a5b4fc",
          400: "#818cf8",
          500: "#6366f1",
          600: "#4f46e5",
          700: "#4338ca",
          800: "#3730a3",
          900: "#312e81",
          950: "#1e1b4b",
        },
        violet: {
          500: "#8b5cf6",
          600: "#7c3aed",
        },
        rose: {
          500: "#f43f5e",
          600: "#e11d48",
        },
        amber: {
          500: "#f59e0b",
        },
        emerald: {
          500: "#10b981",
        }
      },
      fontFamily: {
        display: ["var(--font-display)", "sans-serif"],
        body: ["var(--font-body)", "sans-serif"]
      },
      boxShadow: {
        premium: "0 20px 40px -15px rgba(79, 70, 229, 0.1)",
        soft: "0 10px 30px rgba(31, 27, 75, 0.05)"
      },
      borderRadius: {
        '3xl': '1.5rem',
        '4xl': '2rem',
        '5xl': '2.5rem',
      }
    }
  },
  plugins: []
};
