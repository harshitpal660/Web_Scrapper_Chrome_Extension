const path = require("path");
const HTMLPlugin = require("html-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const webpack = require("webpack");
const config = require("dotenv").config();

module.exports = {
  entry: {
    index: "./src/index.tsx",
    background: "./src/background.js",
    content: "./src/content.js",
  },
  mode: "production",
  module: {
    rules: [
      {
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
        exclude: /node_modules/,
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
      {
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
      patterns: [{ from: "manifest.json", to: "../manifest.json" }],
    }),
    new CopyPlugin({
      patterns: [
        {
          from: "src/Images/logo.png",
          to({ context, absoluteFilename }) {
            return "Images/[name][ext]";
          },
        },
      ],
    }),
    // EnvironmentPlugin is used to expose environment variables to your application. In this case, it's setting the value of REACT_APP_Web_scrapper.
    new webpack.EnvironmentPlugin({
      REACT_APP_Web_scrapper: process.env.REACT_APP_Web_scrapper,
    }),
    ...getHtmlPlugins(["index"]),
  ],
  // The resolve section specifies the extensions that Webpack should try when resolving module names. For example, when you import a TypeScript file, Webpack will automatically try adding .tsx, .ts, and .js extensions.
  resolve: {
    extensions: [".tsx", ".ts", ".js", ".png"],
    // The fallback object specifies modules that should be used as fallbacks if certain Node.js built-in modules are not available in the browser environment. This is important because Chrome extensions run in a browser-like environment.
    fallback: {
      vm: require.resolve("vm-browserify"),
      fs: false, // Disable fs module usage
      path: require.resolve("path-browserify"),
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
