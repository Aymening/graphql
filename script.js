function createXPProgressionGraph(containerId, data) {
    const container = document.getElementById(containerId);
    const margin = { top: 40, right: 60, bottom: 40, left: 60 };
    let tooltip = null;

    function processData(data) {
        let cumulativeXP = 0;
        return data.transaction.map(tx => {
            cumulativeXP += tx.amount;
            return {
                amount: tx.amount,
                totalXP: cumulativeXP,
                project: tx.object.name,
                date: new Date(tx.createdAt)
            };
        });
    }

    function createScales(processedData, width, height) {
        const dateRange = [
            processedData[0].date,
            processedData[processedData.length - 1].date
        ];

        const xpRange = [0, processedData[processedData.length - 1].totalXP];

        return {
            xScale: (x) => {
                const range = dateRange[1] - dateRange[0];
                return ((x - dateRange[0]) / range) *
                    (width - margin.left - margin.right) +
                    margin.left;
            },
            yScale: (y) => {
                return height -
                    (y / xpRange[1]) *
                    (height - margin.top - margin.bottom) -
                    margin.bottom;
            }
        };
    }

    function createTooltip() {
        const tooltip = document.createElement('div');
        tooltip.style.cssText = `   
            position: absolute;
            display: none;
            background: rgba(0, 0, 0, 0.8);
            color: white;
            padding: 8px;
            border-radius: 4px;
            font-size: 14px;
            pointer-events: none;
            z-index: 1000;
        `;
        document.body.appendChild(tooltip);
        return tooltip;
    }

    function createPoint(svg, x, y, pointData, tooltip) {
        const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");

        circle.setAttribute("cx", x);
        circle.setAttribute("cy", y);
        circle.setAttribute("r", "4");
        circle.setAttribute("fill", "#808080");

        circle.addEventListener('mouseover', (e) => {
            circle.setAttribute("r", "6");
            circle.setAttribute("fill", "#ffffff");

            tooltip.style.display = 'block';
            tooltip.innerHTML = `
                Project: ${pointData.project}<br>
                XP: ${pointData.totalXP.toLocaleString()}<br>
                Date: ${pointData.date.toLocaleDateString()}
            `;

            const rect = circle.getBoundingClientRect();
            tooltip.style.left = `${rect.left + window.scrollX}px`;
            tooltip.style.top = `${rect.top + window.scrollY - 70}px`;
        });

        circle.addEventListener('mouseout', () => {
            circle.setAttribute("r", "4");
            circle.setAttribute("fill", "#808080");
            tooltip.style.display = 'none';
        });

        svg.appendChild(circle);
    }

    function render() {
        // Clear container
        container.innerHTML = '';

        // Get dimensions
        const width = container.getBoundingClientRect().width;
        const height = container.getBoundingClientRect().height || 400;

        // Create SVG
        const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svg.setAttribute("width", "100%");
        svg.setAttribute("height", "100%");
        svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
        svg.style.backgroundColor = "#1a1a1a";
        // let title = document.createElement('h2')
        // title.textContent = "XP Prog"
        // title.className = "progxp"
        // container.appendChild(title)
        container.appendChild(svg);

        // Process data
        const processedData = processData(data);
        const { xScale, yScale } = createScales(processedData, width, height);

        // Create tooltip if it doesn't exist
        if (!tooltip) {
            tooltip = createTooltip();
        }

        // Create line path
        const pathData = processedData.map((point, index) => {
            const x = xScale(point.date);
            const y = yScale(point.totalXP);
            return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
        }).join(' ');

        // Add line
        const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
        path.setAttribute("d", pathData);
        path.setAttribute("stroke", "#808080");
        path.setAttribute("stroke-width", "2");
        path.setAttribute("fill", "none");
        svg.appendChild(path);

        // Add points
        processedData.forEach(point => {
            const x = xScale(point.date);
            const y = yScale(point.totalXP);
            createPoint(svg, x, y, point, tooltip);
        });
    }

    // Initial render
    render();

    // Return function to handle updates
    return {
        update: (newData) => {
            data = newData;
            render();
        }
    };
}

