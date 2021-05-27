/* eslint-disable @typescript-eslint/no-var-requires */
const path = require("path")
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin")
const nodeExternals = require("webpack-node-externals")
const { CleanWebpackPlugin } = require("clean-webpack-plugin")

module.exports = {
   context: __dirname,
   entry: "./src/index.ts",
   module: {
      rules: [
         {
            test: /\.ts?$/,
            exclude: /node_modules/,
            loader: "ts-loader",
            options: {
               // disable type checker - we will use it in fork plugin
               transpileOnly: true,
            },
         },
         {
            test: /node_modules[/\\](iconv-lite)[/\\].+/,
            resolve: {
               aliasFields: ["main"],
            },
         },
      ],
   },
   resolve: {
      extensions: [".ts", ".js"],
   },
   output: {
      filename: "bundle.js",
      path: path.resolve(__dirname, "dist"),
   },
   externalsPresets: { node: true },
   externals: [
      nodeExternals({
         additionalModuleDirs: [path.resolve(__dirname, ".yarn")],
      }),
   ],
   plugins: [
      new ForkTsCheckerWebpackPlugin({
         eslint: {
            files: "./src/**/*.{ts,js}", // required - same as command `eslint ./src/**/*.{ts,tsx,js,jsx} --ext .ts,.tsx,.js,.jsx`
         },
      }),
      new CleanWebpackPlugin(),
   ],
}
