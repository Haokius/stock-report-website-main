"use client"

import { MenubarDemo } from "@/components/menuComponent"
import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
  } from "@/components/ui/resizable";
import { Separator } from "@/components/ui/separator";
import { ReportConfigForm } from "@/components/stockReportForm";
import { SkeletonCard } from "@/components/loadingCharts";
import { ToastAction } from "@/components/ui/toast"
import { useToast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { z } from "zod"
import { FormSchema } from "@/components/stockReportForm"
import { useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function Report() {
    const { toast } = useToast()
    const [ reportData, setReportData ] = useState<any>(null);
    const [ loading, setLoading ] = useState(true);

    async function onSubmit(data: z.infer<typeof FormSchema>) {
        console.log(data)
        toast({
            title: "You have submitted the following values:",
            description: (
                <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
                    <code className="text-white">{JSON.stringify(data, null, 2)}</code>
                </pre>
            ),
        })
        // TODO: submit config to backend to PUT to database, then GET data from database to display in report
        // GET the new id - the new id will be the total number of rows in the database
        // TODO: implement a get count function in the backend
        const countResponse = await fetch(`http://localhost:8000/reports/count`);

        const id = parseInt(await countResponse.json()) + 1
        console.log(id)

        const response = await fetch(`http://localhost:8000/reports/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                id: id,
                name: "Report Name",
                date_start: new Date(data.startDate).toISOString().split('T')[0],
                date_end: new Date(data.endDate).toISOString().split('T')[0],
                tickers: [
                    {
                        ticker: data.ticker,
                        metric: data.metric
                    }
                ]
            }),
        })

        console.log(response)

        if (!response.ok) {
            toast({
                variant: "destructive",
                title: "Uh oh! Something went wrong.",
                description: "Please try again later.",
            })
        } else {
            const dataResponse = await fetch(`http://localhost:8000/reports/${id}/data`);
            const data = await dataResponse.json();
            setLoading(false);
            setReportData(data.data);
            // TODO: get data from backend and display it in the report as a table
            console.log(data);
        }
    }

    return (
        <section>
            <MenubarDemo />
            <ResizablePanelGroup direction="horizontal">
                <ResizablePanel minSize={35}>
                    <div className='container border h-screen'>
                        <br />
                        <h1 className='text-3xl font-bold'>Report Configurations</h1>
                        <br />
                        <Separator />
                        <br />
                        <h3 className='text-xl font-bold'>Set Configurations</h3>
                        <br />
                        <ReportConfigForm onSubmit={onSubmit}/>
                    </div>
                </ResizablePanel>
                <ResizableHandle />
                <Separator orientation="vertical"/>
                <ResizablePanel minSize={65}>
                    <div className='container border h-screen'>
                        <br />
                        <h1 className='text-3xl font-bold'>Report Preview</h1>
                        <br />
                        {loading ? <SkeletonCard/> : (
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
                            </div>
                        )}
                    </div>
                </ResizablePanel>
            </ResizablePanelGroup>
            <Toaster />
        </section>
    )
}