from sqlalchemy import Column, Integer, String, Date, DateTime, ForeignKey
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.database import Base


class Employee(Base):
    __tablename__ = "employees"

    id = Column(Integer, primary_key=True, index=True)
    identity_id = Column(Integer, ForeignKey("identity.id"), nullable=False)
    employee_id = Column(String(50), unique=True, index=True)
    full_name = Column(String(100), nullable=False)
    date_of_joining = Column(Date)
    date_of_birth = Column(Date)
    educational_qualification = Column(String(200))
    leaving_date = Column(Date, nullable=True)
    parents_name = Column(String(100))
    email = Column(String(100), unique=True, index=True)
    phone = Column(String(20))
    department = Column(String(100))
    designation = Column(String(100))
    salary = Column(Integer)
    address = Column(String(500))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    identity = relationship("User", backref="employee")