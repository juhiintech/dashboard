// =====================================================
// TRAVEL SIM SALES DASHBOARD
// =====================================================


// =====================================================
// SUPABASE CONFIG
// =====================================================
// ==========================
// LOGIN
// ==========================

function login() {

    const username =
        document.getElementById("username").value.trim();

    const password =
        document.getElementById("password").value.trim();


    if (
        username === "admin" &&
        password === "1234"
    ) {

        window.location.href =
            "dashboard.html";

    } else {

        alert("Invalid Username or Password");

    }

}

const BASE_URL =
    "https://lrbflidmcrnncezoaoss.supabase.co/rest/v1";

const API_KEY =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxyYmZsaWRtY3JubmNlem9hb3NzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ1NDc1NTYsImV4cCI6MjEwMDEyMzU1Nn0.dSwxTil66rmnLp7f9Z1i5hgQ7uRuG8r2DwmBSzKnOa0";


const headers = {

    "apikey": API_KEY,

    "Authorization":
        "Bearer " + API_KEY,

    "Content-Type":
        "application/json"

};


// =====================================================
// GLOBAL DATA
// =====================================================

let allOrders = [];

let filteredOrders = [];

let salesChart = null;


// =====================================================
// CURRENCY FORMAT
// =====================================================

function money(value) {

    return "₹" +
        Number(value || 0)
            .toLocaleString("en-IN");

}


// =====================================================
// STATUS MESSAGE
// =====================================================

function showStatus(message, type = "info") {

    const status =
        document.getElementById("apiStatus");


    if (!status) return;


    status.style.display = "block";

    status.textContent = message;


    if (type === "error") {

        status.style.borderLeft =
            "4px solid #dc2626";

        status.style.color =
            "#b91c1c";

    }

    else if (type === "success") {

        status.style.borderLeft =
            "4px solid #16a34a";

        status.style.color =
            "#166534";

    }

    else {

        status.style.borderLeft =
            "4px solid #2563eb";

        status.style.color =
            "#1d4ed8";

    }

}


// =====================================================
// LOAD DATA FROM SUPABASE
// =====================================================

async function loadOrders() {

    showStatus(
        "Loading sales data...",
        "info"
    );


    try {

        const response = await fetch(

            BASE_URL +
            "/orders?select=*&order=order_date.asc",

            {

                method: "GET",

                headers: headers

            }

        );


        if (!response.ok) {

            const error =
                await response.text();

            console.error(
                "Supabase Error:",
                error
            );


            showStatus(
                "Unable to load Supabase data. Check Console.",
                "error"
            );

            return;

        }


        allOrders =
            await response.json();


        filteredOrders =
            [...allOrders];


        console.log(
            "Total orders:",
            allOrders.length
        );


        updateDashboard(
            filteredOrders
        );


        showStatus(

            `${allOrders.length} orders loaded successfully`,

            "success"

        );


        setTimeout(() => {

            const status =
                document.getElementById(
                    "apiStatus"
                );

            if (status) {

                status.style.display =
                    "none";

            }

        }, 2500);


    }

    catch (error) {

        console.error(
            "Connection error:",
            error
        );


        showStatus(
            "Could not connect to Supabase.",
            "error"
        );

    }

}


// =====================================================
// UPDATE DASHBOARD
// =====================================================

function updateDashboard(orders) {

    updateCards(orders);

    updateLeaderboard(orders);

    updateDestinations(orders);

    updateOrdersTable(orders);

    updateChart(orders);

}


// =====================================================
// CARDS
// =====================================================

function updateCards(orders) {

    const totalOrders =
        orders.length;


    let totalRevenue = 0;

    let totalDiscount = 0;


    orders.forEach(order => {

        totalRevenue +=
            Number(order.amount) || 0;


        totalDiscount +=
            Number(order.discount) || 0;

    });


    const averageOrder =
        totalOrders > 0
            ? totalRevenue / totalOrders
            : 0;


    const ordersElement =
        document.getElementById(
            "orders"
        );


    const revenueElement =
        document.getElementById(
            "revenue"
        );


    const discountElement =
        document.getElementById(
            "discount"
        );


    const averageElement =
        document.getElementById(
            "averageOrder"
        );


    if (ordersElement) {

        ordersElement.textContent =
            totalOrders
                .toLocaleString("en-IN");

    }


    if (revenueElement) {

        revenueElement.textContent =
            money(totalRevenue);

    }


    if (discountElement) {

        discountElement.textContent =
            money(totalDiscount);

    }


    if (averageElement) {

        averageElement.textContent =
            money(
                Math.round(
                    averageOrder
                )
            );

    }

}


// =====================================================
// DATE FILTER
// =====================================================

function applyFilter() {

    const fromDate =
        document.getElementById(
            "fromDate"
        ).value;


    const toDate =
        document.getElementById(
            "toDate"
        ).value;


    // No date selected

    if (!fromDate && !toDate) {

        filteredOrders =
            [...allOrders];

        updateDashboard(
            filteredOrders
        );

        return;

    }


    // Invalid range

    if (
        fromDate &&
        toDate &&
        fromDate > toDate
    ) {

        showStatus(
            "Please select a valid date range.",
            "error"
        );

        return;

    }


    filteredOrders =
        allOrders.filter(order => {

            const orderDate =
                order.order_date;


            if (!orderDate) {

                return false;

            }


            if (
                fromDate &&
                orderDate < fromDate
            ) {

                return false;

            }


            if (
                toDate &&
                orderDate > toDate
            ) {

                return false;

            }


            return true;

        });


    updateDashboard(
        filteredOrders
    );


    showStatus(

        `${filteredOrders.length} orders found for selected dates`,

        "success"

    );


    setTimeout(() => {

        const status =
            document.getElementById(
                "apiStatus"
            );

        if (status) {

            status.style.display =
                "none";

        }

    }, 2500);

}


