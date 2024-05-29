export let port = 5000;

export async function craftTitle(code) {
    let title = "Unknown Lecture";
    let date = "";
    const metaData = await getMetaData(code);
    if (metaData) {
        console.log(metaData);
        title = metaData.name;
        date = metaData.date;
        console.log(title);
        console.log(date);
    }
    console.log(date);
    return `${title} ${date} ---- Code: ${code}`;
}

export  function getMetaData(code) {
    return fetch(`http://localhost:${port}/joinCourse`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            "code": code
        }),
    })
    .then(response => response.json())
    .then(data => {
        return data;
    })
    .catch((error) => console.error('Error:', error));
};