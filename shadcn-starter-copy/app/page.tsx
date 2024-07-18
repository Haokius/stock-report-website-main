import { MenubarDemo } from "@/components/menuComponent"
import { ReportConfigForm } from "@/components/stockReportForm"
import { ToastWithAction } from "@/components/toastDemo"
import { SheetDemo } from "@/components/sheetDemo"

export default function Home() {
  return (
    <section>
      <MenubarDemo />
      <br />
      <div className='container'>
        <h1 className='text-3xl font-bold'>Stock Report App</h1>
      </div>
      <br />
      <div className='container'>
        <h2 className='text-2xl font-bold'>Welcome to the Stock Report App</h2>
        <br />
        <p>Get started by creating a new report.</p>
        <p>You can also view previous reports under report history.</p>
        <p>Return to the home page for instructions.</p>
        <br />
        <SheetDemo />
      </div>        
    </section>
  )
}
