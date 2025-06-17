Overview
This project demonstrates how to structure an e-commerce backend using independent microservices. Each service is responsible for a core business domain, communicating via RESTful APIs. The architecture is designed for scalability and ease of maintenance, making it suitable for learning, experimentation, or as a starting point for production systems.

Architecture
Microservices-based: Each core domain (users, products, orders) is a separate service.

Independent Deployment: Services can be developed, tested, and deployed independently.

RESTful APIs: Communication between services is via HTTP APIs.

Extensible: New services (e.g., payment, inventory, reviews) can be added as needed.

Microservices
user-service: Handles user registration, authentication, and profile management.

product_catalog-service: Manages product listings, details, and inventory.

order-service: Processes customer orders and order history.
