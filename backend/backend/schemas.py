from pydantic import BaseModel
from datetime import date
from typing import List, Dict

class ReportBase(BaseModel):
    id: int
    name: str
    date_start: date
    date_end: date
    tickers: List[Dict[str, str]]


class ReportDataUnit(BaseModel):
    ticker: str
    date: date
    value: float
    metric: str


class ReportData(BaseModel):
    data: List[ReportDataUnit]
