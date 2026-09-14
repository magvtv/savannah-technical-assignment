### bun vs npm

chose bun because of faster installs and script execution. the runtime bado ni node-compatible, just my tooling choice.

### discovered project limitations

1. dummy json backend database does not update. i think this is intentional. 
i realized this because it does not persist updates across PUT requests. 
i can update stock count and it will revert to the original value on subsequent GET requests.
the UI is correct to invalidate the cache and refetch the list after an update; ensuring the frontend accurately reflects the server as truth source even if the mock server resets


