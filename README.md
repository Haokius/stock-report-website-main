## Setup

### System environment

- install dependencies
  - poetry
  - node v20
  - npm
  - npx

### Frontend environment

```bash
cd shadcn-starter-copy
# Make sure you're using node v20, eg:
# $ nvm use 20
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Backend environment

- Assuming a UNIX shell environment.
- Make sure to [install poetry](https://python-poetry.org/docs/)

```bash
cd backend/backend
poetry install
poetry shell
uvicorn main:app --reload
```

The backend should now be running on port 8000. You can go to [http://localhost:8000/docs](http://localhost:8000/docs) to see the API documentation.
