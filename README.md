# ServerlessShop v2 — AWS Lambda Container Image E-Commerce Platform

A production-style **serverless e-commerce application** built with **React + Vite, Node.js, Express, AWS Lambda Container Image, Amazon ECR, API Gateway, DynamoDB, S3, CloudFront, Route 53, ACM, SSM Parameter Store, IAM, CloudWatch, Docker, and GitHub Actions OIDC CI/CD**.

This project demonstrates how a traditional full-stack application can be modernized into a scalable, secure, containerized, cost-efficient, and fully serverless AWS architecture.

![Live Application](./docs/images/ds-home-page.png)

---

## Live Demo

**Application URL:** `https://container-lambda.rifkhan.xyz`

**Health Check:** `https://container-lambda.rifkhan.xyz/api/health`

**ServerlessShop V1 URL:** `https://serverless.rifkhan.xyz`

> Note: AWS resources may be stopped or deleted later to avoid cloud costs, but the full architecture, deployment proof, screenshots, and source code are documented in this repository.

---

## Project Summary

**ServerlessShop v2** is a full-stack e-commerce platform that supports customer shopping flows and admin management features.

This version upgrades the backend from **Lambda ZIP deployment** to **AWS Lambda container image deployment using Amazon ECR**.

The frontend is deployed using a fresh private S3 bucket behind CloudFront, while the backend is deployed as a Docker image stored in ECR and executed by Lambda.

The project includes:

- JWT authentication and role-based authorization
- Admin-only product and category management
- Product browsing, filtering, and searching
- Cart management
- Order creation and order status management
- Private S3 frontend hosting through CloudFront
- Serverless Express backend running as a Lambda container image
- Amazon ECR backend image registry
- API Gateway HTTP API
- Existing DynamoDB single-table database
- SSM Parameter Store for production configuration and secrets
- GitHub Actions CI/CD using AWS OIDC with no long-lived IAM access keys
- Separate frontend and backend deployment pipelines

---

## Project Upgrade

### Previous Version

```text
GitHub Actions
    ↓
Install production dependencies
    ↓
Create Lambda ZIP package
    ↓
Update Lambda ZIP function
```

### Current Version

```text
GitHub Actions
    ↓
Docker build
    ↓
Push image to Amazon ECR
    ↓
Update Lambda image URI
```

This version proves both **serverless architecture** and **container-based deployment** skills.

---

## Architecture Diagram

![ServerlessShop v2 AWS Architecture](./docs/Diagram/Diagram.png)

### High-Level Architecture Flow

```mermaid
flowchart TD
    User[Users / Browser] --> R53[Amazon Route 53 DNS]
    R53 --> ACM[AWS Certificate Manager SSL/TLS]
    ACM --> CF[Amazon CloudFront HTTPS 443]

    CF -->|Default behavior /*| S3[Amazon S3 Private Bucket]
    S3 --> FE[React + Vite Static Frontend]

    CF -->|/api/* behavior| APIGW[Amazon API Gateway HTTP API]
    APIGW --> LAMBDA[AWS Lambda Container Image<br/>Node.js + Express]
    LAMBDA --> DDB[Existing Amazon DynamoDB<br/>Single-Table Design]

    LAMBDA --> SSM[AWS Systems Manager Parameter Store]
    LAMBDA --> CW[Amazon CloudWatch Logs]

    ECR[Amazon ECR<br/>Backend Docker Image Registry] --> LAMBDA

    GHA[GitHub Actions] -->|OIDC Assume Role| IAM[AWS IAM Deploy Role]
    IAM -->|Deploy frontend| S3
    IAM -->|Invalidate cache| CF
    IAM -->|Push backend image| ECR
    IAM -->|Update Lambda image| LAMBDA
```

---

## Serverless Container Architecture

