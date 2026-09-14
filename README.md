# savannah clinic stock console

hey there. this is my submission for the savannah informatics frontend engineering assessment. 

i didn't just want to build a pretty crud app. the brief asked for a stock management console for a clinic, used on ward tablets, often over patchy wifi. i took those constraints seriously and built the architecture around them.

here is how to run the project, followed by my decision log on how i approached the engineering edge cases.

### how to run it locally

i used bun for this project because it's insanely fast.
1. `bun install` (to install dependencies)
2. `bun run dev` (to start the local server)
3. `bun run test:unit` (to see my edge-case tests pass)
4. `bun run build` (to verify the production bundle compiles)

---

### the architecture

framework: vue 3 + typescript. 
routing: vue-router.
caching & fetching: tanstack vue-query.
state: pinia + sessionstorage.
styling: vanilla css (boring is good).

### engineering decision log

here is my thinking on the core logic choices and edge cases.

#### 1. tacking caching & data fetching
how i fetch, check, and invalidate the cache. i went with a stale-while-revalidate philosophy for the list of items. the same way instagram followers are cached but bank account figures are not.
i cache the categories (they don't change frequently) and the product list. the server remains authoritative. 
request -> cached data there? if yes -> show cached data -> validated -> update cache.

#### 2. state ownership (the url is king)
for the catalogue, the url query parameters (`?search=...&category=...&sort=...&page=...`) are the single source of truth. 
if a user on a ward tablet filters to page 2 of a category, copies the url, and pastes it in a new tab, they land exactly where they were. 

#### 3. optimistic vs pessimistic updates
how does stock correction affect caching? looking at a system saying stock_count = 20. clinic staff count = 17, they update to 17.
user anaweza finya "save" button and we immediately show the stock updated to 17 while the put request is in flight. this is the optimistic update. it's fast, nice for the patchy network concern. ubaya sasa ni the server inaweza zua (fail), and the user is left believing the correction persisted when it didn't.

instead, i leaned to the **pessimistic update**. user finyas "save", i show a "saving..." indicator, disable the button to prevent duplicate mutations, and wait for the server to return 200 before removing the indicator. it feels slightly slower, but it's trustworthy. this is operational data (clinic stock), not a facebook like. heri niambie tu user "saving..." kuliko nionyeshe the wrong value.

#### 4. handling patchy networks & 1-minute tokens
the brief specifically asked to request a 1-minute token and handle it gracefully. 
i set up an axios response interceptor. if a request fails with a 401 unauthorized, the interceptor pauses the UI, silently calls `/auth/refresh` behind the scenes, updates pinia and sessionstorage, and retries the original request. the user never even knows their token expired. it just works.

#### 5. mock api limitations (dummyjson)
i ran into two specific limitations with the dummyjson api and handled them:
- **mutually exclusive filters:** dummyjson does not allow combining `/products/search?q=x` and `/products/category/y` in one request. to handle this, i disabled the category dropdown in the ui whenever a search string is active, preventing the app from breaking.

- **mutations don't persist:** when you put a stock update to dummyjson, it returns a 200 success with your new number, but it doesn't actually update its backend database (to prevent public corruption). so, when you navigate back to the catalogue and the app refetches the list, the stock count reverts to the original dummy data. the ui is architected correctly (invalidating the cache on save), the backend just resets instantly. 

thanks for reading, and hope you enjoy clicking around the app.
