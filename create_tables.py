# create_tables.py
from database import Base, engine
from models import User

# Create all tables
Base.metadata.create_all(bind=engine)

print("✅ Tables created successfully")
