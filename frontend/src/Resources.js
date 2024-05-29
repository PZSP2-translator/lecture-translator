export let port = 5000;
export let ip = "http://localhost:5000";
export async function craftTitle(code) {
    let title = "Unknown Lecture";
    let date = "";
    let lectureCode = "unknown";
    const metaData = await getMetaData(code);
    if (metaData) {
        title = metaData[1];
        date = metaData[2].substring(0, 10);;
        lectureCode = metaData[3];
    }
    return `${title} ${date} ---- Code: ${lectureCode}`;
}

export function getMetaData(lectureID) {
    return fetch(`http://localhost:${port}/lecture/${lectureID}`, {
        method: "GET",
        headers: {
            'Content-Type': 'application/json',
        },
    })
    .then(response => response.json())
    .then(data => {
        return data;
    })
    .catch((error) => console.error('Error:', error));
};