## Project Structure

```
my-app/
  README.md
  node_modules/
  package.json
  public/
    index.html
    favicon.ico
  src/
    server/ //server files
      index.js
      website.js
    App.css //client files
    App.js
    App.test.js
    index.css
    index.js
    logo.svg
```

For the project to build, **these files must exist with exact filenames**:

* `public/index.html` is the page template;
* `src/index.js` is the JavaScript entry point.

You can delete or rename the other files.

## Scripts

### `npm install`

Installs all packages required for frontend & backend.<br>

### `npm run client`

Runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br>
You will also see any lint errors in the console.

### `npm run server`

Runs the server in the development mode:<br>
[http://localhost:8080](http://localhost:8080).

The server will reload if you make edits.<br>

### `npm run dev`

Runs the above two commands concurrently.<br>

### `npm run test`

Runs test for the backend functions.<br>

### `npm run build`

Builds the app for production to the `build` folder.<br>
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br>

The build folder can be hosted using `http-server`.<br>