```text
User Browser
    ↓
Route 53 Custom Domain
    ↓
ACM SSL Certificate
    ↓
CloudFront HTTPS Distribution
    ├── Default behavior /*
    │       ↓
    │   Private S3 Bucket
    │       ↓
    │   React + Vite Static Frontend
    │
    └── API behavior /api/*
            ↓
        API Gateway HTTP API
            ↓
        AWS Lambda Container Image
            ↓
        Existing Amazon DynamoDB
```

---

## Request Flow

### Frontend Request

```mermaid
flowchart LR
    Browser[User Browser] --> Domain[Custom Domain]
    Domain --> Route53[Route 53]
    Route53 --> CloudFront[CloudFront]
    CloudFront --> S3[Private S3 Bucket]
    S3 --> React[React + Vite Frontend]
```

### API Request

```mermaid
flowchart LR
    React[React App] --> APIPath[/api/* Request]
    APIPath --> CloudFront[CloudFront API Behavior]
    CloudFront --> APIGW[API Gateway HTTP API]
    APIGW --> Lambda[Lambda Container Image]
    Lambda --> DynamoDB[Existing DynamoDB Table]
    Lambda --> SSM[SSM Parameter Store]
    Lambda --> Logs[CloudWatch Logs]
```

---

## CI/CD Pipeline

```mermaid
flowchart TD
    Dev[Developer Pushes Code] --> Repo[GitHub Repository]
    Repo --> Actions[GitHub Actions]
    Actions --> OIDC[OIDC Authentication]
    OIDC --> Role[AWS IAM Deploy Role]

    Role --> FEPath{client/** changed?}
    FEPath -->|Yes| InstallFE[Install Frontend Dependencies]
    InstallFE --> BuildFE[Build React App]
    BuildFE --> UploadS3[Upload dist/ to S3]
    UploadS3 --> InvalidateCF[Invalidate CloudFront Cache]
    InvalidateCF --> LiveSite[Updated Live Website]

    Role --> BEPath{server/** changed?}
    BEPath -->|Yes| DockerBuild[Build Docker Image]
    DockerBuild --> ECRLogin[Login to Amazon ECR]
    ECRLogin --> PushECR[Push Image to ECR]
    PushECR --> UpdateLambda[Update Lambda Image URI]
    UpdateLambda --> LiveAPI[Updated Live API]
```

### CI/CD Highlights

- GitHub Actions uses **OIDC authentication** with AWS
- No IAM user access keys are stored in GitHub
- Frontend and backend deploy independently
- Frontend changes deploy to S3 and invalidate CloudFront
- Backend changes build a Docker image, push it to ECR, and update Lambda
- Path-based workflows reduce unnecessary deployments
- Backend image tags use GitHub commit SHA for traceability

---

## Visual Deployment Workflow

```mermaid
flowchart TD
    A[Code Change] --> B{Changed Folder?}

    B -->|client/**| C[Frontend Workflow]
    C --> D[npm ci]
    D --> E[npm run build]
    E --> F[aws s3 sync dist/]
    F --> G[CloudFront Invalidation]
    G --> H[Updated React App]

    B -->|server/**| I[Backend Workflow]
    I --> J[Docker Build]
    J --> K[Push Image to ECR]
    K --> L[Update Lambda Image URI]
    L --> M[Updated API]

    H --> N[Production Updated]
    M --> N
```

---

## Application Features

### Customer Features

- User registration and login
- JWT-based authentication
- Browse products
- Search products by name or description
- Filter products by category
- Add products to cart
- Update cart quantity
- Remove cart items
- Place orders
- View personal orders

### Admin Features

- Admin-only protected routes
- Create categories
- Delete categories
- Create products
- Update products
- Soft delete products
- View all customer orders
- Update order status

### Cloud / DevOps Features

- Serverless Express backend using AWS Lambda
- Lambda container image deployment
- Amazon ECR image registry
- API Gateway HTTP API integration
- DynamoDB single-table design
- Private S3 frontend hosting
- CloudFront CDN with `/api/*` API routing
- Route 53 custom domain
- ACM SSL certificate
- SSM Parameter Store for secrets and configuration
- IAM least-privilege roles
- CloudWatch logs and monitoring
- GitHub Actions CI/CD with OIDC
- No long-lived AWS credentials

