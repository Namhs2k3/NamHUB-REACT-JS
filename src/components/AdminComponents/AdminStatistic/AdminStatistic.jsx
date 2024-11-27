import clsx from "clsx";
import AdminSideBar from "../AdminSideBar/AdminSideBar";
import styles from "./AdminStatistic.module.css";
import AdminNavbar from "../AdminNavbar/AdminNavbar";
import Loading from "../../Loading/Loading";
import { format } from "date-fns";
import { useContext, useEffect, useState } from "react";
import { ToggleSidebarContext } from "../../../contexts/ToggleSidebarContext";
import "react-datepicker/dist/react-datepicker.css";
import {
  getAllUser,
  getNewUserByMonth,
  getNewUserByQuater,
  getOrderCountByTime,
  getRevenueByCategory,
  getRevenueByMonth,
  getRevenueByPaymentMethod,
  getRevenueByPeriodDate,
  getRevenueByProduct,
  getRevenueByQuarter,
  getTotalRevenue,
  getTotalOrders,
  getBestSeller,
  getBestSellerByQuarter,
} from "../../../api";
import { useNavigate } from "react-router-dom";
import { ThemeContext } from "../../../contexts/ThemeContext";
import { Bar, Doughnut, Line, Pie, PolarArea } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  BarElement,
  RadialLinearScale,
  ArcElement,
} from "chart.js";
import DatePicker from "react-datepicker";
import { toast, ToastContainer } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMedal, faTrophy } from "@fortawesome/free-solid-svg-icons";

// Đăng ký các thành phần của Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  RadialLinearScale,
  ArcElement
);

