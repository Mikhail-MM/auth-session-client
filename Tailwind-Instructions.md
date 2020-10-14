Installing TailwindCSS in CRA:
https://blog.logrocket.com/create-react-app-and-tailwindcss/

Install the Dependency
$ yarn add tailwindcss --dev

Initialize the config file with some the default configuration scaffold.
$ npx tailwind init tailwind.js --full

Install Autoprefixer and PostCSS-CLI:
$ yarn add postcss-cli autoprefixer --save-dev

Create a PostCSS Config Directory
$ touch postcss.config.js

Add some config:

```
//postcss.config.js
 const tailwindcss = require('tailwindcss');
 module.exports = {
     plugins: [
         tailwindcss('./tailwind.js'),
         require('autoprefixer'),
     ],
 };
 ```

 Create some folders in "src"

 src/styles
  index.css
  tailwind.css

Add the following directives to index.css:

  @tailwind base;
  @tailwind components;
  @tailwind utilities;

Place css to override components/utilities under the respective directives

Add the following scripts to package.json:

"scripts": {
  "build:style":"tailwind build src/styles/index.css -o src/styles/tailwind.css",
  "start": "npm run build:style && react-scripts start",
  "build": "react-scripts build",
  "test": "react-scripts test",
  "eject": "react-scripts eject"
},