---

## Technology Stack

| Layer | Technology |
|---|---|
| Frontend | React, Vite, JavaScript |
| Frontend Hosting | Amazon S3 private bucket, Amazon CloudFront |
| Domain & SSL | Amazon Route 53, AWS Certificate Manager |
| Backend | Node.js, Express.js, serverless-http |
| Container | Docker |
| Container Registry | Amazon ECR |
| Compute | AWS Lambda Container Image |
| API Layer | Amazon API Gateway HTTP API |
| Database | Amazon DynamoDB |
| Secrets & Config | AWS Systems Manager Parameter Store |
| Security | IAM roles, JWT, private S3, GitHub OIDC |
| CI/CD | GitHub Actions |
| Monitoring | Amazon CloudWatch |

---

## AWS Services Used

| Category | Services |
|---|---|
| Frontend Delivery | S3, CloudFront |
| Domain & HTTPS | Route 53, ACM |
| Backend API | API Gateway, Lambda |
| Container Registry | Amazon ECR |
| Database | DynamoDB |
| Security | IAM, SSM Parameter Store, JWT |
| CI/CD | GitHub Actions, OIDC IAM Role |
| Monitoring | CloudWatch |

---

## DynamoDB Single-Table Design

### Table Configuration

```text
Table name: weightshop-serverless-prod
Partition key: PK
Sort key: SK
Billing mode: PAY_PER_REQUEST
GSI1: GSI1PK + GSI1SK
GSI2: GSI2PK + GSI2SK
```

> This v2 deployment reuses the existing DynamoDB table from the previous serverless version.

### Entity Patterns

| Entity | PK | SK | Purpose |
|---|---|---|---|
| User | `USER#userId` | `PROFILE` | User profile and authentication data |
| Category | `CATEGORY#categoryId` | `METADATA` | Product categories |
| Product | `PRODUCT#productId` | `METADATA` | Product information |
| Cart Item | `USER#userId` | `CART#productId` | User cart items |
| Order | `ORDER#orderId` | `METADATA` | Order data and embedded order items |

### DynamoDB Access Patterns

```mermaid
flowchart TD
    DDB[(DynamoDB Single Table)]

    Login[Login by email] --> EmailIndex[GSI1PK = EMAIL#email]
    EmailIndex --> DDB

    Categories[List categories] --> CategoryIndex[GSI1PK = CATEGORIES]
    CategoryIndex --> DDB

    Products[List products] --> ProductIndex[GSI1PK = PRODUCTS]
    ProductIndex --> DDB

    ProductsByCategory[Products by category] --> CategoryGSI[GSI2PK = CATEGORY#categoryId]
    CategoryGSI --> DDB

    Cart[Get user cart] --> CartQuery[PK = USER#userId and SK begins_with CART#]
    CartQuery --> DDB

    MyOrders[Get my orders] --> UserOrders[GSI2PK = USER#userId]
    UserOrders --> DDB

    AdminOrders[Admin list all orders] --> AllOrders[GSI1PK = ORDERS]
    AllOrders --> DDB
```

---

## API Endpoints

### Authentication

| Method | Endpoint | Access |
|---|---|---|
| POST | `/api/auth/register` | Public |
| POST | `/api/auth/login` | Public |
| GET | `/api/auth/me` | Authenticated |

### Categories

| Method | Endpoint | Access |
|---|---|---|
| GET | `/api/categories` | Public |
| POST | `/api/categories` | Admin |
| DELETE | `/api/categories/:id` | Admin |

### Products

| Method | Endpoint | Access |
|---|---|---|
| GET | `/api/products` | Public |
| GET | `/api/products/:id` | Public |
| POST | `/api/products` | Admin |
| PUT | `/api/products/:id` | Admin |
| DELETE | `/api/products/:id` | Admin |

### Cart

