from fastapi import FastAPI
from routers import scan

app = FastAPI()

app.include_router(scan.router)

@app.get("/")
def root():
    return {"message": "TracEra Backend Running 🚀"}