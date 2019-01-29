# THE_TRADER

## Tech

- React => For building the interface along with:
  - `Next.js` for server side rendering, routing and tooling
  - `StyledComponents` for styling
  - `React-Apollo` for interfacing with Apollo Client
  - `Material-UI` for theming and styling _(works well with styled components)_
- Apollo Client => For data management:
  - Perform GraphQL `Mutations`
  - Fetching GraphQL `Queries`
  - `Caching` GraphQL data
  - Managing `Local State`
  - `Error` and `Loading` UI states
  - _Note: Apollo client replaces the need for redux + data fetching/caching libraries_
- GraphQL Yoga => An express GraphQL Server for:
  - Implementing `Query` and `Mutation Resolvers`
  - Custom `Server Side Logic`
  - `Charging` credit cards
  - `Sending Email`
  - Performing `JWT Authentication`
  - Checking `Permissions`
- Prisma => A GraphQL database interface:
  - Provides a set of GraphQL `CRUD APIs` for MySQL or Postgres database
  - `Schema` Definition
  - Data `Relationships`
  - `Queried` directly from our Yoga server
  - `Self-hosted` or `as-a-service`

## Architecture - front-end

- \_app.js _(pages/\_app.js)_ - is the base document and essentially the entry point for our app:
  - It extends `next/App` and is rendered on ever page as the highest order component
  - It has a prop called `Component` which will render the current page we are on as its component. _(the name of the route is the page that will be rendered from the pages folder)_
  - This Component prop is wrapped in a `Page` component from the `components` folder and is where most of our theming wil take place
- \_document.js _(pages/\_document.js)_ - is our hook into `next/document`:
  - Is rendered on the server side
  - Is used to change the initial server side rendered document markup
  - Commonly used to implement server side rendering for css-in-js libraries
  - uses the ServerStyleSheet from styled components along with `next/document` to crawl our component and get any styles it needs for the page
  - _note: there is also an NoSsr tag found in the Page component to render the material theme server side_
- Page.js _(components/Page.js)_ - Is where we can do our theming and wraps every page:
  - entry point for theming such as `StyledComponents` and `Material-UI` setup
  - contains the Header.js component as we want to include it on every page
  - contains our `Meta.js` component to include all of the classic meta tags
  - uses the children prop to inherit and render the current page we are on.
- Header.js _(components/Header.js)_ - Our standard Header to be included on every page:
  - contains our `Nav.js` component
  - contains our search bar _(ToDo: update when we have entry component)_
  - contains our cart _(ToDo: update when we have entry component)_
  - contains nProgress UI and has the Router to render loading ui to the user
- Meta.js _(component/Meta.js)_ - Takes care of all the meta tags you would normally see in an html document:
  - contains `next/head` to update our document header and do side effects behind the scenes
  - title tag
  - any external css you may need to include
  - fb, twitter etc meta tags
  - loads in our `nProgress` css from the static folder
  - contains our viewport meta for responsive design
  - uses utf-8 for character encoding
  - loads in our favicon

## Global/InjectGlobal Css styles

- font-size is a base 10px on the html tag meaning when we do rem 1.5 it will be 15px i.e a multiple of base 10

## Component Tree

```JS
 <App>
  <Container>
    <Page>
      <Meta>
        <SideEffect(Head)>
          <Head />
        </SideEffect(Head)/>
      </Meta>
      <Header>
        <Nav>
      </Header>
      <NextPageComponent>
    </Page>
  </Container>
 </App>
```

## Architecture - Back-end

- index.js _(src/index.js)_ - This is the entry point for our application and serves as the following:
  - imports our `createServer.js` file and starts it
  - implements cors when starting server so that only our site and credentials can hit it
  - something else
- db.js _(src/db.js)_ - This file connects to the remote prisma DB and gives us the ability to query it with JS
- createServer.js _(src/createServer.js)_ - Creates our GraphQL Yoga server

  - Is an express server so can use other express middlewre
  - sits on top of apollo server
  - imports our resolvers _(Queries and Mutations)_ and sets them up with our server
  - _note: you would need to import everything graphql yoga does to get a working grahql server_

## Backend scripts

- e.g inside the backend directory run `yarn run deploy`

```json
"scripts": {
  "start": "nodemon -e js,graphql -x node src/index.js",
  "dev": "nodemon -e js,graphql -x node --inspect src/index.js",
  "test": "jest",
  "deploy": "prisma deploy --env-file variables.env"
}
```

## Frontend scripts

- e.g inside the frontend directory run `yarn run dev`

```json
"scripts": {
  "dev": "next -p 7777",
  "build": "next build",
  "start": "next start",
  "test": "NODE_ENV=test jest --watch",
  "heroku-postbuild": "next build"
}
```

## Prisma Setup.

- with the boiler plate navigate to the backend and install prisma globally `npm i -g prisma`
- Then run `prisma login` which will open up your browser _(You will want a prisma.io account)_
- Then run `prisma init` which will run you through a setup process on where you want to deploy your prisma server and will create 2 files for you:
  - `prisma.yml` - contains our server endpoint for setup, you will want to modify this file and create a `variables.env` file
  - `datamodel.graphql` -

###### prisma.yml

```yml
endpoint: ${env:PRISMA_ENDPOINT}
datamodel: datamodel.graphql
# secret is the database password, ommiting it in dev means easier development
# secret: ${env:PRISMA_SECRET}
hooks:
  post-deploy:
    - graphql get-schema -p prisma
```

###### variables.env

```.env
FRONTEND_URL="http://localhost:7777"
PRISMA_ENDPOINT="https://us1.prisma.sh/heath-dunlop-37e897/the-trader/dev"
PRISMA_SECRET="MyDataBasePassword@$92"
APP_SECRET="jwtsecret123"
STRIPE_SECRET="sk_123youchanget his"
PORT=4444
```

### Other Libraries of Note

- NProgress