| Method | Endpoint | Access |
|---|---|---|
| GET | `/api/cart` | Authenticated |
| POST | `/api/cart` | Authenticated |
| PUT | `/api/cart/:id` | Authenticated |
| DELETE | `/api/cart/:id` | Authenticated |

### Orders

| Method | Endpoint | Access |
|---|---|---|
| POST | `/api/orders` | Authenticated |
| GET | `/api/orders/my-orders` | Authenticated |
| GET | `/api/orders` | Admin |
| PUT | `/api/orders/:id/status` | Admin |

---

## Security Design

```mermaid
flowchart TD
    Browser[Browser] -->|HTTPS| CloudFront[CloudFront]
    CloudFront -->|OAC Private Access| S3[S3 Private Bucket]
    CloudFront -->|/api/* HTTPS| APIGW[API Gateway]
    APIGW --> Lambda[Lambda Container Image]
    Lambda -->|IAM role only| DynamoDB[DynamoDB]
    Lambda -->|IAM role only| SSM[SSM Parameter Store]
    Lambda -->|Logs| CW[CloudWatch Logs]

    GitHub[GitHub Actions] -->|OIDC short-lived token| IAM[IAM Deploy Role]
    IAM -->|Push image| ECR[Amazon ECR]
    IAM -->|Update image URI| Lambda
    IAM -->|Sync frontend| S3
    IAM -->|Invalidate cache| CloudFront

    S3 -. Block Public Access Enabled .-> PublicAccess[No public bucket access]
    JWT[JWT Authentication] --> Lambda
    Admin[Admin Role Authorization] --> Lambda
```

### Security Highlights

| Component | Security Approach |
|---|---|
| S3 | Private bucket, no public access |
| CloudFront | Single public entry point with HTTPS |
| CloudFront OAC | Secure access to private S3 |
| API Gateway | Public API entry routed through `/api/*` |
| Lambda | Container image function with IAM execution role |
| ECR | Stores backend Docker images |
| DynamoDB | Accessible only through Lambda IAM role |
| SSM Parameter Store | Stores secrets and production configuration |
| GitHub Actions | Uses OIDC instead of IAM access keys |
| Application Auth | JWT authentication and admin-only routes |

---

## Environment Variables

### Frontend

```env
VITE_API_BASE_URL=/api
```

### Lambda Production

```env
NODE_ENV=production
AWS_REGION=ap-south-1
DYNAMODB_TABLE_NAME=weightshop-serverless-prod
SSM_PARAMETER_PREFIX=/weightshop/prod
```

### SSM Parameter Store Example

```text
/serverless/JWT_SECRET
/serverless/JWT_EXPIRES_IN
/serverless/CORS_ORIGIN
/serverless/DYNAMODB_TABLE_NAME
```

---

### Container Image Flow

```mermaid
flowchart LR
    Code[Node.js Express Backend] --> Dockerfile[Dockerfile]
    Dockerfile --> Image[Docker Image]
    Image --> ECR[Amazon ECR Repository]
    ECR --> Lambda[Lambda Container Function]
    Lambda --> APIGW[API Gateway HTTP API]
```

---

## Project Structure

```text
serverlessshop/
├── client/
│   ├── src/
│   ├── public/
│   ├── .env
│   └── package.json
│
├── server/
│   ├── src/
│   │   ├── app.js
│   │   ├── lambda.js
│   │   ├── server.js
│   │   ├── config/
│   │   │   ├── env.js
│   │   │   ├── ssm.js
│   │   │   └── db.js
│   │   ├── db/
│   │   │   └── dynamodb.js
│   │   ├── controllers/
│   │   ├── services/
│   │   ├── routes/
│   │   ├── middleware/
│   │   └── utils/
│   ├── Dockerfile
│   ├── .dockerignore
│   └── package.json
│
├── .github/
│   └── workflows/
│       ├── deploy-frontend.yml
│       └── deploy-backend-container.yml
│
├── docs/
│   ├── Diagram/
│   └── images/
│
└── README.md
```

