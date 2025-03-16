"use client"
import React, { useEffect, useState } from 'react';
import { viewDay, viewMonthAgenda, viewMonthGrid, viewWeek } from '@schedule-x/calendar';
import { ScheduleXCalendar, useNextCalendarApp } from '@schedule-x/react';
import { createEventModalPlugin } from '@schedule-x/event-modal';
import '@schedule-x/theme-default/dist/index.css'


interface CalendarEvent {
    title: string;
    id: string;
    start: string;
    end: string;
    description: string;
}

interface CustomCalendarProps {
    events: CalendarEvent[];
    onEventClick?: (event: CalendarEvent) => void;
}

const Calendar: React.FC<CustomCalendarProps> = ({ events, onEventClick }) => {
    const [mounted, setMounted] = useState(false);

    const calendarApp = useNextCalendarApp({
        views: [viewWeek, viewMonthGrid, viewDay, viewMonthAgenda],
        defaultView: viewWeek.name,
        events: events,
        selectedDate: '2025-02-08',
        callbacks: {
            onEventClick: (calendarEvent) => { // Removed `e`
                console.log('Event Clicked:', calendarEvent);
                if (onEventClick) onEventClick(calendarEvent as CalendarEvent);
            },
        },
        
        plugins: [createEventModalPlugin()],
    });

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (events && events.length > 0 && mounted) {
            const existingEvents = calendarApp?.events.getAll();
            const newEvents = events.filter((event) => {
                return !existingEvents?.some((existingEvent) => existingEvent.id === event.id);
            });
            newEvents.forEach((event) => calendarApp?.events.add(event));
        }
    }, [events, calendarApp, mounted]);

    if (!mounted) return null;
    return <ScheduleXCalendar calendarApp={calendarApp} />;
};

export default Calendar;