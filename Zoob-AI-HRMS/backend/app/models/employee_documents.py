from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.database import Base


class EmployeeDocument(Base):
    __tablename__ = "employee_documents"

    id = Column(Integer, primary_key=True, index=True)
    employee_id = Column(Integer, ForeignKey("employees.id"), nullable=False)
    identity_id = Column(Integer, ForeignKey("identity.id"), nullable=False)
    document_name = Column(String(200), nullable=False)
    document_type = Column(String(100))
    file_path = Column(String(500))
    uploaded_at = Column(DateTime(timezone=True), server_default=func.now())

    employee = relationship("Employee", backref="documents")
    identity = relationship("User", backref="documents")
