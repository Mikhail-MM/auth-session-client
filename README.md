This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

### `yarn test`

Launches the test runner in the interactive watch mode.<br />
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `yarn build`

Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br />
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `yarn eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: https://facebook.github.io/create-react-app/docs/code-splitting

### Analyzing the Bundle Size

This section has moved here: https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size

### Making a Progressive Web App

This section has moved here: https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app

### Advanced Configuration

This section has moved here: https://facebook.github.io/create-react-app/docs/advanced-configuration

### Deployment

This section has moved here: https://facebook.github.io/create-react-app/docs/deployment

### `yarn build` fails to minify

This section has moved here: https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify


```
  Animating Routes in React Router:

    The issue with animating routes is that React Router is concerned primarily with un-mounting an old component and re-mounting a new component immediately, when a route change is registered.
    For a pair of transitions, we actually want both routes rendered simultaneously - both routes actually need to be mounted until the exiting transition is complete for the route that we just navigated away from, 
    and until the entering transition can complete.

    The other issue is delaying the transition - React Transition Group will begin both sets of transitions immediately. That means that the exiting route and entering route will begin their animations at the same time,
    and there may be an overlap, which is a problem if you want a clear, staggered transition.

    The solution is to introduce a transition delay - at first I placed this `transition-delay` (matching the duration of the total transition time) directly in CSS on the page-enter-active class 
    This would essentially trigger the exit transition but force CSS to delay the enterance of the newly mounted component.

    However, this was broken in chrome.

    The solution was to manage the property directly on the child element rendered by CSSTransition:

      <div
        style={{
          transitionDelay: match
            ? `${routeTransitionDelay}ms`
            : '0ms',
        }}
        className="w-full max-w-md absolute"
      >
      
    A second challenge was managing the layout of the container.

    Problem: Both routes must be rendered simultaneously

    Sometimes, routes are entire pages.
    We generally don't design apps to render two entire page containers sequentially. Logically, only one would render.
    In this situation, it's easiest if the container of our route contents is `position: absolute;`

    Alignment becomes a problem, for example, if we want to transition out a center-aligned absolute container and transition in a flex-start aligned absolute container.
    When these alignment containers were rendered inside of the CSSTransition, the boundaries of the page overflowed and I was unable to solve why. 

    The solution was to store the alignment as state in the React component. 

    The alignment container would house the entire array of transitionable routes.

    We used the `useLocation()` hook to track the location props injected by the Router on each render of App.

    We pass the path.name as a dependency to useEffect, so each time the path changed, we were able to determine what the alignment of that route's contents should be, and we triggered a state change
    on a `setTimeout` callback that used the transitionDelay to make the layout change just as the exiting route finished its exit transition.
```


Issues:

1) Delete all sessions when clearing database. Otherwise stale sessions can persist (This is unlikely to ever happen in production.)


TODO:

1) Handle Unique Constraint Violation (Inside of Model?) (PUT requests - general model updates.)
2) Handle Foregin Key Constraint Violation (Create a POST with an invalid UserID)