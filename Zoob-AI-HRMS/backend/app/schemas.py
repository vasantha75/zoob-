from datetime import date, datetime
from typing import Optional
from pydantic import BaseModel, field_validator


# ==========================
# USER SCHEMAS
# ==========================
class UserCreate(BaseModel):
    full_name: str
    email: str
    phone: str
    password: str
    role: str = "employee"


class UserLogin(BaseModel):
    email: str
    password: str

class UserRoleUpdate(BaseModel):
    role: str


# ==========================
# EMPLOYEE SCHEMAS
# ==========================
class EmployeeCreate(BaseModel):
    identity_id: Optional[int] = None
    employee_id: str
    full_name: str
    date_of_joining: date
    date_of_birth: date
    educational_qualification: str
    parents_name: str
    email: str
    phone: str
    department: str
    designation: str
    salary: int
    address: str
    leaving_date: Optional[date] = None

    @field_validator("leaving_date", mode="before")
    @classmethod
    def validate_optional_date(cls, value):
        if value in (None, "", "null", "None"):
            return None
        return value


class EmployeeUpdate(BaseModel):
    full_name: str
    date_of_joining: date
    date_of_birth: date
    educational_qualification: str
    parents_name: str
    email: str
    phone: str
    department: str
    designation: str
    salary: int
    address: str
    leaving_date: Optional[date] = None

    @field_validator("leaving_date", mode="before")
    @classmethod
    def validate_optional_date(cls, value):
        if value in (None, "", "null", "None"):
            return None
        return value


class EmployeeResponse(BaseModel):
    id: int
    identity_id: int
    employee_id: str
    full_name: str
    date_of_joining: date
    date_of_birth: date
    educational_qualification: str
    parents_name: str
    email: str
    phone: str
    department: str
    designation: str
    salary: int
    address: str
    leaving_date: date | None = None

    class Config:
        from_attributes = True


# ==========================
# EMPLOYEE DOCUMENT SCHEMAS
# ==========================
class EmployeeDocumentCreate(BaseModel):
    employee_id: int
    identity_id: int
    document_name: str
    document_type: str
    file_path: str


class EmployeeDocumentResponse(BaseModel):
    id: int
    employee_id: int
    identity_id: int
    document_name: str
    document_type: str
    file_path: str
    uploaded_at: datetime

    class Config:
        from_attributes = True


# ==========================
# ATTENDANCE SCHEMAS
# ==========================
class AttendanceCheckIn(BaseModel):
    employee_id: int


class AttendanceCheckOut(BaseModel):
    employee_id: int


class AttendanceResponse(BaseModel):
    id: int
    employee_id: int
    attendance_date: date
    check_in: datetime | None = None
    check_out: datetime | None = None
    status: str

    class Config:
        from_attributes = True
# ==========================
# LEAVE SCHEMAS
# ==========================
from datetime import date, datetime


class LeaveApply(BaseModel):
    employee_id: int
    leave_type: str
    start_date: date
    end_date: date
    reason: str


class LeaveResponse(BaseModel):
    id: int
    employee_id: int
    leave_type: str
    start_date: date
    end_date: date
    reason: str | None = None
    status: str
    applied_on: datetime | None = None

    class Config:
        from_attributes = True
# ==========================
# LEAVE SCHEMAS
# ==========================
from datetime import date, datetime


class LeaveApply(BaseModel):
    employee_id: int
    leave_type: str
    start_date: date
    end_date: date
    reason: str


class LeaveResponse(BaseModel):
    id: int
    employee_id: int
    leave_type: str
    start_date: date
    end_date: date
    reason: str | None = None
    status: str
    applied_on: datetime | None = None

    class Config:
        from_attributes = True