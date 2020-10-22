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

# Architecture

Paytify is designed as a 100% "Serverless" application taking advanted [![Google Cloud](https://img.shields.io/badge/gcp-Google%20Cloud%20Platform-blue)](http://cloud.google.com) services like **Cloud Functions**, **Pub/Sub**, **GCP Key Management Service** and **Cloud Load Balancer**


<p align="center">
  <img src="https://github.com/marianoalbera/paytify/blob/main/docs/architecture/Paytify%20Serverless%20-%20Current.png?raw=true" align="center" alt="PayTiFy" width="800">
</p>

### **ptyGateway** 
Is the first function that recieves all requests, validates the API KEY and 

# Payment Flows

# Documentation
<p align="right">
  <a href="https://swagger.io/"><img src="https://www.scottbrady91.com/img/logos/swagger-banner.png" align="right" alt="Swagger" width="120"></a>
</p>
We use [Swagger.io](https://swagger.io) to design the API and generate the documentation, which you can find here:

* Auto generated [Documentation](http://paytify.tk/docs/index.html)

* YAML Swagger [file](https://github.com/marianoalbera/paytify/blob/main/swagger.yaml)

# Still TO-DO