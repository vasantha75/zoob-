import bcrypt
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.models.user import User
from app.database import Base

DATABASE_URL = "sqlite:///./hrms.db"

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def create_admin_user():
    db = SessionLocal()
    
    # Check if admin already exists
    existing_admin = db.query(User).filter(User.email == "admin@zoobai.com").first()
    if existing_admin:
        print("Admin user already exists!")
        return
    
    # Create admin user
    hashed_password = bcrypt.hashpw("admin123".encode(), bcrypt.gensalt()).decode()
    
    admin_user = User(
        full_name="System Administrator",
        email="admin@zoobai.com",
        phone="+919876543210",
        password=hashed_password,
        role="admin"
    )
    
    db.add(admin_user)
    db.commit()
    db.refresh(admin_user)
    
    print(f"Admin user created successfully!")
    print(f"Email: admin@zoobai.com")
    print(f"Password: admin123")
    print(f"User ID: {admin_user.id}")
    
    db.close()

if __name__ == "__main__":
    create_admin_user()
