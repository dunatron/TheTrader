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
- Page.js _(components/Page.js)_ - Is where we can do our theming and wraps every page:
  - contains the Header.js component as we want to include it on every page
  - contains our `Meta.js` component to include all of the classic meta tags
  - uses the children prop to inherit and render the current page we are on.
- Header.js _(components/Header.js)_ - Our standard Header to be included on every page:
  - contains our `Nav.js` component
  - contains our search bar _(ToDo: update when we have entry component)_
  - contains our cart _(ToDo: update when we have entry component)_
- Meta.js _(component/Meta.js)_ - Takes care of all the meta tags you would normally see in an html document:
  - contains `next/head` to update our document header and do side effects behind the scenes
  - title tag
  - any external css you may need to include
  - fb, twitter etc meta tags
  - loads in our `nProgress` css from the static folder
  - contains our viewport meta for responsive design
  - uses utf-8 for character encoding
  - loads in our favicon

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
