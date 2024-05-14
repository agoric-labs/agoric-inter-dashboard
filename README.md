# Inter-Protocol Dashboard and API Workers

## Development

### Dashboard

To set up and run the dashboard locally, follow these steps:

1. Install the dependencies:
    ```sh
    yarn install
    ```
2. Start the development server:
    ```sh
    yarn dev
    ```

### API Worker

To set up and run the API worker locally, follow these steps:

1. Navigate to the `workers/inter-balances` directory:
    ```sh
    cd workers/inter-balances
    ```
2. Install the dependencies:
    ```sh
    yarn install
    ```
3. Start the Wrangler development server:
    ```sh
    yarn wrangler dev
    ```

## Deployment

### API Worker

To deploy the API worker, use the following command:

```sh
yarn wrangler deploy
