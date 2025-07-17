E-Commerce Microservices Backend
A scalable, modular e-commerce backend (Node.js/Express/MongoDB) using the microservices architecture. Each domain (Users, Products, Orders, etc.) is managed by an independent service; all communication occurs via REST APIs for maximum flexibility, modularity, and real-world learning.

Architecture
Microservices-based:
Each business capability (users, products, cart, orders, payments, notifications) is isolated into its own autonomous service.

RESTful APIs:
Services communicate via HTTP, allowing language- and platform-agnostic integration.

Independent Deployment:
Each service can be started, tested, or deployed on its own — ideal for CI/CD and cloud deployment.

Scalability:
Easily scale individual services based on real load.
Microservices
User Service: Handles user registration, authentication, and profile management.
Product Catalog Service: Manages product listings, categories, and inventory.
Shopping Cart Service: Manages users’ shopping carts, including adding/removing items and updating quantities.
Order Service: Processes orders, including placing orders, tracking order status, and managing order history.
Payment Service: Handles payment processing, integrating with external payment gateways (Utilized Stripe).
Notification Service: Sends email and SMS notifications for various events (Utilized NodeMailer).

Tech Stack
Node.js, Express.js

MongoDB (+ Mongoose)

Docker & Docker Compose (for development and orchestration)

Stripe, NodeMailer

Jest / Supertest (for robust automated testing)
