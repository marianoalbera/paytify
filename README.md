<p align="right">
  <img src="http://paytify.tk/img/paytifyLogo.png" align="right" alt="PayTiFy" width="200">
</p>

# Paytify
Paytify is a minimal serverless API designed to allow merchants to take payments and retrieve information about previous transactions.

Paytify implements a 2-phase-commit model where all transactions need to be authorized first and charged later. That gives the merchant more flexibility to confirm the availability of the products before capturing the charge.

On version 1.0.0 of Paytify API the merchant can:
* **Tokenize** the customer card information **Required for the other transactions
* **Authorize** a tokenized card which will validate the card works and put a temporary block on the funds.
* **Charge** a successful authorization to commit the charge into the account. This will complete the payment process
* **Strongly Authenticate** a customer with SCA support when required to validate the transaction
* **Retrieve** any existing transaction information with updated data of payment status

# Project Roadmap

## V1.0.0 ( MVP Version )

The first version of Paytify is designed to be minimal and support only basic transactions and support a small / medium business, as the volumes grow it will clearly require additional architecture components, more functionality and security, more scalable technologies, additional tools for observability,  monitoring and customer support and self service.

| Completed  |
| ------------- | 
| - [x] Github Readme   | 
| - [x] Api design and documentation   |
| - [x] Payment Flows documentation  |
| - [x] Architecture design  |

| Ongoing  |
| ------------- | 
| - [ ] v1.0.0 API Implementation  | 
| - [ ] CI/CD configuration  |
| - [ ] Unit and Integration tests  |

## Future Versions

In order to improve scalability and support a larger number of customers and transactions the Paytify platform will have to evolve accordingly.

| Paytify Future version Candidates |
| ------------- |
| - [ ] New functionalities such as Refunds, Cancellations, Recurring subscriptions  |
| - [ ] New forms of payment like direct debit, Wallets, Bank Transfers, Invoices, etc   |
| - [ ] Additional data request for better fraud prevention   |
| - [ ] Fraud prevention as a standalone product |
| - [ ] Customer data model and services & tools to manage it, including API tokens   |
| - [ ] Customer tools for self configuration management and reporting   |
| - [ ] Client SDK for common languages  |
| - [ ] Move towards CF + Microservices for more complex implementation  |
| - [ ] More robust circuit breaker implementation for key dependencies  |
| - [ ] HATEOAS Api model for return links in every transaction  |
| - [ ] Service Discovery to simplify configuration requirements |
| - [ ] Multi Region cloud hosting strategy for increased availability and reliability  |
| - [ ] Data lake and ETL processes for data science, analytics and tooling  |
| - [ ] VPC service controls to secure private functions  |
| - [ ] 3rd party tools for monitoring and observability  |



# Payment Flows

Paytify aims to simplify payment integrations by delivering a very simple api flow. All transactions require the customer card to be Tokenized for security and to implement a 2-phase-commit model where the payment needs to be first authorized and then charged. Throught the authorization process the client might be asked to implement an extra SCA "Strong Customer Authentication" flow in order to authenticate the customer on a 2nd factor before moving on into the final charge transaction.

A simple diagram of the flow would be:
<p align="center">
  <img src="https://github.com/marianoalbera/paytify/blob/main/docs/flows/Paytify-flows-simple.png?raw=true" align="center" alt="PayTiFy" width="800">
</p>

And a more detailed sequence diagram of the transactions:
<p align="center" >
  <kbd>
    <img src="https://github.com/marianoalbera/paytify/blob/main/docs/flows/PaytifySequenceDiagram.png?raw=true" align="center" alt="PayTiFy" width="600">
  </kbd>
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

* YAML Swagger **[file](https://github.com/marianoalbera/paytify/blob/main/swagger/swagger.yaml)**

# Architecture

Paytify is designed as a 100% "Serverless" application taking advanted [![Google Cloud](https://img.shields.io/badge/gcp-Google%20Cloud%20Platform-blue)](http://cloud.google.com) services like **Cloud Functions**, **Pub/Sub**, **GCP Key Management Service** and **Cloud Load Balancer**

We decided on **Google Cloud** as a platform to accelerate the delivery of the minimal version of Paytify as they have products for every need we might have. Cloud functions covers most of the computing needs, Cloud SQL can run any standard relational database, Pub/Sub is simple to use to collect events coming from the different functions and even more advanced products like Cloud Identity to provide a unified integrated access management platform.

Google Cloud Functions can be written using **JavaScript**, Python 3, Go, or **Java** which provide multiple choices for the development team. For the minimal version of PayTify we are using mostly Javascript / **NodeJs** runtime and also Java for specific cases.

As per the API design, many of the responses to the client contain a **TransactionLog** array that will provide more information about the execution of the request throught the different functions or services. The way we will implement the transaction log is by every function sending events to different **Cloud Pub/Sub** queues and the TransactionLog **Subscriber** CF collecting those events and grouping them in the TransactionLog **Cache**, which is then accesed by the TransactionLogRepo to deliver the data.

The design contains a single entry point **Gateway** CF that acts as an orchestration between the different domains. Each domain also contains a single entry **Gateway** CF that combines the execution of different functions in order to achieve the desired flow. In cases where there is data persistency needed, each entity contains a **Repository** CF that abstracts the other CFs from the data storage.

<p align="center">
  <img src="https://github.com/marianoalbera/paytify/blob/main/docs/architecture/Paytify%20Serverless%20-%20Current.png?raw=true" align="center" alt="PayTiFy" width="800">
</p>

## Architecture Components

* **ptyGateway** 
Is the first function that recieves all requests, validates the API KEY against the Api Token Repo and then routes the request to the right domain currently between **Cards** or **Transactions**

* **ptyApiTokenRepo** 
Is the function in charge of interacting with GCP Key Management Services to retrieve and validate API tokens recieved
  - * **ptyApiTokenCache** 
        The ptyApiTokenCache instance stores in memory all of the different Api Tokens and access levels for quick access.

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

##TO-DO

# Testing the API

##TO-DO