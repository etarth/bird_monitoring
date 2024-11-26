const {nextui} = require('@nextui-org/theme');
module.exports = {
  content: [
    "./src/**/*.{html,js,jsx,ts,tsx}",
    "// adjust for your file types",
    "./node_modules/@nextui-org/theme/dist/components/tabs.js"
  ],
  theme: {
    extend: {},
  },
  plugins: [nextui()],
}
