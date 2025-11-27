# Catered By Me

Backend API for a cooking "day-of execution" planner that:
- accepts recipes
- normalizes ingredients
- scales to a headcount
- converts steps to tasks
- generates a time-based schedule by working backwards from a desired serve time

## Getting Started

### Prerequisites

- Python 3.11+

### Installation

```bash
pip install -r requirements.txt
```

### Running the Development Server

```bash
uvicorn apps.api.main:app --reload
```

The API will be available at `http://localhost:8000` by default.

### API Documentation

Once the server is running, visit:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

