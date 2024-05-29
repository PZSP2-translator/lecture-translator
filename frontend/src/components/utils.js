export function extractDate(timestamp) {
    const [date] = timestamp.split('T');
    return date;
}
