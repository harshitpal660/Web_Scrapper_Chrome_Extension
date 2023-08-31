// The below line imports the "path" module, which provides utilities for working with file and directory paths.
const path = require("path");

// The below line imports the "html-webpack-plugin" module, which simplifies the creation of HTML files to serve your webpack bundles.
const HTMLPlugin = require("html-webpack-plugin");

// The below line imports the "copy-webpack-plugin" module, which allows you to copy files and directories during the build process.
const CopyPlugin = require("copy-webpack-plugin");

// The below line imports the "webpack" module itself. It's not always necessary to import the "webpack" module directly in the configuration file.
const webpack = require("webpack");

// Load environment variables from .env file (if available)
const config = require("dotenv").config();

module.exports = {
  // Entry points for your application
  entry: {
    index: "./src/index.tsx",
    background: "./src/background.js",
    content: "./src/content.js",
  },

  // Set the mode to production
  mode: "production",
  module: {
    // Define rules for how different file types should be processed
    rules: [
      {
        // Process TypeScript files
        test: /\.tsx?$/,
        use: [
          {
            loader: "ts-loader",
            options: {
              compilerOptions: { noEmit: false },
            },
          },
        ],
        exclude: /node_modules/,
      },
      {
        // Process CSS files
        exclude: /node_modules/,
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
      {
        // Process JavaScript and JSX files
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env", "@babel/preset-react"],
          },
        },
      },
      {
        // Process image files
        test: /\.(png|jpg|jpeg|gif|svg)$/,
        use: [
          {
            loader: "file-loader",
            options: {
              name: "[name].[hash].[ext]", // Output path for images
              outputPath:'Images',
              publicPath:"./Images",
              emitFile: true,
              esModule:false
            },
          },
        ],
      },
    ],
  },
  plugins: [
    // CopyPlugin is used to copy the file to the output directory "dist".
    new CopyPlugin({
      patterns: [
        { from: "manifest.json", to: "../manifest.json" }, 
        {from: "src/assets/Images/logo.png",to:"Images/[name][ext]"}
      ],
    }),
    // EnvironmentPlugin is used to expose environment variables to your application. In this case, it's setting the value of REACT_APP_Web_scrapper.
    new webpack.EnvironmentPlugin({
      REACT_APP_Web_scrapper: process.env.REACT_APP_Web_scrapper2,
    }),
    ...getHtmlPlugins(["index"]),
  ],
  // The resolve section specifies the extensions that Webpack should try when resolving module names. For example, when you import a TypeScript file, Webpack will automatically try adding .tsx, .ts, and .js extensions.
  resolve: {
    extensions: [".tsx", ".ts", ".js", ".png"],
    // The fallback object specifies modules that should be used as fallbacks if certain Node.js built-in modules are not available in the browser environment. This is important because Chrome extensions run in a browser-like environment.
    fallback: {
      // vm: require.resolve("vm-browserify"),
      // fs: false, // Disable fs module usage
      // path: require.resolve("path-browserify"),
    },
  },
  output: {
    path: path.join(__dirname, "dist/js"),
    filename: "[name].js",
  },
};

// This function generates instances of HTMLPlugin based on the provided chunks array. These plugins generate HTML files for each entry point, with corresponding JavaScript files included.
function getHtmlPlugins(chunks) {
  return chunks.map(
    (chunk) =>
      new HTMLPlugin({
        title: "React extension",
        filename: `${chunk}.html`,
        chunks: [chunk],
      })
  );
}