---

## GitHub Actions CI/CD Workflows

| Workflow | Trigger | Deployment |
|---|---|---|
| `deploy-frontend.yml` | `client/**` | Build React, upload to S3, invalidate CloudFront |
| `deploy-backend-container.yml` | `server/**` | Build Docker image, push to ECR, update Lambda image URI |

This keeps deployments efficient because frontend-only changes do not redeploy the backend, and backend-only changes do not rebuild the frontend.

---

## Screenshots

### Login & Register Pages

![Login Page](./docs/images/ds-login-page.png)
![Register Page](./docs/images/ds-register-page.png)

### Home Page

![Home Page](./docs/images/ds-home-page.png)

### Products Page & Admin Dashboard

![Products Page](./docs/images/ds-admin-page.png)

### Product Details Page

![Product Details Page](./docs/images/ds-view-page.png)

### Cart Page

![Cart Page](./docs/images/ds-cart-page.png)

### Checkout / Order Page

![Checkout Order Page](./docs/images/ds-checkout-page.png)

### Route 53 Domain

![Route 53 Domain](./docs/images/container-route53.png)

### ACM Certificate

![ACM Certificate](./docs/images/serverless-acm.png)

### CloudFront Distribution

![CloudFront Distribution](./docs/images/container-cloudfront-1.png)

### CloudFront Behaviors

![CloudFront Behaviors](./docs/images/container-cloudfront-3.png)

### CloudFront Origins

![CloudFront Origins](./docs/images/container-cloudfront-2.png)

### CloudFront Error Pages

![CloudFront Error Pages](./docs/images/cloudfront-4.png)

### CloudFront Invalidations

![CloudFront Invalidations](./docs/images/cloudfront-5.png)

### S3 Private Bucket

![S3 Private Bucket](./docs/images/containerized-serverless-frontend-rifkhan.png)

### S3 CloudFront OAC Permission

![S3 CloudFront Permission](./docs/images/container-oac.png)
![S3 CloudFront Permission](./docs/images/ds-cloudfront-permission.png)

### API Gateway HTTP API

![API Gateway HTTP API](./docs/images/containerized-serverless-http-api.png)

### Lambda Container Function

![Lambda Container Function](./docs/images/containerized-serverless-backend-1.png)

### Lambda Image Configuration

![Lambda Container Function](./docs/images/containerized-serverless-backend-config.png)

### Lambda Environment Variables

![Lambda Environment Variables](./docs/images/ds-lambda-env-var.png)

### Lambda IAM Role & Permissions

![Lambda IAM Role](./docs/images/containerized-serverless-LambdaExecution-role.png)

### Amazon ECR Repository

![Amazon ECR Images](./docs/images/ds-ecr-repo.png)

### Amazon ECR Images

![Amazon ECR Repository](./docs/images/ds-image.png)

### DynamoDB Table & Data

![DynamoDB Table](./docs/images/serverless-dynamodb-datas.png)

### DynamoDB Indexes

![DynamoDB Indexes](./docs/images/ds-dynamodb-index.png)

### SSM Parameter Store

![SSM Parameter Store](./docs/images/serverless-ssm.png)

### IAM GitHub Actions Role

![IAM GitHub Actions Role](./docs/images/ds-githubaction-role.png)
![IAM GitHub Actions Role](./docs/images/ds-containerized-serverless-GitHubActionsDeployRole-policy.png)

### IAM Identity Provider

![IAM OIDC Provider](./docs/images/serverless-oidc.png)

### GitHub CI/CD Actions Frontend Success

![GitHub Actions Frontend Success](./docs/images/ds-frontend-cicd.png)
![GitHub Actions Frontend Success](./docs/images/ds-frontend-cicd-1.png)
![GitHub Actions Frontend Success](./docs/images/ds-frontend-cicd-2.png)

### GitHub Actions Backend Success

