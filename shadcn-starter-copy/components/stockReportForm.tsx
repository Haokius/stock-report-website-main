"use client"
 
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
 
import { cn } from "@/lib/utils"
import { Calendar } from "@/components/ui/calendar"
import { Button } from "@/components/ui/button"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
  } from "@/components/ui/popover"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"
import { start } from "repl"

interface ReportConfigFormProps {
    onSubmit: (data: z.infer<typeof FormSchema>) => void
}

export const FormSchema = z.object({
    ticker: z.string().min(1, {
        message: "Ticker is required",
    }),
    metric: z.enum([
        "Volume",
        "Open",
        "Close",
        "High",
        "Low",]),
    startDate: z.date({
        required_error: "Start date is required",
    }),
    endDate: z.date({
        required_error: "End date is required",
    }),
}).refine((data) => data.startDate <= data.endDate, {
    message: "Start date cannot be after end date",
})

export function ReportConfigForm({ onSubmit }: ReportConfigFormProps) {
    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            ticker: "",
            metric: "Volume",
            startDate: new Date(2022, 1, 1),
            endDate: new Date(2022, 1, 15),
        },
    })

    async function handleSubmit(data: z.infer<typeof FormSchema>) {
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
            // return a sheet on the frontend with the data
            const data = await dataResponse.json();
            console.log(data)
            toast({
                title: "Data retrieved successfully!",
                description: (
                    <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
                        <code className="text-white">{JSON.stringify(data, null, 2)}</code>
                    </pre>
                ),
            })
            // ADD a sheet to the frontend with the data
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                    control={form.control}
                    name="ticker"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Ticker</FormLabel>
                            <FormControl>
                                <Input placeholder="AAPL" {...field} />
                            </FormControl>
                            <FormDescription>
                                Enter the ticker symbol of the stock
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="metric"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Metric</FormLabel>
                            <FormControl>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a metric" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Volume">Volume</SelectItem>
                                        <SelectItem value="Open">Open</SelectItem>
                                        <SelectItem value="Close">Close</SelectItem>
                                        <SelectItem value="High">High</SelectItem>
                                        <SelectItem value="Low">Low</SelectItem>
                                    </SelectContent>
                                </Select>
                            </FormControl>
                            <FormDescription>
                                Select the metric to display
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="startDate"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="flex flex-col">Start Date</FormLabel>
                            <Popover>
                                <PopoverTrigger asChild>
                                <FormControl>
                                    <Button
                                    variant={"outline"}
                                    className={cn(
                                        "w-[240px] pl-3 text-left font-normal",
                                        !field.value && "text-muted-foreground"
                                    )}
                                    >
                                    {field.value ? (
                                        format(field.value, "PPP")
                                    ) : (
                                        <span>Pick a date</span>
                                    )}
                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                    </Button>
                                </FormControl>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                    mode="single"
                                    selected={field.value}
                                    onSelect={field.onChange}
                                    disabled={(date) =>
                                    date > new Date() || date < new Date("1900-01-01")
                                    }
                                    initialFocus
                                />
                                </PopoverContent>
                            </Popover>
                            <FormDescription>
                                The start date of the stock data.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="endDate"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="flex flex-col">End Date</FormLabel>
                            <Popover>
                                <PopoverTrigger asChild>
                                <FormControl>
                                    <Button
                                    variant={"outline"}
                                    className={cn(
                                        "w-[240px] pl-3 text-left font-normal",
                                        !field.value && "text-muted-foreground"
                                    )}
                                    >
                                    {field.value ? (
                                        format(field.value, "PPP")
                                    ) : (
                                        <span>Pick a date</span>
                                    )}
                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                    </Button>
                                </FormControl>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                    mode="single"
                                    selected={field.value}
                                    onSelect={field.onChange}
                                    disabled={(date) =>
                                    date > new Date() || date < new Date("1900-01-01")
                                    }
                                    initialFocus
                                />
                                </PopoverContent>
                            </Popover>
                            <FormDescription>
                                The end date of the stock data.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit">Submit</Button>
            </form>
        </Form>
    )
}