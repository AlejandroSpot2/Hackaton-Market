dev-web:
	cd apps/web && npm run dev

dev-api:
	cd services/api && uvicorn app.main:app --reload --port 8000