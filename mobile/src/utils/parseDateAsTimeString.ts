export default function parseDateAsTimeString(date: Date): string {
    const time = date.toLocaleTimeString()
        .split(':')
        .splice(0,2);

    const formatedTime = time.join(':');

    return formatedTime;
}