from fastapi import Depends, HTTPException, Request
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import jwt, JWTError

SECRET_KEY = "zoob_hrms_secret_key"
ALGORITHM = "HS256"

security = HTTPBearer()


def verify_token(
    request: Request,
    credentials: HTTPAuthorizationCredentials = Depends(security)
):
    print("Authorization Header:", request.headers.get("authorization"))
    print("Scheme:", credentials.scheme)
    print("Credentials:", credentials.credentials)

    token = credentials.credentials.strip()

    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        print("PAYLOAD:", payload)
        return payload

    except JWTError as e:
        print("JWT ERROR:", repr(e))
        raise HTTPException(
            status_code=401,
            detail="Invalid or expired token"
        )


# ==========================
# ADMIN AUTHORIZATION
# ==========================
def verify_admin(user=Depends(verify_token)):
    if user.get("role") != "admin":
        raise HTTPException(
            status_code=403,
            detail="Admin access required"
        )

    return user


# ==========================
# HR AUTHORIZATION
# ==========================
def verify_hr(user=Depends(verify_token)):
    if user.get("role") not in ["admin", "hr"]:
        raise HTTPException(
            status_code=403,
            detail="HR access required"
        )

    return user


# ==========================
# MANAGER AUTHORIZATION
# ==========================
def verify_manager(user=Depends(verify_token)):
    if user.get("role") not in ["admin", "hr", "manager"]:
        raise HTTPException(
            status_code=403,
            detail="Manager access required"
        )

    return user