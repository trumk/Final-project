import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getProjectByDepartment, getLikeByDepartment } from "../../redux/apiRequest";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import "./style.css";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Chart = () => {
  const dispatch = useDispatch();
  const projectData = useSelector((state) => state.project.departmentProjects);
  const likeData = useSelector((state) => state.project.departmentLikes);

  const [projectChartData, setProjectChartData] = useState(null);
  const [likeChartData, setLikeChartData] = useState(null);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    dispatch(getProjectByDepartment());
    dispatch(getLikeByDepartment());
  }, [dispatch]);

  useEffect(() => {
    if (projectData) {
      setProjectChartData({
        labels: projectData.map((item) => item._id || "No Department"),
        datasets: [
          {
            label: "Number of Projects",
            data: projectData.map((item) => item.projectCount),
            backgroundColor: "rgba(75, 192, 192, 0.6)",
          },
        ],
      });
    }
  }, [projectData]);

  useEffect(() => {
    if (likeData) {
      setLikeChartData({
        labels: likeData.map((item) => item._id || "No Department"),
        datasets: [
          {
            label: "Number of Likes",
            data: likeData.map((item) => item.totalLikes),
            backgroundColor: "rgba(153, 102, 255, 0.6)",
          },
        ],
      });
    }
  }, [likeData]);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="chart-container">
      <div className="chart-wrapper">
        <h2 className="chart-title">Projects by Department</h2>
        {projectChartData && <Bar key={windowWidth} data={projectChartData} />}
      </div>

      <div className="chart-wrapper">
        <h2 className="chart-title">Likes by Department</h2>
        {likeChartData && <Bar key={`likesChart-${windowWidth}`} data={likeChartData} />}
      </div>
    </div>
  );
};

export default Chart;
