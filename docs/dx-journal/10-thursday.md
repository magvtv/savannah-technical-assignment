### the constraints i have seen

patchy connectivity - a product concern. page takes 5 seconds to load, request fails, navigating backwards, loss of network while updating a stock (the assignment's edge cases). PLATFORM RESILIENCE.

deep link sharing - part of the application model, not just navigation

multi-clinic rollout - not architecting for one clinic forever; but also not asked for multi-enterprise build

difference in physical reality and system reality - write operation to correct state, not just reading data

### primary users

clinic supplies team

no nurses, doctors. procurement (not to invent clinic content not provided by API)

users use ward tablets, operate with varying connectivity, inspect individual items, need to locate stock count quick, share item links with colleagues

### platform primary jobs

find something - show them what they are looking for. search, filters, sorting, pagination

understand something - dedicated items details page

correct something - important to have a write operation for the users

return to something - not frontend convenience, but part of workflow (deep linking)

### what should an item expose

just useful information, not too much, not too little.

probably items list needs to have product name, category, current stock, brand?, thumbnail?

items details needs: title, description, category, price, stock_count, brand?, rating?

### state modelling

reasoning through the three states they have put across

server state: data belonging to the backend (API). products, categories, current_user, auth status, updated stock_count. always pulling truth from the source.

url state: state should survive the test of navigation, shareable. search, categories, sort, pagiation... on refresh the url should have same search/sort/filter. copied url preserves that state.
"/items?search=drug&category=painkillers&sort=stock-desc&page=3"

can be source of truth for catalogue view state

local ui state: temporary with user interaction. updating the stock_count, opening filter modal/panel, message toast visibility, confirmation dialogue opening

### now, the state architecture principle

not everything into a global state

application state - server state (API data, categories, users), local ui state (dialogs, forms, loading ui), url state (search, page, filtering).
