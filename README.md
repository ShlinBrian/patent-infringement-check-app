# patent-infringement-check-app

### Problem Statement

Patent infringement occurs when a party makes, uses, sells, or offers to sell a patented invention without permission from the patent holder. In essence, it means violating the exclusive rights granted to the patent owner, typically leading to legal disputes.

---

### Features

- Input a **patent ID** and a **company name**.
- Perform a **patent infringement check** against the specified company.
- Retrieve:
  - **Top two infringing products** of the company.
  - Explanations highlighting which claims are potentially infringed.
- Save generated results as a report and review previously saved reports.

---

### Patent Check Service

Demo Website: [Visit the Demo](https://ec2-54-243-1-217.compute-1.amazonaws.com/)

This project is a full-stack web application that consists of:

- A Frontend built with React.
- A Backend built with FastAPI.
- A PostgreSQL Database for data storage.

---

### Prerequisites

1. Install Docker and Docker Compose on your system:

   - [Docker Installation Guide](https://docs.docker.com/engine/install/)
   - [Docker Compose Installation Guide](https://docs.docker.com/compose/install/)

2. Clone this repository:

   ```bash
   git clone git@github.com:ShlinBrian/patent-infringement-check-app.git
   cd patent-infringement-check-app
   ```

3. Ensure you have the following project structure:

   ```graphql
   patent-infringement-check-app/
   ├── backend/
   ├── frontend/
   ├── .gitignore
   ├── docker-compose.yml
   ├── README.md
   └── schema.sql
   ```

4. Configure your `.env` file as referenced by `./backend/sample.env`

   - Copy the sample environment file:

     ```bash
     cp ./backend/sample.env ./backend/.env
     ```

   - Edit the `.env` file with your specific configuration:
     ```bash
     nano ./backend/.env
     ```

---

### Steps to Build and Run the Service

1.  Build and Start the Services

    ```bash
    docker compose up --build
    ```

2.  Access the Services

    - Frontend: http://localhost:3000
    - Backend: http://localhost:8000

3.  Verify Database Initialization

    1. Access the PostgreSQL container:

       ```bash
       docker exec -it patent_check_postgres bash
       ```

    2. Connect to the database:

       ```bash
       psql -U user -d patent-check
       ```

    3. Check the tables:

       ```sql
       \dt
       ```

    4. Exit PostgreSQL:
       ```sql
       \q
       ```

4.  Stopping the Services

    ```bash
    docker compose down
    ```

5.  Clearing the Database (Optional)

    - If you need to reset the database, remove the database volume:

      ```bash
      docker compose down
      docker volume rm project-folder_postgres_data
      docker compose up --build
      ```

---

### Troubleshooting

- Database Connection Issues:

  - Ensure the PostgreSQL service is running and accessible:
    ```bash
    docker compose ps
    docker exec -it patent_check_postgres bash
    ```

- Frontend or Backend Not Loading:

  - Check the logs for errors:
    ```bash
    docker compose logs frontend
    docker compose logs backend
    ```

- Resetting the Application:
  - To reset the application completely, remove all containers and volumes:
    ```bash
    docker compose down --volumes
    ```
