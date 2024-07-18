"use client"

import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { SkeletonCard } from "@/components/loadingCharts";

export type Report = {
  id: number;
  date_start: string;
  date_end: string;
  name: string;
  tickers: { ticker: string; metric: string }[];
};

type TableDemoProps = {
  onReportClick: (report: Report) => void;
}

export function TableDemo({ onReportClick }: TableDemoProps) {
  const [reports, setReports] = useState<Report[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch("http://localhost:8000/reports");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data: Report[] = await response.json();
        setReports(data);
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError("An unknown error occurred");
        }
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

//   const fetchReportData = async (report: Report) => {
//     // TODO: get data from backend and display it in the report
//     console.log(report);
//     const id = report.id;
//     const response = await fetch(`http://localhost:8000/reports/${id}/data`);

//     if (!response.ok) {
//       throw new Error("Network response was not ok");
//     }
//     const data = await response.json();
//     console.log(data);
//   }

  if (loading) {
    return <SkeletonCard />;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <Table>
      <TableCaption>Reports</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>ID</TableHead>
          <TableHead>Ticker</TableHead>
          <TableHead>Start Date</TableHead>
          <TableHead>End Date</TableHead>
          <TableHead>Metric</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {reports?.map((report) => (
          <TableRow key={report.id} onClick={() => {onReportClick(report)}}>
            <TableCell>{report.id}</TableCell>
            <TableCell>{report.tickers[0].ticker}</TableCell>
            <TableCell>{report.date_start}</TableCell>
            <TableCell>{report.date_end}</TableCell>
            <TableCell>{report.tickers[0].metric}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}