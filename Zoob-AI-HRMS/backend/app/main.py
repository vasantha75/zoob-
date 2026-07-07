from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy import inspect
from datetime import date, datetime
import bcrypt
import secrets

from app.database import engine, Base, get_db
from app.models.user import User
from app.models.employee import Employee
from app.models.attendance import Attendance
from app.models.leave import Leave
from app.models.employee_documents import EmployeeDocument

from app.auth import create_access_token
from app.core.deps import verify_token, verify_admin, verify_hr, verify_manager

from app.schemas import (
    UserCreate,
    UserLogin,
    UserRoleUpdate,
    EmployeeCreate,
    EmployeeUpdate,
    EmployeeDocumentCreate,
    AttendanceCheckIn,
    AttendanceCheckOut,
    LeaveApply
)

app = FastAPI()

# ==========================
# CORS FIX (IMPORTANT)
# ==========================
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000", "http://localhost:3001", "http://127.0.0.1:3001"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

Base.metadata.create_all(bind=engine)

# ==========================
# HOME
# ==========================
@app.get("/")
def home():
    return {"message": "Zoob HRMS API is running"}

# ==========================
# REGISTER
# ==========================
@app.post("/register")
def register(user: UserCreate, db: Session = Depends(get_db)):
    if db.query(User).filter(User.email == user.email).first():
        raise HTTPException(status_code=400, detail="Email already registered")
    
    if db.query(User).filter(User.phone == user.phone).first():
        raise HTTPException(status_code=400, detail="Phone already registered")

    hashed = bcrypt.hashpw(user.password.encode(), bcrypt.gensalt())

    new_user = User(
        full_name=user.full_name,
        email=user.email,
        phone=user.phone,
        password=hashed.decode(),
        role=user.role
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    if new_user.role == "employee":
        new_emp = Employee(
            identity_id=new_user.id,
            full_name=new_user.full_name,
            email=new_user.email,
            phone=new_user.phone,
            department="Unassigned",
            designation="Employee",
            date_of_joining=date.today(),
            salary=0
        )
        db.add(new_emp)
        db.commit()

    return {"message": "User registered", "user_id": new_user.id, "role": new_user.role}

# ==========================
# LOGIN
# ==========================
@app.post("/login")
def login(user: UserLogin, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.email == user.email).first()

    if not db_user:
        raise HTTPException(status_code=400, detail="Invalid credentials")

    if not bcrypt.checkpw(user.password.encode(), db_user.password.encode()):
        raise HTTPException(status_code=400, detail="Invalid credentials")

    token = create_access_token({
        "user_id": db_user.id,
        "email": db_user.email,
        "role": db_user.role
    })

    return {
        "access_token": token,
        "token_type": "bearer"
    }

# ==========================
# USERS (Admin Only)
# ==========================
@app.get("/users")
def get_users(admin=Depends(verify_admin), db: Session = Depends(get_db)):
    users = db.query(User).all()
    return [{"id": u.id, "full_name": u.full_name, "email": u.email, "phone": u.phone, "role": u.role} for u in users]

@app.post("/users")
def create_system_user(user: UserCreate, admin=Depends(verify_admin), db: Session = Depends(get_db)):
    if db.query(User).filter(User.email == user.email).first():
        raise HTTPException(status_code=400, detail="Email already registered")
    
    hashed = bcrypt.hashpw(user.password.encode(), bcrypt.gensalt()).decode()
    new_user = User(
        full_name=user.full_name,
        email=user.email,
        phone=user.phone,
        password=hashed,
        role=user.role
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return {"message": "User created", "user": {"id": new_user.id, "email": new_user.email, "role": new_user.role}}

@app.put("/users/{user_id}/role")
def update_user_role(user_id: int, role_update: UserRoleUpdate, admin=Depends(verify_admin), db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.id == user_id).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    
    db_user.role = role_update.role
    db.commit()
    db.refresh(db_user)
    return {"message": "Role updated", "user_id": db_user.id, "role": db_user.role}

@app.delete("/users/{user_id}")
def delete_system_user(user_id: int, admin=Depends(verify_admin), db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.id == user_id).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    
    db.delete(db_user)
    db.commit()
    return {"message": "User deleted successfully"}

# ==========================
# ADMIN DASHBOARD
# ==========================
@app.get("/admin/dashboard")
def admin_dashboard(admin=Depends(verify_admin), db: Session = Depends(get_db)):
    total_employees = db.query(Employee).count()

    present_today = db.query(Attendance).filter(
        Attendance.attendance_date == date.today(),
        Attendance.status == "Present"
    ).count()

    pending_leaves = db.query(Leave).filter(
        Leave.status == "Pending"
    ).count()

    payroll_amount = db.query(Employee.salary).all()
    total_payroll = sum(s[0] for s in payroll_amount)

    return {
        "message": "Welcome Admin",
        "dashboard": {
            "total_employees": total_employees,
            "present_today": present_today,
            "pending_leaves": pending_leaves,
            "total_payroll": total_payroll
        }
    }

# ==========================
# EMPLOYEES
# ==========================
@app.get("/employees/me")
def get_my_employee_profile(user=Depends(verify_token), db: Session = Depends(get_db)):
    inspector = inspect(db.bind)
    if "employees" not in inspector.get_table_names():
        raise HTTPException(status_code=404, detail="Employee profile not found")

    employee = db.query(Employee).filter(Employee.email == user["email"]).first()
    if not employee:
        raise HTTPException(status_code=404, detail="Employee profile not found")
    return employee

def _prepare_identity_for_employee(db: Session, full_name: str, email: str, phone: str, identity_id: int | None = None):
    temp_password = f"Zoob@{secrets.token_hex(3).upper()}"
    hashed = bcrypt.hashpw(temp_password.encode(), bcrypt.gensalt()).decode()

    if identity_id:
        identity = db.query(User).filter(User.id == identity_id).first()
        if not identity:
            raise HTTPException(status_code=404, detail="Identity not found")
        identity.password = hashed
        identity.full_name = full_name or identity.full_name
        identity.email = email or identity.email
        identity.phone = phone or identity.phone
        identity.role = "employee"
        db.add(identity)
        db.commit()
        db.refresh(identity)
        return identity, temp_password

    existing_identity = db.query(User).filter(User.email == email).first()
    if existing_identity:
        existing_identity.password = hashed
        existing_identity.full_name = full_name or existing_identity.full_name
        existing_identity.phone = phone or existing_identity.phone
        existing_identity.role = "employee"
        db.add(existing_identity)
        db.commit()
        db.refresh(existing_identity)
        return existing_identity, temp_password

    identity = User(
        full_name=full_name,
        email=email,
        phone=phone,
        password=hashed,
        role="employee",
    )
    db.add(identity)
    db.commit()
    db.refresh(identity)
    return identity, temp_password


@app.post("/employees")
def create_employee(emp: EmployeeCreate, admin=Depends(verify_hr), db: Session = Depends(get_db)):
    inspector = inspect(db.bind)
    if "employees" not in inspector.get_table_names():
        raise HTTPException(status_code=500, detail="Employee table is not available")

    identity, temp_password = _prepare_identity_for_employee(
        db,
        emp.full_name,
        emp.email,
        emp.phone,
        emp.identity_id,
    )

    payload = emp.dict(exclude={"identity_id"})
    obj = Employee(identity_id=identity.id, **payload)
    db.add(obj)
    db.commit()
    db.refresh(obj)

    return {
        "employee": obj,
        "temporary_password": temp_password,
        "login_email": identity.email,
    }

@app.get("/employees")
def get_employees(admin=Depends(verify_manager), db: Session = Depends(get_db)):
    inspector = inspect(db.bind)
    if "employees" not in inspector.get_table_names():
        return []

    columns = {column["name"] for column in inspector.get_columns("employees")}
    if "identity_id" not in columns:
        return []

    return db.query(Employee).all()

@app.get("/employees/{employee_id}")
def get_employee(employee_id: int, admin=Depends(verify_manager), db: Session = Depends(get_db)):
    emp = db.query(Employee).filter(Employee.id == employee_id).first()
    if not emp:
        raise HTTPException(status_code=404, detail="Employee not found")
    return emp

@app.put("/employees/{employee_id}")
def update_employee(employee_id: int, emp: EmployeeUpdate, user=Depends(verify_token), db: Session = Depends(get_db)):
    db_emp = db.query(Employee).filter(Employee.id == employee_id).first()
    if not db_emp:
        raise HTTPException(status_code=404, detail="Employee not found")

    if user.get("role") not in ["admin", "hr"] and db_emp.email != user.get("email"):
        raise HTTPException(status_code=403, detail="Not authorized to update this employee")

    for key, value in emp.dict(exclude_unset=True).items():
        setattr(db_emp, key, value)

    db.commit()
    db.refresh(db_emp)
    return db_emp

@app.delete("/employees/{employee_id}")
def delete_employee(employee_id: int, admin=Depends(verify_hr), db: Session = Depends(get_db)):
    db_emp = db.query(Employee).filter(Employee.id == employee_id).first()
    if not db_emp:
        raise HTTPException(status_code=404, detail="Employee not found")

    db.delete(db_emp)
    db.commit()
    return {"message": "Employee deleted successfully"}

# ==========================
# EMPLOYEE DOCUMENTS
# ==========================
@app.post("/employee-documents")
def create_document(doc: EmployeeDocumentCreate, admin=Depends(verify_hr), db: Session = Depends(get_db)):
    # Verify employee exists
    employee = db.query(Employee).filter(Employee.id == doc.employee_id).first()
    if not employee:
        raise HTTPException(status_code=404, detail="Employee not found")
    
    # Verify identity exists
    identity = db.query(User).filter(User.id == doc.identity_id).first()
    if not identity:
        raise HTTPException(status_code=404, detail="Identity not found")
    
    obj = EmployeeDocument(**doc.dict())
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj

@app.get("/employee-documents/{employee_id}")
def get_employee_documents(employee_id: int, user=Depends(verify_token), db: Session = Depends(get_db)):
    employee = db.query(Employee).filter(Employee.id == employee_id).first()
    if not employee:
        raise HTTPException(status_code=404, detail="Employee not found")

    if user.get("role") not in ["admin", "hr"] and employee.email != user.get("email"):
        raise HTTPException(status_code=403, detail="Access denied")

    documents = db.query(EmployeeDocument).filter(EmployeeDocument.employee_id == employee_id).all()
    return documents

@app.delete("/employee-documents/{document_id}")
def delete_document(document_id: int, admin=Depends(verify_hr), db: Session = Depends(get_db)):
    doc = db.query(EmployeeDocument).filter(EmployeeDocument.id == document_id).first()
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")
    
    db.delete(doc)
    db.commit()
    return {"message": "Document deleted successfully"}

# ==========================
# ATTENDANCE
# ==========================
@app.get("/attendance")
def get_all_attendance(admin=Depends(verify_manager), db: Session = Depends(get_db)):
    attendances = db.query(Attendance).all()
    employees = db.query(Employee).all()
    emp_name_map = {e.id: e.full_name for e in employees}
    emp_email_map = {e.id: e.email for e in employees}
    result = []
    for a in attendances:
        result.append({
            "id": a.id,
            "employee_id": a.employee_id,
            "employee_name": emp_name_map.get(a.employee_id, "Unknown"),
            "employee_email": emp_email_map.get(a.employee_id, "Unknown"),
            "attendance_date": a.attendance_date,
            "check_in": a.check_in,
            "check_out": a.check_out,
            "status": a.status
        })
    return result

@app.get("/my/attendance")
def get_my_attendance(user=Depends(verify_token), db: Session = Depends(get_db)):
    employee = db.query(Employee).filter(Employee.email == user["email"]).first()
    if not employee: return []
    return db.query(Attendance).filter(Attendance.employee_id == employee.id).all()

@app.post("/attendance/checkin")
def checkin(user=Depends(verify_token), db: Session = Depends(get_db)):
    employee = db.query(Employee).filter(Employee.email == user["email"]).first()
    if not employee:
        raise HTTPException(status_code=404, detail="Employee not found")

    record = Attendance(
        employee_id=employee.id,
        attendance_date=date.today(),
        check_in=datetime.now(),
        status="Present"
    )

    db.add(record)
    db.commit()
    db.refresh(record)
    return record

@app.post("/attendance/checkout")
def checkout(user=Depends(verify_token), db: Session = Depends(get_db)):
    employee = db.query(Employee).filter(Employee.email == user["email"]).first()
    if not employee:
        raise HTTPException(status_code=404, detail="Employee not found")

    record = db.query(Attendance).filter(
        Attendance.employee_id == employee.id,
        Attendance.attendance_date == date.today()
    ).first()

    if not record:
        raise HTTPException(status_code=404, detail="Not checked in today")

    record.check_out = datetime.now()
    db.commit()
    db.refresh(record)
    return record

@app.put("/attendance/{attendance_id}")
def update_attendance(attendance_id: int, attendance_data: dict, admin=Depends(verify_hr), db: Session = Depends(get_db)):
    record = db.query(Attendance).filter(Attendance.id == attendance_id).first()
    if not record:
        raise HTTPException(status_code=404, detail="Attendance record not found")

    if "check_in" in attendance_data:
        record.check_in = attendance_data["check_in"]
    if "check_out" in attendance_data:
        record.check_out = attendance_data["check_out"] if attendance_data["check_out"] else None
    if "status" in attendance_data:
        record.status = attendance_data["status"]

    db.commit()
    db.refresh(record)
    return record

# ==========================
# LEAVE
# ==========================
@app.post("/leave/apply")
def apply_leave(leave: LeaveApply, admin=Depends(verify_token), db: Session = Depends(get_db)):
    obj = Leave(
        employee_id=leave.employee_id,
        leave_type=leave.leave_type,
        start_date=leave.start_date,
        end_date=leave.end_date,
        reason=leave.reason,
        status="Pending",
        applied_on=datetime.now()
    )

    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj

@app.get("/leave")
def get_leaves(admin=Depends(verify_manager), db: Session = Depends(get_db)):
    leaves = db.query(Leave).all()
    employees = db.query(Employee).all()
    emp_email_map = {e.id: e.email for e in employees}
    emp_name_map = {e.id: e.full_name for e in employees}
    result = []
    for l in leaves:
        result.append({
            "id": l.id,
            "employee_id": l.employee_id,
            "employee_email": emp_email_map.get(l.employee_id, "Unknown"),
            "employee_name": emp_name_map.get(l.employee_id, "Unknown"),
            "leave_type": l.leave_type,
            "start_date": l.start_date,
            "end_date": l.end_date,
            "reason": l.reason,
            "status": l.status,
            "applied_on": l.applied_on
        })
    return result

@app.get("/my/leave")
def my_leaves(user=Depends(verify_token), db: Session = Depends(get_db)):
    employee = db.query(Employee).filter(Employee.email == user["email"]).first()
    if not employee: return []
    return db.query(Leave).filter(Leave.employee_id == employee.id).all()

@app.put("/leave/{leave_id}/approve")
def approve_leave(leave_id: int, admin=Depends(verify_manager), db: Session = Depends(get_db)):
    leave = db.query(Leave).filter(Leave.id == leave_id).first()
    if not leave:
        raise HTTPException(status_code=404, detail="Leave not found")

    leave.status = "Approved"
    db.commit()
    db.refresh(leave)
    return leave

@app.put("/leave/{leave_id}/reject")
def reject_leave(leave_id: int, admin=Depends(verify_manager), db: Session = Depends(get_db)):
    leave = db.query(Leave).filter(Leave.id == leave_id).first()
    if not leave:
        raise HTTPException(status_code=404, detail="Leave not found")

    leave.status = "Rejected"
    db.commit()
    db.refresh(leave)
    return leave

# ==========================
# PAYROLL
# ==========================
@app.get("/payroll/all")
def get_all_payroll(admin=Depends(verify_hr), db: Session = Depends(get_db)):
    employees = db.query(Employee).all()
    result = []
    for employee in employees:
        attendance_count = db.query(Attendance).filter(
            Attendance.employee_id == employee.id,
            Attendance.status == "Present"
        ).count()
        leave_count = db.query(Leave).filter(
            Leave.employee_id == employee.id,
            Leave.status == "Approved"
        ).count()
        per_day = employee.salary / 30 if employee.salary else 0
        deduction = leave_count * per_day
        final_salary = (attendance_count * per_day) - deduction
        result.append({
            "employee_id": employee.id,
            "employee_name": employee.full_name,
            "salary": employee.salary,
            "attendance_days": attendance_count,
            "approved_leaves": leave_count,
            "deduction": deduction,
            "final_salary": final_salary
        })
    return result

@app.get("/my/payroll")
def my_payroll(user=Depends(verify_token), db: Session = Depends(get_db)):

    employee = db.query(Employee).filter(Employee.email == user["email"]).first()

    if not employee:
        raise HTTPException(status_code=404, detail="Employee not found")

    attendance_count = db.query(Attendance).filter(
        Attendance.employee_id == employee.id,
        Attendance.status == "Present"
    ).count()

    leave_count = db.query(Leave).filter(
        Leave.employee_id == employee.id,
        Leave.status == "Approved"
    ).count()

    per_day = employee.salary / 30

    deduction = leave_count * per_day
    final_salary = (attendance_count * per_day) - deduction

    return {
        "employee_id": employee.id,
        "employee_name": employee.full_name,
        "salary": employee.salary,
        "attendance_days": attendance_count,
        "approved_leaves": leave_count,
        "deduction": deduction,
        "final_salary": final_salary
    }

# ==========================
# PROFILE
# ==========================
@app.get("/me")
def me(user=Depends(verify_token), db: Session = Depends(get_db)):
    return db.query(User).filter(User.id == user["user_id"]).first()