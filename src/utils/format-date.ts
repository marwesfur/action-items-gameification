const options: any = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
};

export function formatData(dateString: string): String {
    return new Date(dateString).toLocaleString(undefined, options);
}

