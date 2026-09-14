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

looking at system saying stock_count = 20
clinic_staff count = 17, they updateCount(stock_count) -> 17

but the server needs to confirm this, cannot assume immediately. if the UI can say 17, the server says 17? proof by confirmation. 

how? locally validating. user enters 30 items in UI, we validate, PUT /products/blahblah, success? update cache. failure? preserve previous truth.


### optimistic vs pessimistic update

user anaweza finya "save" button for the update to go to 17, lakini we immediately show the stock updated to 17. behind the scenes, PUT request yake bado iko in flight. this is the optimistic update -- inakuwa fast, nice for the patchy network concern. ubaya sasa ni the server inaweza zua, na user abaki ameamini that the correction ilipersist when it actually did not. 

user anaweza finya "save" button tu update the stock_count, nionyeshe the "saving..." loading indicator. ningojee the server irudishe 200, then only ivo ndio naona the "saving..." indicator inatoka. this is the pessimistic update. its slower, but trustworthy; simpler correctness model pia, na ni better especially for this inventory project. sasa ubaya tu ni inafeel slow on an already slow network patchy wifi environment.

i will lean to the pessimistic update. juu hii si kama kulike post. ni correctness of a clinic stock count (operational data). 
heri niambie tu user saving kuliko nionyeshe the update value is 17 when the network request ilifail. 


### network connectivity concern poses a problem

imagine sasa msee amedouble click the save button? network imehang na ametap to save again. duplication in the updating attempts. even if the PUT request is idempotent for the same value, sitaki UI to allow repeated actions. 

mutation duplication -> disable the button, show the loading "saving..." indicator then success (update the stock count) or failure (could not update stock yada yada). 
