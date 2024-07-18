"use client"

import { MenubarDemo } from "@/components/menuComponent"
import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
  } from "@/components/ui/resizable";
import { Separator } from "@/components/ui/separator";
import { SkeletonCard } from "@/components/loadingCharts";
import { TableDemo } from "@/components/scollReportsDemo";
import { useState } from "react";
import { Report } from "@/components/scollReportsDemo";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ToastAction } from "@/components/ui/toast"
import { useToast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { set } from "date-fns";
import { ScrollArea } from "@/components/ui/scroll-area";


export default function History() {
    const [reportData, setReportData] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [ id, setId ] = useState<number | null>(null);

    const { toast } = useToast()

    const fetchReportData = async (report: Report) => {
        setLoading(true);
        try {
        const id = report.id;
        setId(id);
        const response = await fetch(`http://localhost:8000/reports/${id}/data`);

        if (!response.ok) {
            throw new Error("Network response was not ok");
        }

        const data = await response.json();
        setReportData(data.data);
        console.log(reportData);
        setError(null);
        } catch (error) {
        if (error instanceof Error) {
            setError(error.message);
        } else {
            setError("An unknown error occurred");
        }
        } finally {
        setLoading(false);
        }
    };

    const deleteReport = async (id: any) => {
        if (id === null) {
            return;
        }
        const response = await fetch(`http://localhost:8000/reports/${id}`, {
        method: "DELETE",
        });

        if (!response.ok) {
            throw new Error("Network response was not ok");
        }

        toast({
            title: "Report Deleted",
            description: "The report has been deleted successfully.",
        })

    };

    return (
        <section>
            <MenubarDemo />
            <ResizablePanelGroup direction="horizontal">
                <ResizablePanel minSize={35}>
                    <div className='container border h-screen'>
                        <br />
                        <h1 className='text-3xl font-bold'>Reports History</h1>
                        <br />
                        <Separator />
                        <br />  
                        <TableDemo onReportClick={fetchReportData}/>
                    </div>
                </ResizablePanel>
                <ResizableHandle />
                <Separator orientation="vertical"/>
                <ResizablePanel minSize={65}>
                    <div className='container border h-screen'>
                        <br />
                        <h1 className='text-3xl font-bold'>Report Preview</h1>
                        <br />
                        {error && <div>Error: {error}</div>}
                        {!loading && !error && reportData && (
                            <div>
                                {/* <Table>
                                    <TableCaption>Report Data</TableCaption>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Ticker</TableHead>
                                            <TableHead>Value</TableHead>
                                            <TableHead>Metric</TableHead>
                                            <TableHead>Date</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {reportData.map((item: any) => (
                                            <TableRow key={item.date}>
                                                <TableCell>{item.ticker}</TableCell>
                                                <TableCell>{item.value}</TableCell>
                                                <TableCell>{item.metric}</TableCell>
                                                <TableCell>{item.date}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table> */}
                                <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Ticker</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    <ScrollArea className="h-[300px]">
                                        {reportData.map((item: any) => (
                                            <TableRow key={item.date}>
                                                <TableCell>{item.ticker}</TableCell>
                                                <TableCell>{item.value}</TableCell>
                                                <TableCell>{item.metric}</TableCell>
                                                <TableCell>{item.date}</TableCell>
                                            </TableRow>
                                        ))}
                                    </ScrollArea>
                                </TableBody>
                                </Table>
                                <br />
                                <Button onClick={() => deleteReport(id)}>Delete</Button>
                            </div>
                        )}
                        <br />

                    </div>
                </ResizablePanel>
            </ResizablePanelGroup>
            <Toaster />
        </section>
    )
}