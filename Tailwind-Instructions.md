Installing TailwindCSS in CRA:
https://blog.logrocket.com/create-react-app-and-tailwindcss/

Install the Dependency
```
$ yarn add tailwindcss --dev
```

Initialize the config file with some the default configuration scaffold.:
```
$ npx tailwind init tailwind.js --full
```

Install Autoprefixer and PostCSS-CLI:
```
$ yarn add postcss-cli autoprefixer --save-dev
```

Create a PostCSS Config Directory:
```
$ touch postcss.config.js
```

Create a `postcss.config.js` file in the Project Root Dir.
```js
//postcss.config.js
 const tailwindcss = require('tailwindcss');
 module.exports = {
     plugins: [
         tailwindcss('./tailwind.js'),
         require('autoprefixer'),
     ],
 };
 ```

 Create style folders in `/src` Dir
```
 src/styles
  index.css
  tailwind.css
```

Add the following directives to index.css:
Note: You can place overrides here!
```css
  @tailwind base;
  @tailwind components;
  @tailwind utilities;
```


Add the following scripts to package.json:
```json
{
  "scripts": {
    "build:style":"tailwind build src/styles/index.css -o src/styles/tailwind.css",
    "start": "npm run build:style && react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject"
  },
}
```

Now you're ready!