![GitHub Actions Backend Success](./docs/images/ds-backend-cicd.png)
![GitHub Actions Backend Details](./docs/images/ds-backend-cicd-1.png)
![GitHub Actions Backend Details](./docs/images/ds-backend-cicd-2.png)
![GitHub Actions Backend Details](./docs/images/ds-backend-cicd-3.png)

---

## Problems Solved

### 1. Frontend calling localhost in production

Problem:

```text
POST http://localhost:5000/api/auth/register net::ERR_CONNECTION_REFUSED
```

Reason:

The production frontend bundle was built with the local API URL.

Solution:

```env
VITE_API_BASE_URL=/api
```

CloudFront routes `/api/*` to API Gateway, so the browser uses the same domain for frontend and backend.

---

### 2. Moving from Lambda ZIP to Lambda container image

Problem:

The previous backend deployment used a ZIP file, but the goal was to demonstrate Docker and ECR in a serverless backend.

Solution:

The backend was packaged as a Docker image using the AWS Lambda Node.js base image, pushed to Amazon ECR, and deployed to Lambda as a container image.

---

### 3. Securing private S3 frontend hosting

Problem:

The frontend should not be served from a public S3 bucket.

Solution:

The S3 bucket was kept private, and CloudFront Origin Access Control was used to allow only CloudFront to read objects from S3.

---

### 4. Routing frontend and backend through one domain

Problem:

The frontend and API should work under one secure domain.

Solution:

CloudFront was configured with two behaviors:

```text
Default (*)  → Private S3 frontend
/api/*       → API Gateway backend
```

---

### 5. Securing CI/CD without IAM access keys

Problem:

Storing AWS access keys in GitHub is not ideal for production-style CI/CD.

Solution:

GitHub Actions uses OIDC to assume an AWS IAM role with short-lived credentials.

---

## What This Project Demonstrates

This project proves hands-on experience with:

- Full-stack application deployment on AWS
- Serverless backend modernization
- Express.js running on AWS Lambda
- Lambda container image deployment
- Docker-based backend packaging
- Amazon ECR image registry
- API Gateway HTTP API integration
- DynamoDB single-table design
- S3 private frontend hosting
- CloudFront CDN and `/api/*` routing
- Route 53 custom domain and ACM SSL
- Secure secrets management with SSM Parameter Store
- IAM least-privilege permissions
- GitHub Actions OIDC CI/CD
- Production-style cloud architecture documentation

---

## Future Improvements

- Add DynamoDB `TransactWriteItems` for stronger checkout consistency
- Add Terraform or CloudFormation infrastructure automation
- Add CloudWatch alarms and dashboards
- Add Lambda aliases and deployment versions
- Add blue/green Lambda deployments
- Add S3 pre-signed URL product image uploads
- Add payment gateway integration
- Add admin analytics dashboard
- Add automated API tests in GitHub Actions
- Add WAF protection for CloudFront
- Add Lambda image vulnerability scanning workflow
- Add ECR lifecycle policy for old image cleanup

---

## Summary

This project demonstrates the ability to design, build, migrate, secure, and deploy a real-world serverless e-commerce application on AWS using modern cloud-native and DevOps practices.

The most important production concept implemented in this project is:

```text
The browser uses one secure public domain.
CloudFront serves the React frontend from private S3.
CloudFront routes /api/* requests to API Gateway.
API Gateway invokes Lambda.
Lambda runs a Docker container image from Amazon ECR.
Lambda accesses DynamoDB and SSM using IAM roles.
GitHub Actions deploys through OIDC without static AWS keys.
```

---

## Author

**Mohammed Rifkhan**

AWS Certified Solutions Architect Associate  
Fullstack Developer | Cloud & DevOps

- GitHub: [Rifkhan-SAA-DevOps](https://github.com/Rifkhan-SAA-DevOps)
- LinkedIn: [mohrifkhan](https://www.linkedin.com/in/mohrifkhan)
- Portfolio: [Portfolio](https://portfolio.rifkhan.xyz/)

