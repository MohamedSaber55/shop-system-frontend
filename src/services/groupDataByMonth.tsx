export const groupDataByMonth = (items: [], dateKey: string, valueKey: string) => {
    const groupedData: { [key: string]: number } = {};

    items.forEach((item) => {
        const month = new Date(item[dateKey]).toLocaleString('default', { month: 'short', year: 'numeric' });
        if (!groupedData[month]) {
            groupedData[month] = 0;
        }
        groupedData[month] += item[valueKey];
    });

    // Convert to an array of objects sorted by month
    return Object.entries(groupedData).map(([month, total]) => ({ month, total }));
};
