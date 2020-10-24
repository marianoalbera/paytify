<p align="right">
  <img src="http://paytify.tk/img/paytifyLogo.png" align="right" alt="PayTiFy" width="120">
</p>

# Paytify
Paytify is a 100% serverless API designed to allow merchants to take payments and retrieve information about previous transactions.

Paytify implements a 2-phase-commit model where all transactions need to be authorized first and charged later. That gives the merchant more flexibility to confirm the availability of the products before securing the charge.

On version 1.0.0 of Paytify API the merchant can:
* **Tokenize** the customer card information **Required for the other transactions
* **Authorize** a tokenized card which will validate the card works and put a temporary block on the funds.
* **Charge** a successful authorization to commit the charge into the account. This will complete the payment process
* **Strongly Authenticate** a customer with SCA support when required to validate the transaction
* **Retrieve** any existing transaction information with updated data of payment status

# Project Roadmap

This section outlines work that is currently being worked on and things we plan to work on next. The first version aims to deliver minimal functionality to tokenize, authorize, authenticate, charge and retrieve. In future versions we aim to complete more functional and non-functional features, like refunds, cancellations, continuos delivery tools, automated testing, Api key management, reporting tools, Client SDK, etc. 

| Done  | In progress / To-Do |
| ------------- | ------------- |
| - [x] Github Readme   | - [ ] v1.0.0 API Implementation  |
| - [x] Api design and documentation   | - [ ] CI/CD configuration  |
| - [x] Payment Flows documentation  | - [ ] Unit and Integration tests  |
| - [x] Architecture design  | - [ ] Secure data storage  |
|    | - [ ] TransactionLog observability implementation  |

# Payment Flows

Paytify aims to simplify payment integrations by delivering a very simple api flow. All transactions require the customer card to be Tokenized for security and to implement a 2-phase-commit model where the payment needs to be first authorized and then charged. Throught the authorization process the client might be asked to implement an extra SCA "Strong Customer Authentication" flow in order to authenticate the customer on a 2nd factor before moving on into the final charge transaction.

A simple diagram of the flow would be:
<p align="center">
  <img src="https://github.com/marianoalbera/paytify/blob/main/docs/flows/Paytify-flows-simple.png?raw=true" align="center" alt="PayTiFy" width="800">
</p>

You can also find more detailed flow documentation here:

-   Tokenization :arrow_right: [**Here**](https://github.com/marianoalbera/paytify/blob/main/docs/flows/Tokenize.png?raw=true)
-   Authorization :arrow_right: [**Here**](https://github.com/marianoalbera/paytify/blob/main/docs/flows/Authorization.png?raw=true)
-   Strong Customer Authentication :arrow_right: [**Here**](https://github.com/marianoalbera/paytify/blob/main/docs/flows/SCA.png?raw=true)
-   Charge :arrow_right: [**Here**](https://github.com/marianoalbera/paytify/blob/main/docs/flows/Charge.png?raw=true)

# API Documentation
<p align="right">
  <a href="https://swagger.io/"><img src="https://www.scottbrady91.com/img/logos/swagger-banner.png" align="right" alt="Swagger" width="120"></a>
</p>
We use [Swagger.io](https://swagger.io) to design the API and generate the documentation, which you can find here:

* Auto generated **[Documentation](http://paytify.tk/docs/index.html)**

* YAML Swagger **[file](https://github.com/marianoalbera/paytify/blob/main/swagger.yaml)**


# Architecture

Paytify is designed as a 100% "Serverless" application taking advanted [![Google Cloud](https://img.shields.io/badge/gcp-Google%20Cloud%20Platform-blue)](http://cloud.google.com) services like **Cloud Functions**, **Pub/Sub**, **GCP Key Management Service** and **Cloud Load Balancer**

<p align="center">
  <img src="https://github.com/marianoalbera/paytify/blob/main/docs/architecture/Paytify%20Serverless%20-%20Current.png?raw=true" align="center" alt="PayTiFy" width="800">
</p>

## Architecture Components

* **ptyGateway** 
Is the first function that recieves all requests, validates the API KEY against the Api Token Repo and then routes the request to the right domain currently between **Cards** or **Transactions**

* **ptyApiTokenRepo** 
Is the function in charge of interacting with GCP Key Management Services to retrieve and validate API tokens recieved

* **ptyTransactions** 
Is the function that validates and orchestrates all of the different flows regarding Transactions.
    - **ptyTransactionRepo**
        The Repo function is the one that interacts directly with the repository of the data and abstracts all other functions from interacting with the data directly.
    - **ptyTransactionRetrieve**
        Is the function in charge of retrieving the transaction data directly from the TransactionRepo function
    - **ptyTransactionUpdate**
        Is the function in charge of updating the status of a specific transaction.
    - **ptyTransactionCreate**
        Is the function in charge creating a new transaction and storing it in the Repo.

* **ptyCards** 
Is the function that validates and orchestrates all of the different flows regarding Cards
    - **ptyCardsTokenize**
        The Repo function is the one that interacts directly with the repository of the data and abstracts all other functions from interacting with the data directly.
    - **ptyCardsAuthorize**
        This function takes the card and charge information and authorizes the payment against the bank gateway
    - **ptyCardsCharge**
        This function charges and existing succesful authorization
    - **ptyCardsSCA**
        This function handles the URL generation and required validation for SCA 

* **ptyTransactionLogPubSub** 
This GCP Pub/Sub instance will recieve messages from all the other functions in order to provide traceability and observability
    - **ptyTransactionLogSub**
        The TransactionLogSub function subscribes to the TransactionLog Queue and stores differents types of messages into the TransactionLogCache for then to be used by the API for observability and also included in some of the API responses
    - **ptyTransactionLog**
        The TransactionLog function retrieves all the available information regarding the transactionlog for an existing transaction
    - **ptyTransactionLogCache**
        The TransactionLogCache stores in memory all of the different TransctionLog messages.

# Building the API

# Testing the API