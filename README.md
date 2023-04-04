# ACM at UCSD: Membership Portal UI

This repository is a complete open-source rewrite of the frontend code for the ACM at UCSD Student
Membership Portal. The live portal is viewable at:
[https://v2.members.acmucsd.com](https://v2.members.acmucsd.com).

For details on our underlying API, see
[our backend Github repository](https://github.com/acmucsd/membership-portal) or
[Postman API documentation.](https://acmurl.com/portal-api-docs)

# Setting Up Your Project

First, verify you have the correct versions of the necessary package managers.

- node v.18.10.0 (You can check your version by running `node -v`). Installation
  [here](https://nodejs.org/en/download/)
- yarn v1.22.19 (You can check your version by running `yarn -v`). Installation
  [here](https://classic.yarnpkg.com/lang/en/docs/install/#mac-stable)

### Optional Recommended Setup

We suggest using [`nvm`](https://github.com/nvm-sh/nvm) to manage multiple node versions if you work
on separate projects. Installation [here](https://github.com/nvm-sh/nvm#installing-and-updating). To
check if you have `nvm` installed, run `nvm -v` and ensure you can view your current version. Once
installed, run `nvm use` in the project root directory to set your node version to match the project
requirements.

Likewise, you can use [`corepack`](https://github.com/nodejs/corepack) to ensure the right package
manager and version is being used. If your node version is configured properly, `corepack` should
already be installed and available. Manual installation [here](https://nodejs.org/en/download/)

<!-- USING COREPACK IN CI:
run `corepack prepare -o` whenever changing the package manager version to update `.corepack.tgz`.
then, in CI, we can run `corepack hydrate .corepack.tgz` to load the appropriate package manager version.
-->

## VSCode Marketplace Extensions

Our development team utilizes various VSCode extensions to ease the development process with code
shortcuts and error highlighting.

When opening the project in VSCode, you should get a prompt to install the recommended extensions.

Alternatively, you may manually install them, listed below:

- Prettier - Code formatter (`esbenp.prettier-vscode`)
- ESLint (`dbaeumer.vscode-eslint`)
- Stylelint (`stylelint.vscode-stylelint`)
- Prettier ESLint (`rvest.vs-code-prettier-eslint`)
- stylelint-plus (`hex-ci.stylelint-plus`)
- NPM Intellisense (`christian-kohler.npm-intellisense`)
- Path Intellisense (`christian-kohler.path-intellisense`)
- Simple React Snippets (`burkeholland.simple-react-snippets`)
- Auto Rename Tag (`formulahendry.auto-rename-tag`)
- Auto Close Tag (`formulahendry.auto-close-tag`)

None of these are required to run the repository so feel free to look through the full descriptions
for each extension to decide if you'd like to use it. We have listed them from most to least
valuable below if you decide to use them.

## Create an environment file

Copy the `.env.example` file from the root directory and duplicate it twice, naming the new files as
`.env.development` and `.env.production`. Set appropriate values for each secret variable listed
here and ensure that your `.env.*` files are included in your `.gitignore` to prevent pushing to
Github.

## Running the Repo

If it's your first time running the repository, run `yarn` or `yarn install` to install all
`node_modules` packages. If your global yarn version isn't compatible, try prefixing instances of
`yarn` with `corepack`, e.g. `corepack yarn` (this applies to later commands as well).

Run `yarn dev` to start a dev environment with the data from our testing API.

Run `yarn prod` to run a production-ready build locally.

Once running, if there are no errors displaying in your command line terminal, the local deployment
should be visible at `localhost:3000`. If you cannot view your project here, ensure that you have no
other running processes on the port and have entered the start script correctly.

<br />
<br />

# Documentation

## Development Tech Stack

**JSX** - JSX is a syntax specific to React projects that supports JavaScript expressions mixed with
HTML markup that can be returned from a function to render powerful components.

An example of `JSX` code that is not valid JavaScript is the following snippet:

```JSX
const CustomButton = ({text}) => <button>{text}</button>
```

**TypeScript** - TypeScript is a superset of JavaScript that supports all of the same features with
the added ability to annotate variables and functions with type declarations. This provides us with
compile-time validation and error checking, powerful autocomplete, and high-quality code readability
and documentation for other developers.

An example of `TypeScript` code that is not valid JavaScript is the following snippet:

```TypeScript
interface UserType {
  name: string;
}

const loggedInUser: UserType = getUser();
```

**SCSS** - SCSS (Sass) is a CSS pre-processor that supports all of the same features of a standard
stylesheet with additional features to improve the development experience that are combined to
regular CSS when built. Most notably, we rely on SASS variables and nested selectors to clearly
specify hierarchies of HTML tags and precisely identify elements to style.

An example of `SCSS` code that is not valid CSS is the following snippet:

```SCSS
@use './vars.scss' as vars;

.container {
  .element {
    color: vars.$red;
  }
}
```

**CSS Modules** - CSS Modules are a concept where CSS class names and values inside a file are
scoped locally by default to avoid naming collisions. This allows for simpler CSS naming conventions
following standards for different types of components and modular units that we don't have to worry
about colliding.

For example, unlike regular CSS, the following snippet would have no CSS naming collisions or
precedence conflicts

`style1.module.css`

```CSS
.container {
  background-color: #000;
}
```

`style2.module.css`

```CSS
.container {
  background-color: #fff;
}
```

```JSX
import styleModule1 from './style1.module.scss'
import styleModule2 from './style1.module.scss'
const Component1 = () => {
  return <div className={styleModule1.container}></div>
}
const Component2 = () => {
  return <div className={styleModule2.container}></div>
}
```

**Linting** - Linting is the process of maintaining code quality by enforcing a consistent set of
guidelines for all developers to abide by. In general, we use ESLint to follow the Airbnb style
guide for JavaScript code along with some minor adjustments for our use cases and the standard
Stylelint ruleset for SCSS code.

If you have the ESLint and StyleLint VSCode extensions, you should receive real-time error
highlighting when your code breaks a linting rule that explains what went wrong.

The screenshot below is an example of an **ESLint** error.

![Screenshot 2023-02-13 at 10 00 15 PM](https://user-images.githubusercontent.com/33165426/218652469-3038036e-177c-4ec7-8af0-71ec58a8a49d.jpg)

**Formatting** - Formatting is the process of changing your code to follow consistent styles with
indentation, brackets, etc.

If you have the Prettier Code Formatter VSCode extension, your editor will likely fix many of the
linting issues that arise for you automatically when you save a file. For Prettier to work by
default, you must have the VSCode setting `"editor.formatOnSave": true` enabled.

## Project Structure

- `/public`: Our public folder stores all static assets which will be hosted on the website domain
  and accessible to any users directly. E.g. `public/pic.jpg` would be viewable to any user at
  `localhost:3000/pic.jpg`
  - `/assets`: Our assets folder stores all static images which are necessary for our application.
    By storing them statically, we don't have to include them in our JavaScript application bundle
    and can identify images with relative paths such as `<img src='/assets/icons/acm-icon.svg'>` and
    make them accessible to any users directly. E.g. `public/pic.jpg` would be viewable to any user
    at `localhost:3000/pic.jpg`
- `/src`: Our source folder is where all client-side code for our application is stored.

  - `/pages`: The pages folder is a Next.js feature which allows us to take advantage of a built-in
    routing tool that comes with the framework. When we visit a page `localhost:3000/leaderboard`,
    the data that is rendered is the component that returns from `pages/leaderboard.tsx`. The only
    components that live in this folder are those that have a 1:1 correspondance to a certain route
    on our application's sitemap.
  - `/styles`: The styles folder is where we define any top-level SCSS stylesheets. This includes
    those used globally across the application to function properly and styles used directly in
    top-level page components. Individual component-level styles will be defined in a folder
    specific to that component under `src/components`.
  - `/lib`: The library folder is where we store all of the business logic for our application. All
    functions and variables should be properly typed following TypeScript standards as a source of
    documentation for any other locations in our application that rely on their data.
    - `/api`: The API folder is where we define classes to interact with the ACM Portal API and any
      other external API services. Each function is unique to a single API route and should make it
      simple to pass in all required data and handle the network request.
    - `/constants`: The constants folder is used to store data for aspects of the application that
      will never change. Any changes to this type of data would require manually editing the file in
      a new commit.
    - `/hoc`: The higher-order component (HOC) folder stores higher-order functions used to create
      HOCs. A higher-order function is simply a function that returns another function. These
      functions can be extremely powerful if we want to abstract away common logic in functions that
      differ slightly in implementation.
    - `/managers`: The managers folder stores manager classes. A manager class contains static
      methods to manage one aspects of our application state. For example, an account manager class
      might handle logic functionality, fetching details from the user's public profile, and making
      profile edits. The standard we are following in this project is to wrap as much of the
      business logic that would typically be contained in a component in a function inside a manager
      class to make a single function call from the actual component. In addition, this will allow
      us greater modularity to test and verify each function's correctness.
    - `/services`: The services folder stores service classes. A service class deals with a single
      type of underlying behavior that is not directly tied to the application's state but required
      for various types of logic. If you're unsure of how to structure something, see the existing
      manager and service files for reference and feel free to discuss with us in a issue or pull
      request.
    - `/types`: The types folder stores all reusable type declarations. This includes API request
      body types and API response types for every endpoint on the ACM Portal API and any other API
      services. It also details sets of options such as account access types for the application
      state and generic alias types such as `UUID` and `URL` used to better signify string values.
      If you are working in development, we still recommend adds types to as many values as you can.
      Rather than leaving values untyped, feel free to use the `any` alias type `FillInLater` to
      bypass TypeScript security and validation checks. However, any merged pull requests must
      eventually replace instances of `FillInLater` with an appropriate value.
  - `/components`: The components folder is where all of the code that defines the various features
    of our application. We group components into folders by similar features to make it easier to
    import and deal with related code.
    - `/common`: The common folder is for any common components that are reused across the
      application. By default, any new components that are used once will be created somewhere under
      the `/components` folder. Once we have to import the same component in at least two different
      locations, we should migrate it to the common folder and isolate any common behavior as props
      to make it reusable.
