"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { useState } from "react"
import { SkeletonCard } from "@/components/loadingCharts";

type ReportData = {
    ticker: string;
    date: Date;
    value: number;
    metric: string;
}[];
 
export function SheetDemo() {
    const [data, setData] = useState<ReportData | null>(null);
    const [sheetVisible, setSheetVisible] = useState(false);

    async function fetchData() {
        setSheetVisible(!sheetVisible);
        setData([
        {
            ticker: "AAPL",
            date: new Date(2022, 1, 1),
            value: 100,
            metric: "Volume",}
        ]);
    }

  return (
    <div>
            <Sheet>
                <SheetTrigger asChild>
                    <Button variant="outline">Open</Button>
                </SheetTrigger>
                    <SheetContent>
                        <SheetHeader>
                            <SheetTitle>Edit profile</SheetTitle>
                            <SheetDescription>
                                Make changes to your profile here. Click save when you're done.
                            </SheetDescription>
                        </SheetHeader>
                        { sheetVisible && (
                            <div className="grid gap-4 py-4">
                                <p>
                                    {data?.map((item) => (
                                        <p key={item.ticker}>
                                            Ticker: {item.ticker}, Value: {item.value}, Metric: {item.metric}
                                        </p>
                                    ))}
                                </p>
                                <br />
                                <Button onClick={fetchData}>Change Visibility</Button>
                            </div>
                        )}
                        {
                            !sheetVisible && (
                            <div>
                                <SkeletonCard />
                                <Button onClick={fetchData}>Change Visibility</Button>
                            </div>)
                        }
                        <SheetFooter>
                            <SheetClose asChild>
                                <Button type="submit">Save changes</Button>
                            </SheetClose>
                        </SheetFooter>
                    </SheetContent>
            </Sheet>
    </div>
  )
}