// Usage:
// const graph = createXPProgressionGraph('section2', data);

// function login() {
//     // let islogged = false  // check if user logged or not

//     const username = document.getElementById("username").value;
//     const password = document.getElementById("password").value;

//     if (!username || !password) {
//         alert("Please enter username/email and password.");
//         return;
//     }

//     const credentials = btoa(`${username}:${password}`);

//     fetch("https://learn.zone01oujda.ma/api/auth/signin", {
//         method: "POST",
//         headers: {
//             "Authorization": `Basic ${credentials}`,
//             "Content-Type": "application/json"
//         }
//     })
//         .then(response => response.json())
//         .then(data => {
//             localStorage.setItem("jwt", data);
//             document.getElementById('loginDiv').style.display = 'none'
//             document.getElementById('dashboard').style.display = 'grid'

//         })
//         .catch(error => {
//             console.error("Error:", error);
//             alert("Login failed. Check your credentials.");
//         });

//     getProfile();

//     // window.onload = checkLoginStatus;
// }


function getProfile() {

    // if (islogged) {
    //     document.getElementById('login').classList.add('hidden')
    // }

    fetch("https://learn.zone01oujda.ma/api/graphql-engine/v1/graphql", {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${localStorage.getItem("jwt")}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            query: `{
                user {
                    firstName
                    lastName
                    auditRatio
                    transactions(
                     where: {type: {_like: "skill_%"}}
                     distinct_on: [type]
                    order_by: [{type: asc}, {amount: desc}]
                    ) {
                        id
                        type
                        amount
                    }
                }
                transaction(
                    where: {
                        _and: [
                            { type: { _eq: "xp" } }
                            { eventId: { _eq: 41 } }
                        ]
                    }
                ) {
                    type
                    amount
                    path
                    createdAt
                    eventId
                    object {
                        type
                        name
                    }
                }
            }`
        })
    })
        .then(response => response.json())
        .then(data => {
            const user = data.data.user[0];
            console.log(data);

            const transaction = data.data.transaction;
            // console.log(data);

            if (!user) return;

            let totalXP = 0;
            totalXP = data.data.transaction.reduce((acc, curr) => acc + curr.amount, 0);

            // Update text content
            console.log(user.firstName);

            document.getElementById("firstName").textContent = `Welcome, ${user.firstName} ${user.lastName}`;
            document.getElementById("section1").textContent = `Audit Ratio: ${Math.round(user.auditRatio)}`;
            document.getElementById("section2").textContent = ``; // Clear the text content
            document.getElementById("section3").textContent = `Total XP: ${totalXP}`;

            // Create the XP progression graph
            createXPProgressionGraph('section2', {
                transaction: data.data.transaction
            });

            // setup skills graph **************************************

            function createBarChart(skills, containerId) {
                const container = document.getElementById(containerId);
                container.innerHTML = ""; // Clear previous content

                const width = 400; // SVG width
                const height = 200; // SVG height
                const barWidth = 50; // Width of each bar
                const gap = 10; // Space between bars

                let maxAmount = Math.max(...skills.map(skill => skill.amount)); // Get max value

                // Create SVG element
                let svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
                svg.setAttribute("width", width);
                svg.setAttribute("height", height);

                skills.forEach((skill, index) => {
                    let barHeight = (skill.amount / maxAmount) * (height - 20); // Scale height

                    // Create bar (rectangle)
                    let rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
                    rect.setAttribute("x", index * (barWidth + gap));
                    rect.setAttribute("y", height - barHeight);
                    rect.setAttribute("width", barWidth);
                    rect.setAttribute("height", barHeight);
                    rect.setAttribute("fill", "#888"); // Bar color

                    // Create text label for amount
                    let amountText = document.createElementNS("http://www.w3.org/2000/svg", "text");
                    amountText.setAttribute("x", index * (barWidth + gap) + barWidth / 2);
                    amountText.setAttribute("y", height - barHeight - 5);
                    amountText.setAttribute("text-anchor", "middle");
                    amountText.setAttribute("fill", "#fff");
                    amountText.textContent = skill.amount;

                    // Create text label for skill type
                    let typeText = document.createElementNS("http://www.w3.org/2000/svg", "text");
                    typeText.setAttribute("x", index * (barWidth + gap) + barWidth / 2);
                    typeText.setAttribute("y", height + 15);
                    typeText.setAttribute("text-anchor", "middle");
                    typeText.setAttribute("fill", "#fff");
                    typeText.setAttribute("font-size", "10");
                    typeText.textContent = skill.type;

                    // Append elements to SVG
                    svg.appendChild(rect);
                    svg.appendChild(amountText);
                    svg.appendChild(typeText);
                });

                // Append SVG to container
                container.appendChild(svg);
            }

            // skills*****************
            let skills
            skills = data.data.user[0].transactions.sort((a, b) => b.amount - a.amount).slice(0, 6)
            // console.log(skills[0].type);
            createBarChart(skills, "section4");

            // skills.map(e => console.log(e.type, e.amount))
            // console.log(skills);
        })
        .catch(error => console.log(error));
}

