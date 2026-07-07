import random
from datetime import date, timedelta, datetime
import bcrypt
from app.database import SessionLocal
from app.models.user import User
from app.models.employee import Employee
from app.models.leave import Leave
from app.models.attendance import Attendance

db = SessionLocal()

def seed():
    # 1. Add some dummy users & employees
    dummy_data = [
        {"name": "Alice Johnson", "email": "alice@zoob.ai", "dept": "Engineering", "pos": "Frontend Developer"},
        {"name": "Bob Smith", "email": "bob@zoob.ai", "dept": "Marketing", "pos": "SEO Specialist"},
        {"name": "Charlie Brown", "email": "charlie@zoob.ai", "dept": "Sales", "pos": "Account Executive"}
    ]
    
    hashed_pw = bcrypt.hashpw("password123".encode(), bcrypt.gensalt()).decode()
    
    added_employees = []
    
    for d in dummy_data:
        # Check if exists
        user = db.query(User).filter(User.email == d["email"]).first()
        if not user:
            user = User(
                full_name=d["name"],
                email=d["email"],
                phone=str(random.randint(1000000000, 9999999999)),
                password=hashed_pw,
                role="employee"
            )
            db.add(user)
            db.commit()
            db.refresh(user)
            
            emp = Employee(
                identity_id=user.id,
                full_name=user.full_name,
                email=user.email,
                phone=user.phone,
                department=d["dept"],
                designation=d["pos"],
                date_of_joining=date.today() - timedelta(days=random.randint(100, 1000)),
                salary=random.randint(50000, 120000)
            )
            db.add(emp)
            db.commit()
            db.refresh(emp)
            added_employees.append(emp)
        else:
            emp = db.query(Employee).filter(Employee.identity_id == user.id).first()
            if emp:
                added_employees.append(emp)
                
    # 2. Add some leave requests
    leave_types = ["Sick", "Casual", "Vacation"]
    statuses = ["Approved", "Pending", "Rejected"]
    
    for emp in added_employees:
        # Check if they have leaves
        if db.query(Leave).filter(Leave.employee_id == emp.id).count() == 0:
            for _ in range(2):
                start = date.today() + timedelta(days=random.randint(-10, 10))
                l = Leave(
                    employee_id=emp.id,
                    leave_type=random.choice(leave_types),
                    start_date=start,
                    end_date=start + timedelta(days=random.randint(1, 3)),
                    reason="Feeling unwell or family emergency",
                    status=random.choice(statuses),
                    applied_on=datetime.now() - timedelta(days=random.randint(1, 10))
                )
                db.add(l)
    
    # 3. Add some attendance
    for emp in added_employees:
        if db.query(Attendance).filter(Attendance.employee_id == emp.id).count() == 0:
            for i in range(5):
                att_date = date.today() - timedelta(days=i)
                # Skip weekends just roughly
                a = Attendance(
                    employee_id=emp.id,
                    attendance_date=att_date,
                    check_in=datetime.now().replace(hour=9, minute=0, second=0) - timedelta(days=i),
                    check_out=datetime.now().replace(hour=17, minute=0, second=0) - timedelta(days=i),
                    status="Present"
                )
                db.add(a)
                
    db.commit()
    print("Database seeded with dummy employees, leaves, and attendance!")

if __name__ == "__main__":
    seed()
