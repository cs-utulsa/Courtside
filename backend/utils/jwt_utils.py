from datetime import datetime, timedelta
import jwt
import os
from dotenv import load_dotenv
from db import db

load_dotenv()

def encode_auth_token(user_id):
    try:
        payload = {
            'exp': datetime.utcnow() + timedelta(minutes=5),
            'iat': datetime.utcnow(),
            'sub': user_id
        }

        return jwt.encode(
            payload,
            os.getenv("JWT_SECRET"),
            algorithm='HS256'
        )
    except Exception as e:
        return e

def decode_auth_token(token):
    try:
        payload = jwt.decode(
            token, 
            os.getenv("JWT_SECRET"),
            algorithm='HS256'
        )

        result = db.blacklisted_tokens.find_one(
            {"token": token}
        )

        if result:
            return 'Token blacklisted. Please log in again.'

        return payload['sub']
    except jwt.ExpiredSignatureError:
        return 'Signature expired. Please log in again.'
    except jwt.InvalidTokenError:
        return 'Invalid token. Please log in again.'