// new loggin function

// Update the login function to handle the logout button visibility
function login() {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    if (!username || !password) {
        alert("Please enter username/email and password.");
        return;
    }

    const credentials = btoa(`${username}:${password}`);

    fetch("https://learn.zone01oujda.ma/api/auth/signin", {
        method: "POST",
        headers: {
            "Authorization": `Basic ${credentials}`,
            "Content-Type": "application/json"
        }
    })
        .then(response => response.json())
        .then(data => {
            localStorage.setItem("jwt", data);
            document.getElementById('loginDiv').style.display = 'none';
            document.getElementById('dashboard').style.display = 'grid';
            document.getElementById('logout-btn').style.display = 'block'; // Show logout button
            getProfile();
        })
        .catch(error => {
            console.error("Error:", error);
            alert("Login failed. Check your credentials.");
        });
}

// Update the logout function to handle UI state
function logoutUser() {
    localStorage.removeItem('jwt');
    document.getElementById('logout-btn').style.display = 'none';
    document.getElementById('loginDiv').style.display = 'block';
    document.getElementById('dashboard').style.display = 'none';
}

// Function to check login status on page load
function checkLoginStatus() {
    const token = localStorage.getItem('jwt');
    const logoutBtn = document.getElementById('logout-btn');
    const loginDiv = document.getElementById('loginDiv');
    const dashboard = document.getElementById('dashboard');

    if (token) {
        logoutBtn.style.display = 'block';
        loginDiv.style.display = 'none';
        dashboard.style.display = 'grid';
        getProfile(); // Load user data if logged in
    } else {
        logoutBtn.style.display = 'none';
        loginDiv.style.display = 'block';
        dashboard.style.display = 'none';
    }
}

// Add event listeners and initial check
document.addEventListener('DOMContentLoaded', function() {
    checkLoginStatus(); // Check login status when page loads
    document.getElementById('logout-btn').addEventListener('click', logoutUser);
});
















// ✅ Logout function**********************************

// window.onload = function() {
//     checkLoginStatus();
// };


// function logoutUser() {
//     localStorage.removeItem('jwt');

//     // window.location.href = 'index.html';
// }

// function checkLoginStatus() {
//     const token = localStorage.getItem('jwt');
//     const logoutBtn = document.getElementById('logout-btn');

//     if (token) {
//         logoutBtn.style.display = 'block';
//     } else {
//         logoutBtn.style.display = 'none';
//         window.location.href = 'index.html'
//     }
// }

// document.getElementById('logout-btn').addEventListener('click', logoutUser);
// window.onload = checkLoginStatus;

