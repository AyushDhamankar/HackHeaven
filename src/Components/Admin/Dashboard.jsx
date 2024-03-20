import { Buffer } from "buffer";
import { useState, useEffect } from "react";
import {
    Card,
    CardBody,
    CardHeader,
    Typography,
  } from "@material-tailwind/react";
  import Chart from "react-apexcharts";
import react from "@heroicons/react";
   
  
   
  export default function Dashboard({ state1 }) {

    // Set Buffer globally
window.Buffer = Buffer;

const [numPosts, setNumPosts] = useState(0);
  const [numUsers, setNumUsers] = useState(0);
  const [numGovernmentWorkers, setNumGovernmentWorkers] = useState(0);
  const [statusCounts, setStatusCounts] = useState(0);
  const [resolve, setResolve] = useState(0);
const getData = async () => {
    try {
      const { provider, program, baseAccount } = state1;
      const data = await program.account.baseAccount.fetch(
        baseAccount.publicKey
      );
      console.log(data);
      const postsWithFeedback = data.postList.filter(post => post.feedback !== "0").length;
      console.log(postsWithFeedback);
      // Update state variables with the data
      setNumPosts(data.postLen);
      setNumUsers(data.userLen);
      setNumGovernmentWorkers(data.governmentWorkerLen);

      // Initialize an object to store the counts of different statuses
// const statusCounts = {
//     "Under Review": 0,
//     "Assigned": 0,
//     "Verify Work": 0,
//     // Add more statuses here if needed
//   };
  
//   // Iterate through each post in the postList array
//   data.postList.forEach(post => {
//     // Iterate through each status in the post's status array
//     post.status.forEach(status => {
//       // Increment the count for the corresponding status
//       if (statusCounts.hasOwnProperty(status.status)) {
//         statusCounts[status.status]++;
//       }
//     });
//   });
//   setStatusCounts(statusCounts);
//   console.log(statusCounts);

// Initialize variables to store total number of posts and status counts
let complaintResolvedCount = 0;

// Iterate through each post in the postList array
data.postList.forEach(post => {
  // Iterate through each status in the post's status array
  post.status.forEach(status => {
    // Increment the count for "Complaint Resolved" status
    if (status.status === "Complaint Resolved") {
      complaintResolvedCount++;
    }
  });
});
setResolve(complaintResolvedCount);
      console.log(data);
    } catch (error) {
      console.error("Error fetching post:", error);
    }
  };

  useEffect(()=>{
    getData();
  },[state1]);

  const chartConfig = {
    type: "bar",
    height: 240,
    series: [
      {
        name: "Sales",
        data: [numPosts, numGovernmentWorkers, numUsers],
      },
    ],
    options: {
      chart: {
        toolbar: {
          show: false,
        },
      },
      title: {
        show: "",
      },
      dataLabels: {
        enabled: false,
      },
      colors: ["#020617"],
      plotOptions: {
        bar: {
          columnWidth: "40%",
          borderRadius: 2,
        },
      },
      xaxis: {
        axisTicks: {
          show: false,
        },
        axisBorder: {
          show: false,
        },
        labels: {
          style: {
            colors: "#616161",
            fontSize: "12px",
            fontFamily: "inherit",
            fontWeight: 400,
          },
        },
        categories: [
          "User",
          "Government Worker",
          "Post"
        ],
      },
      yaxis: {
        labels: {
          style: {
            colors: "#616161",
            fontSize: "12px",
            fontFamily: "inherit",
            fontWeight: 400,
          },
        },
      },
      grid: {
        show: true,
        borderColor: "#dddddd",
        strokeDashArray: 5,
        xaxis: {
          lines: {
            show: true,
          },
        },
        padding: {
          top: 5,
          right: 20,
        },
      },
      fill: {
        opacity: 0.8,
      },
      tooltip: {
        theme: "dark",
      },
    },
  };

  const chartConfig1 = {
    type: "bar",
    height: 240,
    series: [
      {
        name: "Sales",
        data: [numPosts, resolve],
      },
    ],
    options: {
      chart: {
        toolbar: {
          show: false,
        },
      },
      title: {
        show: "",
      },
      dataLabels: {
        enabled: false,
      },
      colors: ["#020617"],
      plotOptions: {
        bar: {
          columnWidth: "40%",
          borderRadius: 2,
        },
      },
      xaxis: {
        axisTicks: {
          show: false,
        },
        axisBorder: {
          show: false,
        },
        labels: {
          style: {
            colors: "#616161",
            fontSize: "12px",
            fontFamily: "inherit",
            fontWeight: 400,
          },
        },
        categories: [
          "Total Number of Complaint",
          "Total Number of Complaint Resolve"
        ],
      },
      yaxis: {
        labels: {
          style: {
            colors: "#616161",
            fontSize: "12px",
            fontFamily: "inherit",
            fontWeight: 400,
          },
        },
      },
      grid: {
        show: true,
        borderColor: "#dddddd",
        strokeDashArray: 5,
        xaxis: {
          lines: {
            show: true,
          },
        },
        padding: {
          top: 5,
          right: 20,
        },
      },
      fill: {
        opacity: 0.8,
      },
      tooltip: {
        theme: "dark",
      },
    },
  };

    return (
        <>
        <section class="text-gray-400 bg-gray-900 body-font">
        <div class="container px-5 py-24 mx-auto" style={{ minHeight: "90vh", display: "flex",
    flexDirection: "column",
    justifyContent: "space-between" }}>
      <Card>
        <CardHeader
          floated={false}
          shadow={false}
          color="transparent"
          className="flex flex-col gap-4 rounded-none md:flex-row md:items-center"
        >
            <Typography variant="h6" color="blue-gray">
            Total Number of Users
          </Typography>
        </CardHeader>
        <CardBody className="px-2 pb-0">
          <Chart {...chartConfig} />
        </CardBody>
      </Card>

<Card>
<CardHeader
  floated={false}
  shadow={false}
  color="transparent"
  className="flex flex-col gap-4 rounded-none md:flex-row md:items-center"
> 
<div>
<Typography variant="h6" color="blue-gray">
Formula: (Resolved Complaint Count / Total Complaints) * 100
          </Typography>
<Typography variant="h6" color="blue-gray">
Resolve rate: {resolve} / {numPosts.toString()} x 100 = {(resolve / Number(numPosts.toString())) * 100}%
          </Typography>
          </div>
</CardHeader>
<CardBody className="px-2 pb-0">
  <Chart {...chartConfig1} />
</CardBody>
</Card>
</div>
</section>
</>
    );
  }