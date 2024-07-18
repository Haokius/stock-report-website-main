from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import scoped_session, sessionmaker

from sqlalchemy import Column, Integer, String, Date, JSON

Base = declarative_base()


# TODO: define your SQLAlchemy models here
class ReportConfig(Base):
    __tablename__ = 'report_config'
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    date_start = Column(Date)
    date_end = Column(Date)
    tickers = Column(JSON)


def init_db(uri):
    engine = create_engine(uri)
    db_session = scoped_session(
        sessionmaker(autocommit=False, autoflush=False, bind=engine),
    )
    Base.query = db_session.query_property()
    Base.metadata.create_all(bind=engine)
    return db_session
