import { parse, getTime } from 'date-fns';

export function convertToEpoch(dateString: string): number {
    // Parse the date string to a Date object
    const date = parse(dateString, 'yyyy-MM-dd', new Date());

    // Get the Unix epoch time in milliseconds and convert to seconds
    const epochTimeInSeconds = getTime(date) / 1000;

    return epochTimeInSeconds;
}

export function calculateDiffDays(startDate: Date, endDate: Date): number {
    // Calculate the difference in milliseconds
    const differenceInMs = endDate.getTime() - startDate.getTime();

    // Convert milliseconds to days and round to the nearest integer
    const differenceInDays = Math.round(differenceInMs / (1000 * 60 * 60 * 24));

    return differenceInDays;
}
