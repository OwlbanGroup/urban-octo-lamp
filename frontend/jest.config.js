module.exports = {
  transform: {
    "^.+\\.[tj]sx?$": "babel-jest"
  },
  transformIgnorePatterns: [
    "/node_modules/(?!(axios)/)"
  ],
  moduleFileExtensions: ["js", "jsx", "json", "node"]
};
