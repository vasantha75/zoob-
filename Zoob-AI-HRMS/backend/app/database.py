from sqlalchemy import create_engine, inspect, text
from sqlalchemy.orm import sessionmaker, declarative_base
from dotenv import load_dotenv
import os

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./hrms.db")

engine_kwargs = {}
if DATABASE_URL.startswith("sqlite"):
    engine_kwargs["connect_args"] = {"check_same_thread": False}

engine = create_engine(DATABASE_URL, **engine_kwargs)

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

Base = declarative_base()


def ensure_employee_schema():
    inspector = inspect(engine)
    if "employees" not in inspector.get_table_names():
        Base.metadata.create_all(bind=engine)
        return

    columns = {column["name"] for column in inspector.get_columns("employees")}

    with engine.begin() as conn:
        if "identity_id" not in columns:
            conn.execute(text("ALTER TABLE employees ADD COLUMN identity_id INTEGER"))
        if "date_of_joining" not in columns:
            conn.execute(text("ALTER TABLE employees ADD COLUMN date_of_joining DATE"))
        if "date_of_birth" not in columns:
            conn.execute(text("ALTER TABLE employees ADD COLUMN date_of_birth DATE"))
        if "educational_qualification" not in columns:
            conn.execute(text("ALTER TABLE employees ADD COLUMN educational_qualification VARCHAR(200)"))
        if "leaving_date" not in columns:
            conn.execute(text("ALTER TABLE employees ADD COLUMN leaving_date DATE"))
        if "parents_name" not in columns:
            conn.execute(text("ALTER TABLE employees ADD COLUMN parents_name VARCHAR(100)"))
        if "created_at" not in columns:
            conn.execute(text("ALTER TABLE employees ADD COLUMN created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP"))
        if "updated_at" not in columns:
            conn.execute(text("ALTER TABLE employees ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE"))


ensure_employee_schema()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()