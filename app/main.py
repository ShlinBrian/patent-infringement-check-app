from fastapi import FastAPI, Request, Depends, Response
from fastapi.middleware.cors import CORSMiddleware
from app.endpoints.check_api import router
from loguru import logger
import traceback

app = FastAPI()

origins = [
    "http://localhost",
    "http://localhost:8080",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Logs incoming request information
async def log_request(request: Request):
    logger.info(
        f"""
            [{request.client.host}:{request.client.port}] {request.method} {request.url}\n
            header: {request.headers}\n
            body: {await request.body()}
        """
    )


# add middleware to log requests and response
@app.middleware("http")
async def log_response(request: Request, call_next):
    try:
        response = await call_next(request)
    except Exception as error:
        logger.error("An error occurred:\n{}", traceback.format_exc())

        return Response("Internal server error", status_code=500)

    body = b""
    async for chunk in response.body_iterator:
        body += chunk

    logger.info(f"{response.status_code} {body}")

    return Response(
        content=body,
        status_code=response.status_code,
        headers=dict(response.headers),
        media_type=response.media_type,
    )


@app.get("/")
def home():
    return {"message": "Welcome to the Patent Infringement Checker API"}


# Include the router from the endpoints module
app.include_router(router, dependencies=[Depends(log_request)])
