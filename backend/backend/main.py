#!/usr/bin/env python3
import logging

from fastapi import FastAPI, HTTPException

from backend import models, schemas

import pandas_datareader.data as web

from datetime import date

from sqlalchemy.exc import SQLAlchemyError

from fastapi.middleware.cors import CORSMiddleware

# set logging to display all messages INFO and above
logger = logging.getLogger()
logger.setLevel(logging.INFO)

db_session = models.init_db("sqlite:///:memory:")


logger.info("Starting FastAPI server")
app = FastAPI(title="Rails Takehome", version="0.1.0")

origins = [
    "http://localhost:3000",
    "https://localhost:3000",
    "http://localhost:8000",
    "https://localhost:8000"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def root():
    return {"message": "Hello World"}

@app.get("/dummy")
async def dummy() -> schemas.ReportBase:
    # dummy reportbase
    return schemas.ReportBase(
        id=1,
        name="dummy", 
        date_start=date(2022, 1, 1), 
        date_end=date(2022, 1, 10), 
        tickers=[
            {"ticker": "AAPL", "metric": "open"},
            {"ticker": "MSFT", "metric": "close"}
        ])


# I added this to help with frontend when generating a new id.
@app.get("/reports/count")
async def get_report_count() -> int:
    try:
        count = db_session.query(models.ReportConfig).count()
        return count
    except SQLAlchemyError:
        raise HTTPException(status_code=500, detail="Database Error")


@app.get("/reports")
async def get_all_report_configs() -> list[schemas.ReportBase]:
    try:
        reports = db_session.query(models.ReportConfig).all()
        return reports
    except SQLAlchemyError:
        raise HTTPException(status_code=500, detail="Database Error")


@app.get("/reports/{id}")
async def get_report_config(id: int) -> schemas.ReportBase:
    try:
        report = db_session.query(models.ReportConfig).filter(models.ReportConfig.id == id).first()
        if report is None:
            raise HTTPException(status_code=404, detail="Report not found")
        return report
    except SQLAlchemyError:
        raise HTTPException(status_code=500, detail="Database Error")


@app.put("/reports/{id}")
async def put_report_config(id: int, body: schemas.ReportBase) -> None:
    try:
        report = db_session.query(models.ReportConfig).filter(models.ReportConfig.id == id).first()
        if report is not None:
            raise HTTPException(status_code=409, detail="Report already exists")
        report = models.ReportConfig(id=id, name=body.name, date_start=body.date_start, date_end=body.date_end, tickers=body.tickers)
        db_session.add(report)
        db_session.commit()
        db_session.refresh(report)
    except SQLAlchemyError:
        raise HTTPException(status_code=500, detail="Database Error")


@app.delete("/reports/{id}")
async def delete_report_config(id: int) -> None:
    try:
        report = db_session.query(models.ReportConfig).filter(models.ReportConfig.id == id).first()
        if report is None:
            raise HTTPException(status_code=404, detail="Report not found")
        db_session.delete(report)
        db_session.commit()
    except SQLAlchemyError:
        raise HTTPException(status_code=500, detail="Database Error")


@app.get("/reports/{id}/data")
async def get_report_data(id: int) -> schemas.ReportData:
    # TODO: https://pandas-datareader.readthedocs.io/en/latest/remote_data.html#remote-data-stooq
    
     # first query the report configs database
    try:
        report = db_session.query(models.ReportConfig).filter(models.ReportConfig.id == id).first()
        if report is None:
            raise HTTPException(status_code=404, detail="Report not found")
    except SQLAlchemyError:
        raise HTTPException(status_code=500, detail="Database Error")
    
    # get the tickers and metrics
    tickers = [ticker_info["ticker"] for ticker_info in report.tickers]
    metrics = [ticker_info["metric"] for ticker_info in report.tickers]
    date_start = report.date_start
    date_end = report.date_end

    # get the dataframe
    try:
        df = web.DataReader(tickers, 'stooq', date_start, date_end)
    except Exception as e:
        raise HTTPException(status_code=500, detail="Error fetching data from stooq")

    def create_report_data_unit(row, tickers, metrics):
        output = []
        for ticker, metric in zip(tickers, metrics):
            try:
                value = row[(metric.capitalize(), ticker.upper())]
                report_data_unit = schemas.ReportDataUnit(ticker=ticker, date=row.name, value=value, metric=metric)
                output.append(report_data_unit)
            except KeyError:
                raise HTTPException(status_code=404, detail="Ticker not found/Invalid Ticker")
        return output
    
    print(tickers[0])
    print(metrics[0])

    # apply the function to each row
    output = df.apply(create_report_data_unit, axis=1, tickers=tickers, metrics=metrics).explode().tolist()

    # reverse the list
    output = output[::-1]

    return schemas.ReportData(data=output)

    