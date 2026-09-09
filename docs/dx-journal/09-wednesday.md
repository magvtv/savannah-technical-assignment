### tacking caching

how i fetch & check plus invalidate the cache. a deliberate answer to this...

will go with stale-while-revalidate philosophy for list of items. same way instagram followers are cached but bank account figures are not.

would cache the following:

- categories (do not change as frequently),
- previously loaded pages (open items #3, navigate away, then come back to it). instant cache view plus background refresh.
- product list page, but depending on search/sort/category.

server remains authoritative.

request -> cached data there? if yes -> show cached data -> validated -> update cache
request -> cached data there? if no -> fetch

### how does stock correction affect caching

### optimistic vs pessimistic update

### network connectivity concern poses a problem
