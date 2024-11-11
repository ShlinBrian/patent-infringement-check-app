from fastapi import FastAPI, Request, Depends, Response
from fastapi.middleware.cors import CORSMiddleware
from app.endpoints.patent_api import router as patent_router
from app.endpoints.report_api import router as report_router
from loguru import logger
import traceback, uuid

app = FastAPI()

origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "https://localhost:3000",
    "https://127.0.0.1:3000",
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
            [{request.client.host}:{request.client.port}] {request.method} {request.url} {request.cookies}\n
            header: {request.headers}\n
            body: {await request.body()}
        """
    )


# add middleware to log requests and response
@app.middleware("http")
async def log_response(request: Request, call_next):
    try:
        response: Response = await call_next(request)
        if not request.cookies.get("session_id"):
            session_id = str(uuid.uuid4())
            response.set_cookie(
                key="session_id",
                value=session_id,
                httponly=True,
                samesite="None",  # Allow cross-origin requests
                secure=False,  # Set to True if using HTTPS
            )

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
app.include_router(patent_router, dependencies=[Depends(log_request)])
app.include_router(report_router, dependencies=[Depends(log_request)])
