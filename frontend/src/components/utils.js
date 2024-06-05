let ip = "http://localhost:5000";

export function extractDate(timestamp) {
    const [date] = timestamp.split('T');
    return date;
}
