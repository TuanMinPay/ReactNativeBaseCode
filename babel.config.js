module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    ["@babel/plugin-proposal-decorators", {"legacy": true}],
    [
      "module-resolver",
      {
        "root": [
          "./app"
        ],
        "extensions": [
          ".js",
          ".ios.js",
          ".android.js"
        ],
        "alias": {
          "app": "./app",
          "abilities": "./app/abilities",
          "assets": "./app/assets",
          "caches": "./app/caches",
          "components": "./app/components",
          "configs": "./app/configs",
          "constants": "./app/constants",
          "controls": "./app/controls",
          "databases": "./app/databases",
          "globals": "./app/globals",
          "handlers": "./app/handlers",
          "helpers": "./app/helpers",
          "modules": "./app/modules",
          "screens": "./app/screens",
          "services": "./app/services",
          "stores": "./app/stores",
          "utils": "./app/utils",
        }
      }
    ]
  ],
  env: {
    "production": {
      "plugins": [
        "transform-remove-console"
      ]
    }
  }
};
