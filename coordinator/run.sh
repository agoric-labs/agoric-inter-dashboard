MANAGERS=$(curl --silent -d '{"jsonrpc":"2.0","id":1,"method":"abci_query","params":{"path":"/custom/vstorage/children/published.vaultFactory.managers"}}' https://main.rpc.agoric.net | jq -r '.result.response.value | @base64d | fromjson | .children | .[]')

while IFS= read -r manager; do
  BODY="{\"jsonrpc\":\"2.0\",\"id\":1,\"method\":\"abci_query\",\"params\":{\"path\":\"/custom/vstorage/children/published.vaultFactory.managers.$manager.vaults\"}}"
  VAULTS=$(curl --silent -d "$BODY" https://main.rpc.agoric.net | jq -r '.result.response.value | @base64d | fromjson | .children | .[]')

  while IFS= read -r vault; do
    BODY="{\"jsonrpc\":\"2.0\",\"id\":1,\"method\":\"abci_query\",\"params\":{\"path\":\"/custom/vstorage/data/published.vaultFactory.managers.manager0.vaults.$vault\"}}"
    STATUS=$(curl --silent -d "$BODY" https://main.rpc.agoric.net | jq '.result.response.value | @base64d | fromjson | .value | fromjson | .values[0] | fromjson | .body | sub("^#"; "") | fromjson | .vaultState')
    echo $manager $vault $STATUS
  done <<< $VAULTS
done <<< $MANAGERS