const AdminStatistic = () => {
  const { isSidebarCollapsed, toggleSidebar } =
    useContext(ToggleSidebarContext);

  const { isChecked } = useContext(ThemeContext);

  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);

  const [selectedDate, setSelectedDate] = useState({
    start: new Date(new Date().getFullYear(), 0, 1),
    end: new Date(),
  });

  const [selectedType, setSelectedType] = useState("revenue");

  const handleChangeType = (e) => {
    setSelectedType(() => {
      const newVal = e.target.value;
      console.info("new value: ", newVal);
      return newVal;
    });
  };

  const [selectedYear, setSelectedYear] = useState(2024);

  const handleChangeYear = (e) => {
    setSelectedYear(() => {
      const newVal = Number(e.target.value);
      console.info("new year: ", newVal);
      return newVal;
    });
  };

  const [newUsers, setNewUsers] = useState([]);
  const [allUsers, setAllUsers] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [revenueByMonth, setRevenueByMonth] = useState([]);
  const [revenueByQuarter, setRevenueByQuarter] = useState([]);
  const [revenueByPeriodDate, setRevenueByPeriodDate] = useState(0);
  const [revenueByPM, setRevenueByPaymentMethod] = useState([]);
  const [revenueByCate, setRevenueByCate] = useState([]);
  const [revenueByProd, setRevenueByProd] = useState([]);
  const [getTotalOrder, setTotalOrders] = useState(0);
  const [getTodayOrders, setTodayOrders] = useState(0);
  const [getOrdersByPeriodTime, setOrdersByPeriodTime] = useState(0);
  const [getMonthOrders, setMonthOrders] = useState([]);
  const [getQuarterOrders, setQuarterOrders] = useState([]);
  const [bestSellers, setBestSellers] = useState([]);
  const [bestSellersByQuarter, setBestSellersByQuarter] = useState([]);
  const [newUsersByQuarter, setNewUsersByQuarter] = useState({
    quarters: { 1: 0, 2: 0, 3: 0, 4: 0 },
    year: new Date().getFullYear(),
  });
  useEffect(() => {
    const fetchNewUserData = async () => {
      setIsLoading(false);
      try {
        const promises = [];
        for (let i = 1; i <= 12; i++) {
          promises.push(getNewUserByMonth(selectedYear, i)); // Push các promise vào mảng
        }
        const data = await Promise.all(promises); // Chờ tất cả các promise hoàn thành
        console.log("New Users: ", data);
        setNewUsers(data);
      } catch (err) {
        console.error("Lỗi khi lấy dữ liệu: ", err);
        if (err.status === 401) {
          navigate("/unauthenticated");
        } else if (err.status === 403) {
          navigate("/unauthorized");
        } else {
          navigate("/not-found");
        }
      } finally {
        setIsLoading(false);
      }
    };

    const fetchAllUserData = async () => {
      setIsLoading(false);
      try {
        const data = await getAllUser();
        console.log("All Users: ", data);
        setAllUsers(data);
      } catch (err) {
        console.error("Lỗi khi lấy dữ liệu: ", err);
        if (err.status === 401) {
          navigate("/unauthenticated");
        } else if (err.status === 403) {
          navigate("/unauthorized");
        } else {
          navigate("/not-found");
        }
      } finally {
        setIsLoading(false);
      }
    };

    const fetchNewUserByQuaterData = async () => {
      setIsLoading(false);
      try {
        const data = await getNewUserByQuater(selectedYear);
        console.log("New Users By Quater: ", data);
        setNewUsersByQuarter(data);
      } catch (err) {
        console.error("Lỗi khi lấy dữ liệu: ", err);
        if (err.status === 401) {
          navigate("/unauthenticated");
        } else if (err.status === 403) {
          navigate("/unauthorized");
        } else {
          navigate("/not-found");
        }
      } finally {
        setIsLoading(false);
      }
    };

    //Revenue
    const fetchTotalRevenue = async () => {
      setIsLoading(false);
      try {
        const data = await getTotalRevenue();
        console.log("Total Revenue: ", data);
        setTotalRevenue(new Intl.NumberFormat("vi-VN").format(data));
        console.log(
          "Total Revenue after format: ",
          new Intl.NumberFormat("vi-VN").format(data)
        );
      } catch (err) {
        console.error("Lỗi khi lấy dữ liệu: ", err);
        if (err.status === 401) {
          navigate("/unauthenticated");
        } else if (err.status === 403) {
          navigate("/unauthorized");
        } else {
          navigate("/not-found");
        }
      } finally {
        setIsLoading(false);
      }
    };

    const fetchRevenueByMonth = async () => {
      setIsLoading(false);
      try {
        const promises = [];
        for (let i = 1; i <= 12; i++) {
          promises.push(getRevenueByMonth(selectedYear, i)); // Push các promise vào mảng
        }
        const data = await Promise.all(promises); // Chờ tất cả các promise hoàn thành
        console.log("Revenue by month: ", data);
        setRevenueByMonth(data);
      } catch (err) {
        console.error("Lỗi khi lấy dữ liệu: ", err);
        if (err.status === 401) {
          navigate("/unauthenticated");
        } else if (err.status === 403) {
          navigate("/unauthorized");
        } else {
          navigate("/not-found");
        }
      } finally {
        setIsLoading(false);
      }
    };

    const fetchRevenueByQuarter = async () => {
      setIsLoading(false);
      try {
        const promises = [];
        for (let i = 1; i <= 4; i++) {
          promises.push(getRevenueByQuarter(selectedYear, i)); // Push các promise vào mảng
        }
        const data = await Promise.all(promises); // Chờ tất cả các promise hoàn thành
        console.log("Revenue by quarter: ", data);
        setRevenueByQuarter(data);
      } catch (err) {
        console.error("Lỗi khi lấy dữ liệu: ", err);
        if (err.status === 401) {
          navigate("/unauthenticated");
        } else if (err.status === 403) {
          navigate("/unauthorized");
        } else {
          navigate("/not-found");
        }
      } finally {
        setIsLoading(false);
      }
    };

    const fetchRevenueByPeriodDate = async () => {
      setIsLoading(false);
      try {
        const data = await getRevenueByPeriodDate(
          format(selectedDate.start, "MM/dd/yyyy"),
          format(selectedDate.end, "MM/dd/yyyy")
        );
        console.log("Revenue by period date: ", data);
        setRevenueByPeriodDate(data);
      } catch (err) {
        console.error("Lỗi khi lấy dữ liệu: ", err);
        if (err.status === 401) {
          navigate("/unauthenticated");
        } else if (err.status === 403) {
          navigate("/unauthorized");
        } else {
          navigate("/not-found");
        }
      } finally {
        setIsLoading(false);
      }
    };

    const fetchRevenueByPaymentMethod = async () => {
      setIsLoading(false);
      try {
        const data = await getRevenueByPaymentMethod(
          format(selectedDate.start, "MM/dd/yyyy"),
          format(selectedDate.end, "MM/dd/yyyy")
        );
        console.log("Revenue by Payment Method: ", data);
        setRevenueByPaymentMethod(data);
      } catch (err) {
        console.error("Lỗi khi lấy dữ liệu: ", err);
        if (err.status === 401) {
          navigate("/unauthenticated");
        } else if (err.status === 403) {
          navigate("/unauthorized");
        } else {
          navigate("/not-found");
        }
      } finally {
        setIsLoading(false);
      }
    };

    const fetchRevenueByCategory = async () => {
      setIsLoading(false);
      try {
        const data = await getRevenueByCategory(
          format(selectedDate.start, "MM/dd/yyyy"),
          format(selectedDate.end, "MM/dd/yyyy")
        );
        console.log("Revenue by Cate: ", data);
        setRevenueByCate(data);
      } catch (err) {
        console.error("Lỗi khi lấy dữ liệu: ", err);
        if (err.status === 401) {
          navigate("/unauthenticated");
        } else if (err.status === 403) {
          navigate("/unauthorized");
        } else {
          navigate("/not-found");
        }
      } finally {
        setIsLoading(false);
      }
    };

    const fetchRevenueByProd = async () => {
      setIsLoading(false);
      try {
        const data = await getRevenueByProduct(
          format(selectedDate.start, "MM/dd/yyyy"),
          format(selectedDate.end, "MM/dd/yyyy")
        );
        console.log("Revenue by Prod: ", data);
        setRevenueByProd(data);
      } catch (err) {
        console.error("Lỗi khi lấy dữ liệu: ", err);
        if (err.status === 401) {
          navigate("/unauthenticated");
        } else if (err.status === 403) {
          navigate("/unauthorized");
        } else {
          navigate("/not-found");
        }
      } finally {
        setIsLoading(false);
      }
    };

    const fetchTotalOrders = async () => {
      setIsLoading(false);
      try {
        const data = await getTotalOrders();
        console.log("Total Orders: ", data);
        setTotalOrders(data);
      } catch (err) {
        console.error("Lỗi khi lấy dữ liệu: ", err);
        if (err.status === 401) {
          navigate("/unauthenticated");
        } else if (err.status === 403) {
          navigate("/unauthorized");
        } else {
          navigate("/not-found");
        }
      } finally {
        setIsLoading(false);
      }
    };

    const fetchTodayOrders = async () => {
      setIsLoading(false);
      try {
        const date = format(new Date(), "MM/dd/yyyy");
        console.log("Date:", date);
        const data = await getOrderCountByTime(date, date);
        console.log("getOrderCountByTime: ", data);
        setTodayOrders(data);
      } catch (err) {
        console.error("Lỗi khi lấy dữ liệu: ", err);
        if (err.status === 401) {
          navigate("/unauthenticated");
        } else if (err.status === 403) {
          navigate("/unauthorized");
        } else {
          navigate("/not-found");
        }
      } finally {
        setIsLoading(false);
      }
    };

    const fetchOrdersInPeriodTime = async () => {
      setIsLoading(false);
      try {
        const start = format(selectedDate.start, "MM/dd/yyyy");
        const end = format(selectedDate.end, "MM/dd/yyyy");
        const data = await getOrderCountByTime(start, end);
        console.log("getOrderCountByTime: ", data);
        setOrdersByPeriodTime(data);
      } catch (err) {
        console.error("Lỗi khi lấy dữ liệu: ", err);
        if (err.status === 401) {
          navigate("/unauthenticated");
        } else if (err.status === 403) {
          navigate("/unauthorized");
        } else {
          navigate("/not-found");
        }
      } finally {
        setIsLoading(false);
      }
    };

    const fetchMonthOrders = async () => {
      setIsLoading(false);
      try {
        const promises = [];
        for (let i = 0; i <= 11; i++) {
          promises.push(
            getOrderCountByTime(
              format(new Date(selectedYear, i, 1), "MM/dd/yyyy"),
              format(new Date(selectedYear, i + 1, 0), "MM/dd/yyyy")
            )
          );
        }
        const data = await Promise.all(promises);
        setMonthOrders(data);
      } catch (err) {
        console.error("Lỗi khi lấy dữ liệu: ", err);
        if (err.status === 401) {
          navigate("/unauthenticated");
        } else if (err.status === 403) {
          navigate("/unauthorized");
        } else {
          navigate("/not-found");
        }
      } finally {
        setIsLoading(false);
      }
    };

    const fetchQuarterOrders = async () => {
      setIsLoading(false);
      try {
        const promises = [];
        for (let i = 0; i <= 3; i++) {
          promises.push(
            getOrderCountByTime(
              format(new Date(selectedYear, i * 3, 1), "MM/dd/yyyy"),
              format(new Date(selectedYear, i * 3 + 3, 0), "MM/dd/yyyy")
            )
          );
        }
        const data = await Promise.all(promises);
        setQuarterOrders(data);
      } catch (err) {
        console.error("Lỗi khi lấy dữ liệu: ", err);
        if (err.status === 401) {
          navigate("/unauthenticated");
        } else if (err.status === 403) {
          navigate("/unauthorized");
        } else {
          navigate("/not-found");
        }
      } finally {
        setIsLoading(false);
      }
    };

    const fetchBestSellers = async () => {
      setIsLoading(false);
      try {
        const data = await getBestSeller();
        setBestSellers(() => {
          console.log("best sellers", data);
          return data;
        });
      } catch (err) {
        console.error("Lỗi khi lấy dữ liệu: ", err);
        if (err.status === 401) {
          navigate("/unauthenticated");
        } else if (err.status === 403) {
          navigate("/unauthorized");
        } else {
          navigate("/not-found");
        }
      } finally {
        setIsLoading(false);
      }
    };

    const fetchBestSellersByQuarter = async () => {
      setIsLoading(false);
      try {
        const data = await getBestSellerByQuarter(selectedYear);
        setBestSellersByQuarter(() => {
          console.log("best sellers by quarter", data);
          return data;
        });
      } catch (err) {
        console.error("Lỗi khi lấy dữ liệu: ", err);
        if (err.status === 401) {
          navigate("/unauthenticated");
        } else if (err.status === 403) {
          navigate("/unauthorized");
        } else {
          navigate("/not-found");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchBestSellersByQuarter();
    fetchBestSellers();
    fetchOrdersInPeriodTime();
    fetchQuarterOrders();
    fetchMonthOrders();
    fetchTodayOrders();
    fetchTotalOrders();
    fetchRevenueByProd();
    fetchRevenueByCategory();
    fetchRevenueByPaymentMethod();
    fetchRevenueByPeriodDate();
    fetchRevenueByQuarter();
    fetchRevenueByMonth();
    fetchTotalRevenue();
    fetchAllUserData();
    fetchNewUserData();
    fetchNewUserByQuaterData();
  }, [navigate, selectedYear, selectedDate.start, selectedDate.end]);

  //Chart Dữ Liệu
  const data = {
    labels: ["Quý 1", "Quý 2", "Quý 3", "Quý 4"],
    datasets: [
      {
        label: "New Users",
        data: [
          newUsersByQuarter.quarters["1"],
          newUsersByQuarter.quarters["2"],
          newUsersByQuarter.quarters["3"],
          newUsersByQuarter.quarters["4"],
        ],
        borderColor: "#06B6D4",
        backgroundColor: "rgba(6, 182, 212, 0.2)",
        tension: 0.4, // Điều chỉnh độ cong (interpolation)
        fill: true,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: `Người Dùng Mới Theo Từng Quý Trong Năm ${newUsersByQuarter.year}`,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };
  //Line Orders
  const dataOrders = {
    labels: ["Quý 1", "Quý 2", "Quý 3", "Quý 4"],
    datasets: [
      {
        label: "Orders",
        data: getQuarterOrders,
        borderColor: "#06B6D4",
        backgroundColor: "rgba(6, 182, 212, 0.2)",
        tension: 0.4, // Điều chỉnh độ cong (interpolation)
        fill: true,
      },
    ],
  };

  const optionsOrders = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: `Số Đơn Hàng Theo Từng Quý Trong Năm ${newUsersByQuarter.year}`,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  //Bar Chart
  const dataBar = {
    labels: [
      "Tháng 1",
      "Tháng 2",
      "Tháng 3",
      "Tháng 4",
      "Tháng 5",
      "Tháng 6",
      "Tháng 7",
      "Tháng 8",
      "Tháng 9",
      "Tháng 10",
      "Tháng 11",
      "Tháng 12",
    ],
    datasets: [
      {
        label: "Người Dùng Mới",
        data: newUsers,
        backgroundColor: "rgba(54, 162, 235, 0.5)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 1,
      },
    ],
  };

  const optionsBar = {
    responsive: true,
    plugins: {
      legend: {
        position: "top", // Vị trí của chú thích
      },
      title: {
        display: true,
        text: `Thống kê người dùng mới trong 12 tháng năm ${selectedYear}`,
      },
    },
    scales: {
      y: {
        beginAtZero: true, // Trục Y bắt đầu từ 0
      },
    },
  };

  //Bar Orders
  const dataBarOrders = {
    labels: [
      "Tháng 1",
      "Tháng 2",
      "Tháng 3",
      "Tháng 4",
      "Tháng 5",
      "Tháng 6",
      "Tháng 7",
      "Tháng 8",
      "Tháng 9",
      "Tháng 10",
      "Tháng 11",
      "Tháng 12",
    ],
    datasets: [
      {
        label: "Đơn Hàng",
        data: getMonthOrders,
        backgroundColor: "rgba(54, 162, 235, 0.5)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 1,
      },
    ],
  };

  const optionsBarOrders = {
    responsive: true,
    plugins: {
      legend: {
        position: "top", // Vị trí của chú thích
      },
      title: {
        display: true,
        text: `Thống kê đơn hàng trong 12 tháng năm ${selectedYear}`,
      },
    },
    scales: {
      y: {
        beginAtZero: true, // Trục Y bắt đầu từ 0
      },
    },
  };
  //Doanh Thu Theo Tháng
  const revenueMonth = {
    labels: [
      "Tháng 1",
      "Tháng 2",
      "Tháng 3",
      "Tháng 4",
      "Tháng 5",
      "Tháng 6",
      "Tháng 7",
      "Tháng 8",
      "Tháng 9",
      "Tháng 10",
      "Tháng 11",
      "Tháng 12",
    ],
    datasets: [
      {
        label: "Doanh Thu",
        data: revenueByMonth,
        backgroundColor: "rgba(54, 162, 235, 0.5)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 1,
      },
    ],
  };

  const optionRevenueMonth = {
    responsive: true,
    plugins: {
      legend: {
        position: "top", // Vị trí của chú thích
      },
      title: {
        display: true,
        text: `Thống kê doanh thu trong 12 tháng năm ${selectedYear}`,
      },
    },
    scales: {
      y: {
        beginAtZero: true, // Trục Y bắt đầu từ 0
      },
    },
  };

  //Doanh thu theo quý
  const quarterRevenue = {
    labels: ["Quý 1", "Quý 2", "Quý 3", "Quý 4"],
    datasets: [
      {
        label: "Doanh Thu",
        data: revenueByQuarter,
        borderColor: "#06B6D4",
        backgroundColor: "rgba(6, 182, 212, 0.2)",
        tension: 0.4, // Điều chỉnh độ cong (interpolation)
        fill: true,
      },
    ],
  };

  const optionsQuarterRevenue = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: `Doanh Thu Theo Từng Quý Trong Năm ${newUsersByQuarter.year}`,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  // Polar

  const generateColors = (dataLength) => {
    return Array.from(
      { length: dataLength },
      () =>
        `rgba(${Math.floor(Math.random() * 256)}, 
          ${Math.floor(Math.random() * 256)}, 
          ${Math.floor(Math.random() * 256)}, 0.8)`
    );
  };

  const [dataPolar, setDataPolar] = useState({
    labels: [],
    datasets: [
      {
        label: "Dataset 1",
        data: [],
        backgroundColor: [],
        borderColor: [],
        borderWidth: 1,
      },
    ],
  });

  useEffect(() => {
    if (revenueByProd.$values) {
      const newColors = generateColors(revenueByProd.$values.length);

      setDataPolar({
        labels: revenueByProd.$values.map((item) => item.productName),
        datasets: [
          {
            label: "Dataset 1",
            data: revenueByProd.$values.map((item) => item.totalRevenue),
            backgroundColor: newColors,
            borderColor: newColors,
            borderWidth: 1,
          },
        ],
      });
    }
  }, [revenueByProd]); // Theo dõi thay đổi dữ liệu trong revenueByPM.$value

  const optionsPolar = {
    responsive: true,
    scales: {
      r: {
        grid: {
          color: "#5A5F7D", // Màu đồng nhất
        },
      },
    },
    plugins: {
      legend: {
        position: "right",
      },
      tooltip: {
        enabled: true, // Cái này sẽ tự định dạng số luôn
        callbacks: {
          label: function (tooltipItem) {
            return new Intl.NumberFormat("vi-VN", {
              style: "decimal",
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            }).format(tooltipItem.raw); // Định dạng giá trị tooltip
          },
        },
      },
      title: {
        display: true,
        text: `Doanh Thu Theo Sản Phẩm Trong Năm ${newUsersByQuarter.year}`,
        position: "bottom",
      },
    },
  };
  // Pie Chart

  const [dataPie, setDataPie] = useState({
    labels: [],
    datasets: [
      {
        label: "Dataset 1",
        data: [],
        backgroundColor: [],
        borderColor: [],
        borderWidth: 1,
      },
    ],
  });

  useEffect(() => {
    if (revenueByPM.$values) {
      const newColors = generateColors(revenueByPM.$values.length);

      setDataPie({
        labels: revenueByPM.$values.map((item) => item.paymentMethod),
        datasets: [
          {
            label: "Dataset 1",
            data: revenueByPM.$values.map((item) => item.totalRevenue),
            backgroundColor: newColors,
            borderColor: newColors,
            borderWidth: 1,
          },
        ],
      });
    }
  }, [revenueByPM]);

  const optionsPie = {
    responsive: true,
    plugins: {
      legend: {
        position: "right",
      },
      tooltip: {
        enabled: true, // Cái này sẽ tự định dạng số luôn
        callbacks: {
          label: function (tooltipItem) {
            return new Intl.NumberFormat("vi-VN", {
              style: "decimal",
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            }).format(tooltipItem.raw); // Định dạng giá trị tooltip
          },
        },
      },
      title: {
        display: true,
        text: `Doanh Thu Theo Phương Thức Thanh Toán Trong Năm ${newUsersByQuarter.year}`,
        position: "bottom",
      },
    },
  };

  // DoughNut
  const [dataDoughnut, setDataDoughnut] = useState({
    labels: [],
    datasets: [
      {
        label: "Dataset 1",
        data: [],
        backgroundColor: [],
        borderColor: [],
        borderWidth: 1,
      },
    ],
  });

  useEffect(() => {
    if (revenueByCate.$values) {
      const newColors = generateColors(revenueByCate.$values.length);

      setDataDoughnut({
        labels: revenueByCate.$values.map((item) => item.categoryName),
        datasets: [
          {
            label: "Dataset 1",
            data: revenueByCate.$values.map((item) => item.totalRevenue),
            backgroundColor: newColors,
            borderColor: newColors,
            borderWidth: 1,
          },
        ],
      });
    }
  }, [revenueByCate]);

  const optionsDoghnut = {
    responsive: true,
    plugins: {
      legend: {
        position: "right",
      },
      tooltip: {
        enabled: true, // Cái này sẽ tự định dạng số luôn
        callbacks: {
          label: function (tooltipItem) {
            return new Intl.NumberFormat("vi-VN", {
              style: "decimal",
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            }).format(tooltipItem.raw); // Định dạng giá trị tooltip
          },
        },
      },
      title: {
        display: true,
        text: `Doanh Thu Theo Danh Mục Sản Phẩm Trong Năm ${newUsersByQuarter.year}`,
        position: "bottom",
      },
    },
    cutout: "40%", // Điều chỉnh độ dày của Doughnut chart (phần trống giữa vòng tròn)
  };

  return (
    <div className={clsx(styles["main-statistic"])}>
      <AdminSideBar
        site="statistic"
        className={clsx(styles["side-bar"])}
        isSidebarCollapsed={isSidebarCollapsed}
      ></AdminSideBar>
      <div className={clsx(styles["statistic"])}>
        <AdminNavbar
          toggleSidebar={toggleSidebar}
          isSidebarCollapsed={isSidebarCollapsed}
        />
        <div className={clsx(styles[isChecked ? "main-light" : "main-dark"])}>
          <div className="d-flex justify-content-between align-items-center">
            <div
              className={clsx(
                styles[isChecked ? "filter-light" : "filter-dark"],
                styles["statistic-filter"]
              )}
            >
              Đang Xem Thống Kê Về
              <select
                name="filter-type"
                id="filter-type"
                value={selectedType}
                onChange={handleChangeType}
                className={clsx(styles["filter-type"])}
              >
                <option value="revenue">Doanh Thu</option>
                <option value="orders">Đơn Hàng</option>
                <option value="users">Người Dùng</option>
                <option value="best-seller">Bán Chạy</option>
              </select>
            </div>
            <div
              className={clsx(
                styles[isChecked ? "filter-light" : "filter-dark"],
                styles["statistic-filter"]
              )}
            >
              Thống Kê Trong Năm
              <select
                name="filter-type"
                id="filter-type"
                value={selectedYear}
                onChange={handleChangeYear}
                className={clsx(styles["filter-type"])}
              >
                <option value={new Date().getFullYear()}>
                  {new Date().getFullYear()}
                </option>
                <option value={new Date().getFullYear() - 1}>
                  {new Date().getFullYear() - 1}
                </option>
                <option value={new Date().getFullYear() - 2}>
                  {new Date().getFullYear() - 2}
                </option>
              </select>
            </div>
          </div>
          {selectedType === "revenue" && (
            <>
              <div className={clsx(styles["div-bar-line"])}>
                <div
                  className={clsx(
                    styles[isChecked ? "new-user-light" : "new-user-dark"],
                    styles[
                      !isSidebarCollapsed ? "bar-line" : "bar-line-collapsed"
                    ]
                  )}
                >
                  <Bar data={revenueMonth} options={optionRevenueMonth} />
                </div>

                <div
                  className={clsx(
                    styles[isChecked ? "new-user-light" : "new-user-dark"],
                    styles[
                      !isSidebarCollapsed ? "bar-line" : "bar-line-collapsed"
                    ]
                  )}
                >
                  <Line data={quarterRevenue} options={optionsQuarterRevenue} />
                </div>
              </div>

              <div
                className={clsx(
                  "d-flex justify-content-between align-items-center flex-column",
                  styles[isChecked ? "new-user-light" : "new-user-dark"]
                )}
              >
                <div className={clsx(styles["filter-tiltle"])}>
                  LỌC THEO KHOẢNG THỜI GIAN
                </div>
                <DatePicker
                  selected={selectedDate.start}
                  onChange={(date) =>
                    setSelectedDate((prev) => ({
                      ...prev, // Sao chép các giá trị hiện tại
                      start: date, // Thay đổi thuộc tính `start`
                    }))
                  }
                  dateFormat="MM/dd/yyyy"
                  showDateSelect
                  placeholderText="Start"
                  className={clsx(styles["date"])}
                />
                Đến
                <DatePicker
                  selected={selectedDate.end}
                  onChange={(date) =>
                    date >= selectedDate.start
                      ? setSelectedDate((prev) => ({
                          ...prev, // Sao chép các giá trị hiện tại
                          end: date, // Thay đổi thuộc tính `start`
                        }))
                      : toast.error(
                          "Ngày kết thúc (End) phải lớn hơn hoặc bằng ngày bắt đầu (Start)"
                        )
                  }
                  dateFormat="MM/dd/yyyy"
                  showDateSelect
                  placeholderText="End"
                  className={clsx(styles["date"])}
                />
                <p>
                  Doanh Thu Trong Khoảng{" "}
                  <span className={clsx(styles["revenue"])}>
                    {format(selectedDate.start, "MM/dd/yyyy")}
                  </span>{" "}
                  Đến{" "}
                  <span className={clsx(styles["revenue"])}>
                    {format(selectedDate.end, "MM/dd/yyyy")}
                  </span>{" "}
                  Là:{" "}
                  <span className={clsx(styles["revenue"])}>
                    {new Intl.NumberFormat("vi-VN").format(revenueByPeriodDate)}
                    đ
                  </span>
                </p>
                <div className="d-flex justify-content-center align-items-center w-100 gap-3">
                  <div
                    style={{
                      width: "30%",
                      height: "350px",
                      padding: "0",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <PolarArea data={dataPolar} options={optionsPolar} />
                  </div>
                  <div
                    style={{
                      width: "30%",
                      height: "350px",
                      padding: "0",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Pie data={dataPie} options={optionsPie} />
                  </div>
                  <div
                    style={{
                      width: "30%",
                      height: "350px",
                      padding: "0px",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Doughnut data={dataDoughnut} options={optionsDoghnut} />
                  </div>
                </div>
              </div>
              <div
                className={clsx(
                  "d-flex justify-content-center align-items-center",
                  styles[isChecked ? "new-user-light" : "new-user-dark"]
                )}
              >
                <p>
                  Tổng Doanh Thu :{" "}
                  <span className={clsx(styles["revenue"])}>
                    {totalRevenue}đ
                  </span>
                </p>
              </div>
            </>
          )}
          {selectedType === "users" && (
            <>
              <div className={clsx(styles["div-bar-line"])}>
                <div
                  className={clsx(
                    styles[isChecked ? "new-user-light" : "new-user-dark"],
                    styles[
                      !isSidebarCollapsed ? "bar-line" : "bar-line-collapsed"
                    ]
                  )}
                >
                  <Bar data={dataBar} options={optionsBar} />
                </div>

                <div
                  className={clsx(
                    styles[isChecked ? "new-user-light" : "new-user-dark"],
                    styles[
                      !isSidebarCollapsed ? "bar-line" : "bar-line-collapsed"
                    ]
                  )}
                >
                  <Line data={data} options={options} />
                </div>
              </div>

              <div
                className={clsx(
                  "d-flex justify-content-center align-items-center",
                  styles[isChecked ? "new-user-light" : "new-user-dark"]
                )}
              >
                <p>
                  Tổng Số Người Dùng :{" "}
                  <span className={clsx(styles["revenue"])}>{allUsers}</span>
                </p>
              </div>
            </>
          )}
          {selectedType === "orders" && (
            <>
              <div className={clsx(styles["div-bar-line"])}>
                <div
                  className={clsx(
                    styles[isChecked ? "new-user-light" : "new-user-dark"],
                    styles[
                      !isSidebarCollapsed ? "bar-line" : "bar-line-collapsed"
                    ]
                  )}
                >
                  <Bar data={dataBarOrders} options={optionsBarOrders} />
                </div>

                <div
                  className={clsx(
                    styles[isChecked ? "new-user-light" : "new-user-dark"],
                    styles[
                      !isSidebarCollapsed ? "bar-line" : "bar-line-collapsed"
                    ]
                  )}
                >
                  <Line data={dataOrders} options={optionsOrders} />
                </div>
              </div>

              <div className="d-flex justify-content-between align-items-center">
                <div
                  className={clsx(
                    "d-flex justify-content-center align-items-center flex-column m-0",
                    styles[isChecked ? "new-user-light" : "new-user-dark"],
                    styles["all-order"]
                  )}
                >
                  <p>
                    Tổng Số Đơn Hàng :{" "}
                    <span className={clsx(styles["revenue"])}>
                      {getTotalOrder}
                    </span>
                  </p>

                  <p>
                    Số Đơn Hàng Trong Ngày :{" "}
                    <span className={clsx(styles["revenue"])}>
                      {getTodayOrders}
                    </span>
                  </p>
                </div>

                <div
                  className={clsx(
                    "d-flex justify-content-center align-items-center flex-column m-0",
                    styles[isChecked ? "new-user-light" : "new-user-dark"],
                    styles["all-order-by-time"]
                  )}
                >
                  <div className={clsx(styles["filter-tiltle"])}>
                    LỌC THEO KHOẢNG THỜI GIAN
                  </div>
                  <DatePicker
                    selected={selectedDate.start}
                    onChange={(date) =>
                      setSelectedDate((prev) => ({
                        ...prev, // Sao chép các giá trị hiện tại
                        start: date, // Thay đổi thuộc tính `start`
                      }))
                    }
                    dateFormat="MM/dd/yyyy"
                    showDateSelect
                    placeholderText="Start"
                    className={clsx(styles["date"])}
                  />
                  Đến
                  <DatePicker
                    selected={selectedDate.end}
                    onChange={(date) =>
                      date >= selectedDate.start
                        ? setSelectedDate((prev) => ({
                            ...prev, // Sao chép các giá trị hiện tại
                            end: date, // Thay đổi thuộc tính `start`
                          }))
                        : toast.error(
                            "Ngày kết thúc (End) phải lớn hơn hoặc bằng ngày bắt đầu (Start)"
                          )
                    }
                    dateFormat="MM/dd/yyyy"
                    showDateSelect
                    placeholderText="End"
                    className={clsx(styles["date"])}
                  />
                  <p>
                    Số Đơn Hàng Từ Ngày{" "}
                    <span className={clsx(styles["revenue"])}>
                      {format(selectedDate.start, "MM/dd/yyyy")}
                    </span>{" "}
                    Đến Ngày{" "}
                    <span className={clsx(styles["revenue"])}>
                      {format(selectedDate.end, "MM/dd/yyyy")}
                    </span>{" "}
                    Là{" "}
                    <span className={clsx(styles["revenue"])}>
                      {getOrdersByPeriodTime}
                    </span>
                  </p>
                </div>
              </div>
            </>
          )}
          {selectedType === "best-seller" && (
            <>
              <div
                className={clsx(
                  "d-flex justify-content-center align-items-center flex-column",
                  styles[isChecked ? "new-user-light" : "new-user-dark"]
                )}
              >
                <div>
                  Top 5 Sản Phẩm Bán Chạy Nhất Mọi Thời Điểm{" "}
                  <FontAwesomeIcon icon={faMedal} />
                </div>
                <div className={clsx(styles["best-seller-table"])}>
                  {
                    //có thể dùng .slice(0, 5) để lấy tối đa 5 cái nhưng BE đã xử lý rồi nen ko cần nữa
                    bestSellers.$values.map((item, index) => (
                      <div
                        key={index}
                        className={clsx(styles["best-seller-item"])}
                      >
                        <FontAwesomeIcon icon={faTrophy} /> {index + 1}.{" "}
                        {item?.productName || "Ko Có"}
                      </div>
                    ))
                  }
                </div>
              </div>

              <div
                className={clsx(
                  "d-flex justify-content-center align-items-center flex-column",
                  styles[isChecked ? "new-user-light" : "new-user-dark"]
                )}
              >
                <div className={clsx(styles["best-seller-by-quarter-table"])}>
                  {Array.from({ length: 4 }).map((_, quarterIndex) => {
                    const quarter = quarterIndex + 1; // Quý 1 -> Quý 4
                    return (
                      <div
                        key={quarter}
                        className={clsx(
                          styles[
                            !isSidebarCollapsed
                              ? "best-seller-by-quarter-table-item"
                              : "best-seller-by-quarter-table-item-collapsed"
                          ]
                        )}
                      >
                        <label
                          htmlFor=""
                          className={clsx(
                            styles[
                              !isChecked
                                ? "my-floating-label"
                                : "my-floating-label-dark"
                            ]
                          )}
                        >
                          Quý {quarter}
                        </label>
                        {Array.from({ length: 5 }).map((_, index) => {
                          const item =
                            bestSellersByQuarter.quarters[String(quarter)]
                              .$values[index];
                          return (
                            <div
                              key={index}
                              className={clsx(styles["best-seller-item"])}
                            >
                              {index + 1}. {item?.productName || "Không Có"}
                            </div>
                          );
                        })}
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
      {isLoading && <Loading className={clsx(styles["loading"])}></Loading>}
      <ToastContainer></ToastContainer>
    </div>
  );
};
export default AdminStatistic;