// =====================================================
// RESET FILTER
// =====================================================

function resetFilter() {

    document.getElementById(
        "fromDate"
    ).value = "";


    document.getElementById(
        "toDate"
    ).value = "";


    filteredOrders =
        [...allOrders];


    updateDashboard(
        filteredOrders
    );

}


// =====================================================
// SALES LEADERBOARD
// =====================================================

function updateLeaderboard(orders) {

    const tbody =
        document.querySelector(
            "#leaderboard tbody"
        );


    if (!tbody) return;


    const reps = {};


    orders.forEach(order => {

        const rep =
            order.sales_rep ||
            "Unknown";


        if (!reps[rep]) {

            reps[rep] = {

                orders: 0,

                revenue: 0

            };

        }


        reps[rep].orders += 1;


        reps[rep].revenue +=
            Number(order.amount) || 0;

    });


    const sorted =
        Object.entries(reps)
            .sort(
                (a, b) =>
                    b[1].revenue -
                    a[1].revenue
            );


    tbody.innerHTML = "";


    sorted.forEach(
        ([rep, data]) => {

            tbody.innerHTML += `

                <tr>

                    <td>
                        ${rep}
                    </td>

                    <td>
                        ${data.orders}
                    </td>

                    <td>
                        ${money(
                            data.revenue
                        )}
                    </td>

                </tr>

            `;

        }
    );

}


// =====================================================
// TOP DESTINATIONS
// =====================================================

function updateDestinations(orders) {

    const tbody =
        document.querySelector(
            "#destinations tbody"
        );


    if (!tbody) return;


    const destinations = {};


    orders.forEach(order => {

        /*
         * Your current orders table has
         * product_id but no country column.
         *
         * Therefore Product ID is displayed
         * here until a country/destination
         * column is added to orders.
         */


        const destination =
            order.country ||
            order.destination ||
            `Product ${order.product_id || "-"}`;


        if (!destinations[destination]) {

            destinations[destination] = {

                orders: 0,

                revenue: 0

            };

        }


        destinations[destination].orders += 1;


        destinations[destination].revenue +=
            Number(order.amount) || 0;

    });


    const sorted =
        Object.entries(destinations)
            .sort(
                (a, b) =>
                    b[1].revenue -
                    a[1].revenue
            );


    tbody.innerHTML = "";


    sorted.forEach(
        ([destination, data]) => {

            tbody.innerHTML += `

                <tr>

                    <td>
                        ${destination}
                    </td>

                    <td>
                        ${data.orders}
                    </td>

                    <td>
                        ${money(
                            data.revenue
                        )}
                    </td>

                </tr>

            `;

        }
    );

}


// =====================================================
// ORDERS TABLE
// =====================================================

function updateOrdersTable(orders) {

    const tbody =
        document.querySelector(
            "#ordersTable tbody"
        );


    if (!tbody) return;


    tbody.innerHTML = "";


    orders.forEach(order => {

        tbody.innerHTML += `

            <tr>

                <td>
                    ${order.customer_name || "-"}
                </td>

                <td>
                    ${order.sales_rep || "-"}
                </td>

                <td>
                    ${order.quantity || 0}
                </td>

                <td>
                    ${money(order.amount)}
                </td>

                <td>
                    ${money(order.discount)}
                </td>

                <td>
                    ${order.order_date || "-"}
                </td>

            </tr>

        `;

    });

}


// =====================================================
// REVENUE CHART
// =====================================================

function updateChart(orders) {

    const canvas =
        document.getElementById(
            "salesChart"
        );


    if (!canvas) return;


    const revenueByDate = {};


    orders.forEach(order => {

        const date =
            order.order_date;


        if (!date) return;


        if (!revenueByDate[date]) {

            revenueByDate[date] = 0;

        }


        revenueByDate[date] +=
            Number(order.amount) || 0;

    });


    const labels =
        Object.keys(
            revenueByDate
        ).sort();


    const revenue =
        labels.map(
            date =>
                revenueByDate[date]
        );


    if (salesChart) {

        salesChart.destroy();

    }


    salesChart =
        new Chart(

            canvas,

            {

                type: "line",

                data: {

                    labels: labels,

                    datasets: [

                        {

                            label:
                                "Revenue",

                            data:
                                revenue,

                            tension:
                                0.3,

                            fill:
                                true

                        }

                    ]

                },


                options: {

                    responsive: true,

                    maintainAspectRatio:
                        false,


                    plugins: {

                        legend: {

                            display: true

                        }

                    },


                    scales: {

                        y: {

                            beginAtZero:
                                true,

                            ticks: {

                                callback:
                                    function(value) {

                                        return "₹" +
                                            Number(value)
                                                .toLocaleString(
                                                    "en-IN"
                                                );

                                    }

                            }

                        }

                    }

                }

            }

        );

}


// =====================================================
// START
// =====================================================

document.addEventListener(
    "DOMContentLoaded",
    function() {

        loadOrders();

    }
);
