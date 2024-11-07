from fastapi import FastAPI, Request, Depends, Response
from app.endpoints.check_api import router
from loguru import logger


app = FastAPI()


# Logs incoming request information
async def log_request(request: Request):
    logger.info(
        f"""
            [{request.client.host}:{request.client.port}] {request.method} {request.url}\n
            header: {request.headers}\n
            body: {await request.json()}\n
        """
    )


# add middleware to log requests and response
@app.middleware("http")
async def log_requests(request, call_next):
    response = await call_next(request)
    try:
        response = await call_next(request)
    except Exception as e:
        logger.exception("An error occurred while processing the request")
        raise e
    body = b""
    async for chunk in response.body_iterator:
        body += chunk

    logger.info(f"{response.status_code} {body.decode()}")

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
