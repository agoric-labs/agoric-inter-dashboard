FROM python:3.11-buster

WORKDIR /app

RUN pip install poetry

COPY pyproject.toml poetry.lock ./

RUN poetry install

COPY . .

CMD ["poetry", "run", "python", "main.py"]
