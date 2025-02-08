
"use client"
import DynamicTable from '../stock/component/DynamicTable';
import LogisticsLineChart from './components/LogisticsLineChart';
import Calendar from './components/Calendar';

const Logistics = () => {

    const stockData = [
        { id: "01.", name: "Trivago", left: "520", need: "1000", number: "05123456789", status: "Absent" },
        { id: "02.", name: "Canon", left: "480", need: "236", number: "05123456789", status: "working" },
        { id: "03.", name: "Uber Food", left: "350", need: "475", number: "05123456789", status: "Absent", test: "jimmy" },
    ];



    const stockFormatters = {
        number: (value: string) => <span className="font-mono">{value}</span>,
    };

   

    const data = [
        { month: "Jan", cost: 1200 },
        { month: "Feb", cost: 1100 },
        { month: "Mar", cost: 1400 },
        { month: "Apr", cost: 1300 },
        { month: "May", cost: 1500 },
        { month: "Jun", cost: 1700 },
        { month: "Jul", cost: 1600 },
        { month: "Aug", cost: 1800 },
        { month: "Sep", cost: 1900 },
        { month: "Oct", cost: 2000 },
        { month: "Nov", cost: 2100 },
        { month: "Dec", cost: 2200 },
    ];

    const fakeEvents = [
        {
            id: "1",
            title: "Logistics Meeting",
            start: "2025-02-10 10:00",
            end: "2025-02-10 12:00",
            description: "Discussion on supply chain improvements",
        },
        {
            id: "2",
            title: "Shipment Arrival",
            start: "2025-02-12 14:00",
            end: "2025-02-12 15:00",
            description: "Tracking incoming shipment",
        },
        {
            id: "3",
            title: "Inventory Check",
            start: "2025-02-15 09:00",
            end: "2025-02-15 11:00",
            description: "Quarterly stock analysis",
        },
    ];
    return (
        <div>
            <div className='flex items-center gap-6'>
                <div className='w-1/2 h-96'>
                    <DynamicTable
                        data={stockData}
                        title="Stock Statistics"
                        customFormatters={stockFormatters}
                    />
                </div>
                <div className='w-1/2'>
                    <LogisticsLineChart data={data} />
                </div>
            </div>
            <div>
                <h2 className="text-xl font-semibold text-start mb-4 text-main-blue">Calendar</h2>
                <Calendar events={fakeEvents} />
            </div>
        </div>
    )
};

export default Logistics;