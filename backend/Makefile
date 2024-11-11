include .env

VERSION := $(shell date +%Y%m%d%H%M%S)


install:
	pip install -r requirements.txt

api-run:
	uvicorn app.main:app --reload

db-run:
	docker-compose up -d

db-current:
	cd app/database/ && alembic current

db-migrate:
	cd app/database/ && alembic upgrade heads

db-downgrade:
	cd app/database/ && alembic downgrade -1

db-revise:
	cd app/database/ && alembic revision --rev-id $(VERSION) --autogenerate -m "migration"
