function createChartGameProgress(jobNames, jobPercentage)
{
    const defaultColours = ['#3366CC', '#DC3912', '#FF9900', '#109618', '#990099', '#3B3EAC', '#0099C6', '#DD4477',
                                '#66AA00', '#B82E2E', '#316395', '#994499', '#22AA99', '#AAAA11', '#6633CC', '#E67300',
                                '#8B0707', '#329262', '#5574A6', '#3B3EAC'];

    new Chart(document.getElementById("overallProgressChart"), {
        type: 'polarArea',
        data: {
            labels: jobNames,
            datasets: [{
                data: jobPercentage,
                backgroundColor: [defaultColours[0], defaultColours[1], defaultColours[2], defaultColours[3], defaultColours[4], defaultColours[5], defaultColours[6]]
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            legend: {
                fullWidth: true,
                position: 'right'
            }
        }
    });
}
